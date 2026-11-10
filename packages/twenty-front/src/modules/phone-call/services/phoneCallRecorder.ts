import { type PhoneCallRecordingMode } from '@/phone-call/types/PhoneCallRecordingMode';
import { isDefined } from 'twenty-shared/utils';

// Calls go out through the desktop phone app (tel:), so the other voice can
// only be captured from a loopback/stereo-mix input when the OS exposes one.
const SYSTEM_AUDIO_DEVICE_LABEL_PATTERN =
  /stereo mix|mezcla est[eé]reo|loopback|what u hear|cable output|voicemeeter/i;

const RECORDING_MIME_TYPE = 'audio/webm;codecs=opus';

type ActiveRecording = {
  mediaRecorder: MediaRecorder;
  streams: MediaStream[];
  audioContext: AudioContext;
  chunks: Blob[];
};

let activeRecording: ActiveRecording | null = null;
let lastRecording: Blob | null = null;
let pendingStart: Promise<PhoneCallRecordingMode> | null = null;

const stopStreams = (streams: MediaStream[]) => {
  streams.forEach((stream) =>
    stream.getTracks().forEach((track) => track.stop()),
  );
};

const getSystemAudioStream = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const systemAudioDevice = devices.find(
      (device) =>
        device.kind === 'audioinput' &&
        SYSTEM_AUDIO_DEVICE_LABEL_PATTERN.test(device.label),
    );

    if (!isDefined(systemAudioDevice)) {
      return null;
    }

    return await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: systemAudioDevice.deviceId } },
    });
  } catch {
    return null;
  }
};

const discard = () => {
  if (isDefined(activeRecording)) {
    if (activeRecording.mediaRecorder.state !== 'inactive') {
      activeRecording.mediaRecorder.stop();
    }
    stopStreams(activeRecording.streams);
    activeRecording.audioContext.close().catch(() => undefined);
    activeRecording = null;
  }

  lastRecording = null;
};

const startRecording = async (): Promise<PhoneCallRecordingMode> => {
  discard();

  if (
    typeof MediaRecorder === 'undefined' ||
    !isDefined(navigator.mediaDevices?.getUserMedia)
  ) {
    return 'none';
  }

  let microphoneStream: MediaStream;

  try {
    microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
  } catch {
    return 'none';
  }

  const systemAudioStream = await getSystemAudioStream();
  const streams = [microphoneStream, systemAudioStream].filter(isDefined);

  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();

  streams.forEach((stream) =>
    audioContext.createMediaStreamSource(stream).connect(destination),
  );

  const mediaRecorder = new MediaRecorder(
    destination.stream,
    MediaRecorder.isTypeSupported(RECORDING_MIME_TYPE)
      ? { mimeType: RECORDING_MIME_TYPE }
      : undefined,
  );

  const recording: ActiveRecording = {
    mediaRecorder,
    streams,
    audioContext,
    chunks: [],
  };

  mediaRecorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) {
      recording.chunks.push(event.data);
    }
  });

  mediaRecorder.start(1000);
  activeRecording = recording;

  return isDefined(systemAudioStream) ? 'both-voices' : 'microphone';
};

const start = () => {
  pendingStart = startRecording().finally(() => {
    pendingStart = null;
  });

  return pendingStart;
};

// Hanging up right after dialing can happen before the mic permission prompt
// resolves, so stop waits for the pending start instead of leaking the stream.
const stop = async (): Promise<Blob | null> => {
  if (isDefined(pendingStart)) {
    await pendingStart;
  }

  const recording = activeRecording;

  if (!isDefined(recording)) {
    return lastRecording;
  }

  activeRecording = null;

  if (recording.mediaRecorder.state !== 'inactive') {
    await new Promise<void>((resolve) => {
      recording.mediaRecorder.addEventListener('stop', () => resolve(), {
        once: true,
      });
      recording.mediaRecorder.stop();
    });
  }

  stopStreams(recording.streams);
  await recording.audioContext.close().catch(() => undefined);

  lastRecording =
    recording.chunks.length > 0
      ? new Blob(recording.chunks, {
          type: recording.mediaRecorder.mimeType || 'audio/webm',
        })
      : null;

  return lastRecording;
};

const getLastRecording = () => lastRecording;

export const phoneCallRecorder = {
  start,
  stop,
  getLastRecording,
  discard,
};
