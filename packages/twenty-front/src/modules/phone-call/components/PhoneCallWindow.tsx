import { PhoneCallTaskSelect } from '@/phone-call/components/PhoneCallTaskSelect';
import {
  StyledPhoneCallActions,
  StyledPhoneCallBody,
  StyledPhoneCallContact,
  StyledPhoneCallField,
  StyledPhoneCallHeader,
  StyledPhoneCallHeaderButton,
  StyledPhoneCallHeaderTitle,
  StyledPhoneCallPersonName,
  StyledPhoneCallPhoneNumber,
  StyledPhoneCallRecordingDot,
  StyledPhoneCallRecordingStatus,
  StyledPhoneCallSelect,
  StyledPhoneCallTimer,
  StyledPhoneCallWindow,
} from '@/phone-call/components/PhoneCallWindow.styles';
import { PHONE_CALL_RESULT_OPTIONS } from '@/phone-call/constants/PhoneCallResultOptions';
import { usePhoneCallWindowPosition } from '@/phone-call/hooks/usePhoneCallWindowPosition';
import { useRegisterPhoneCall } from '@/phone-call/hooks/useRegisterPhoneCall';
import { phoneCallRecorder } from '@/phone-call/services/phoneCallRecorder';
import { phoneCallState } from '@/phone-call/states/phoneCallState';
import { type PhoneCall } from '@/phone-call/types/PhoneCall';
import { type PhoneCallResult } from '@/phone-call/types/PhoneCallResult';
import { buildPhoneCallTelHref } from '@/phone-call/utils/buildPhoneCallTelHref';
import { formatPhoneCallDuration } from '@/phone-call/utils/formatPhoneCallDuration';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { useEffect, useRef, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { useToast } from 'twenty-ui/components/feedback';
import { IconChevronUp, IconMinus, IconPhone, IconX } from 'twenty-ui/icon';
import { Button, Input, Textarea } from 'twenty-ui/primitives/input';

export const PhoneCallWindow = () => {
  const { t, i18n } = useLingui();
  const { enqueueToast } = useToast();
  const [phoneCall, setPhoneCall] = useAtomState(phoneCallState);
  const { registerPhoneCall, isRegistering } = useRegisterPhoneCall();
  const windowRef = useRef<HTMLElement>(null);
  const { position, handleDragStart, resetPosition } =
    usePhoneCallWindowPosition(windowRef);
  const [now, setNow] = useState(() => Date.now());

  const isCallInProgress = phoneCall?.status === 'in-progress';

  useEffect(() => {
    if (!isCallInProgress) {
      return;
    }

    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(intervalId);
  }, [isCallInProgress]);

  if (!isDefined(phoneCall)) {
    return null;
  }

  const updatePhoneCall = (phoneCallUpdate: Partial<PhoneCall>) =>
    setPhoneCall((currentPhoneCall) =>
      isDefined(currentPhoneCall)
        ? { ...currentPhoneCall, ...phoneCallUpdate }
        : currentPhoneCall,
    );

  const telHref = buildPhoneCallTelHref(phoneCall.phoneNumber);

  const displayedDurationInSeconds =
    isCallInProgress && isDefined(phoneCall.startedAt)
      ? (now - phoneCall.startedAt) / 1000
      : phoneCall.durationInSeconds;

  const headerTitle =
    phoneCall.status === 'in-progress'
      ? t`In call`
      : phoneCall.status === 'ended'
        ? t`Call ended`
        : t({ message: 'Call', context: 'phone call noun' });

  const handleCallClick = async () => {
    const startedAt = Date.now();

    setNow(startedAt);
    updatePhoneCall({
      status: 'in-progress',
      startedAt,
      durationInSeconds: 0,
      isMinimized: false,
      recordingMode: 'requesting',
    });

    const recordingMode = await phoneCallRecorder.start();

    updatePhoneCall({ recordingMode });
  };

  const handleHangUpClick = async () => {
    updatePhoneCall({
      status: 'ended',
      durationInSeconds: isDefined(phoneCall.startedAt)
        ? Math.round((Date.now() - phoneCall.startedAt) / 1000)
        : 0,
    });

    await phoneCallRecorder.stop();
  };

  const handleClose = async () => {
    if (phoneCall.status === 'in-progress') {
      enqueueToast({
        status: 'warning',
        children: t`Hang up the call before closing the window`,
      });
      return;
    }

    if (phoneCall.status === 'ended') {
      if (!isDefined(phoneCall.result)) {
        enqueueToast({
          status: 'warning',
          children: t`Choose the call result to log it before closing`,
        });
        return;
      }

      await registerPhoneCall(phoneCall);
      return;
    }

    phoneCallRecorder.discard();
    setPhoneCall(null);
  };

  const recordingStatus = (() => {
    if (phoneCall.status === 'in-progress') {
      if (phoneCall.recordingMode === 'both-voices') {
        return t`Recording both voices · let them know the call is recorded`;
      }

      if (phoneCall.recordingMode === 'microphone') {
        return t`Recording only your voice · let them know the call is recorded`;
      }

      if (phoneCall.recordingMode === 'requesting') {
        return t`Requesting microphone access…`;
      }

      return t`Not recording: allow microphone access to record calls`;
    }

    if (
      phoneCall.status === 'ended' &&
      (phoneCall.recordingMode === 'microphone' ||
        phoneCall.recordingMode === 'both-voices')
    ) {
      return t`Call recorded: it is saved when you log it`;
    }

    return null;
  })();

  return (
    <StyledPhoneCallWindow
      ref={windowRef}
      aria-label={headerTitle}
      style={
        isDefined(position)
          ? {
              left: position.x,
              top: position.y,
              right: 'auto',
              bottom: 'auto',
            }
          : undefined
      }
    >
      <StyledPhoneCallHeader
        data-status={phoneCall.status}
        onPointerDown={handleDragStart}
        onDoubleClick={resetPosition}
      >
        <IconPhone size={16} />
        <StyledPhoneCallHeaderTitle>{headerTitle}</StyledPhoneCallHeaderTitle>
        {phoneCall.status !== 'ready' && (
          <StyledPhoneCallTimer>
            {formatPhoneCallDuration(displayedDurationInSeconds)}
          </StyledPhoneCallTimer>
        )}
        <StyledPhoneCallHeaderButton
          type="button"
          aria-label={phoneCall.isMinimized ? t`Expand` : t`Minimize`}
          onClick={() =>
            updatePhoneCall({ isMinimized: !phoneCall.isMinimized })
          }
        >
          {phoneCall.isMinimized ? (
            <IconChevronUp size={16} />
          ) : (
            <IconMinus size={16} />
          )}
        </StyledPhoneCallHeaderButton>
        <StyledPhoneCallHeaderButton
          type="button"
          aria-label={t`Close`}
          onClick={handleClose}
        >
          <IconX size={16} />
        </StyledPhoneCallHeaderButton>
      </StyledPhoneCallHeader>

      {!phoneCall.isMinimized && (
        <StyledPhoneCallBody>
          <StyledPhoneCallContact>
            <StyledPhoneCallPersonName>
              {isNonEmptyString(phoneCall.personName)
                ? phoneCall.personName
                : t`Unnamed contact`}
            </StyledPhoneCallPersonName>
            {phoneCall.isPhoneNumberEditable && phoneCall.status === 'ready' ? (
              <StyledPhoneCallField>
                {t`This contact has no phone number`}
                <Input
                  size="sm"
                  type="tel"
                  value={phoneCall.phoneNumber}
                  placeholder={t`Phone number to call`}
                  onValueChange={(phoneNumber) =>
                    updatePhoneCall({ phoneNumber })
                  }
                />
              </StyledPhoneCallField>
            ) : (
              <StyledPhoneCallPhoneNumber>
                {phoneCall.phoneNumber}
              </StyledPhoneCallPhoneNumber>
            )}
          </StyledPhoneCallContact>

          <StyledPhoneCallActions>
            {phoneCall.status === 'in-progress' ? (
              <Button
                variant="solid"
                color="danger"
                startIcon={<IconX size={16} />}
                onClick={handleHangUpClick}
              >
                {t`Hang up`}
              </Button>
            ) : (
              <Button
                variant={phoneCall.status === 'ended' ? 'outline' : 'solid'}
                color="accent"
                startIcon={<IconPhone size={16} />}
                // Passing href makes Button drop its icon, so render the
                // anchor explicitly to keep the icon on the tel: link.
                nativeButton={!isDefined(telHref)}
                render={isDefined(telHref) ? <a href={telHref} /> : undefined}
                disabled={!isDefined(telHref) || isRegistering}
                onClick={handleCallClick}
              >
                {phoneCall.status === 'ended'
                  ? t`Call again`
                  : t({ message: 'Call', context: 'phone call action' })}
              </Button>
            )}
          </StyledPhoneCallActions>

          {isDefined(recordingStatus) && (
            <StyledPhoneCallRecordingStatus
              data-recording={
                phoneCall.status === 'in-progress' &&
                (phoneCall.recordingMode === 'microphone' ||
                  phoneCall.recordingMode === 'both-voices')
              }
            >
              <StyledPhoneCallRecordingDot />
              {recordingStatus}
            </StyledPhoneCallRecordingStatus>
          )}

          <StyledPhoneCallField>
            {t`Result`}
            <StyledPhoneCallSelect
              value={phoneCall.result ?? ''}
              disabled={phoneCall.status === 'ready'}
              onChange={(event) =>
                updatePhoneCall({
                  result: isNonEmptyString(event.target.value)
                    ? (event.target.value as PhoneCallResult)
                    : null,
                })
              }
            >
              <option value="">{t`Choose a result…`}</option>
              {PHONE_CALL_RESULT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {i18n._(option.label)}
                </option>
              ))}
            </StyledPhoneCallSelect>
          </StyledPhoneCallField>

          <PhoneCallTaskSelect
            personId={phoneCall.personId}
            taskId={phoneCall.taskId}
            onTaskIdChange={(taskId) => updatePhoneCall({ taskId })}
          />

          <StyledPhoneCallField>
            {t`Call notes`}
            <Textarea
              size="sm"
              autoResize
              maxRows={8}
              value={phoneCall.notes}
              placeholder={t`What they told you, next steps…`}
              onValueChange={(notes) => updatePhoneCall({ notes })}
            />
          </StyledPhoneCallField>

          <Button
            variant="solid"
            color="accent"
            fullWidth
            loading={isRegistering}
            disabled={
              phoneCall.status !== 'ended' || !isDefined(phoneCall.result)
            }
            onClick={() => registerPhoneCall(phoneCall)}
          >
            {isDefined(phoneCall.taskId)
              ? t`Log call and complete task`
              : t`Log call`}
          </Button>
        </StyledPhoneCallBody>
      )}
    </StyledPhoneCallWindow>
  );
};
