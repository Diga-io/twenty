import { formatPhoneCallDuration } from '@/phone-call/utils/formatPhoneCallDuration';
import { isNonEmptyString } from '@sniptt/guards';

type PhoneCallNoteLabels = {
  call: string;
  result: string;
  duration: string;
  phoneNumber: string;
  notes: string;
  recordingAttached: string;
};

type BuildPhoneCallNoteContentArgs = {
  labels: PhoneCallNoteLabels;
  resultLabel: string;
  durationInSeconds: number;
  phoneNumber: string;
  notes: string;
  hasRecording: boolean;
};

export const buildPhoneCallNoteContent = ({
  labels,
  resultLabel,
  durationInSeconds,
  phoneNumber,
  notes,
  hasRecording,
}: BuildPhoneCallNoteContentArgs) => {
  const formattedDuration = formatPhoneCallDuration(durationInSeconds);
  const trimmedNotes = notes.trim();

  const markdownLines = [
    `**${labels.result}:** ${resultLabel}`,
    '',
    `**${labels.duration}:** ${formattedDuration}`,
    '',
    `**${labels.phoneNumber}:** ${phoneNumber}`,
    ...(isNonEmptyString(trimmedNotes)
      ? ['', `**${labels.notes}:**`, '', trimmedNotes]
      : []),
    ...(hasRecording ? ['', `_${labels.recordingAttached}_`] : []),
  ];

  return {
    title: `${labels.call} · ${resultLabel} · ${formattedDuration}`,
    markdown: markdownLines.join('\n'),
  };
};
