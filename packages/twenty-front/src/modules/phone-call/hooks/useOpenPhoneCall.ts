import { phoneCallRecorder } from '@/phone-call/services/phoneCallRecorder';
import { phoneCallState } from '@/phone-call/states/phoneCallState';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'twenty-shared/utils';
import { useToast } from 'twenty-ui/components/feedback';

type OpenPhoneCallArgs = {
  personId: string;
  personName: string;
  phoneNumber: string;
};

export const useOpenPhoneCall = () => {
  const { t } = useLingui();
  const { enqueueToast } = useToast();
  const [phoneCall, setPhoneCall] = useAtomState(phoneCallState);

  const openPhoneCall = ({
    personId,
    personName,
    phoneNumber,
  }: OpenPhoneCallArgs) => {
    if (isDefined(phoneCall) && phoneCall.personId === personId) {
      setPhoneCall({ ...phoneCall, isMinimized: false });
      return;
    }

    if (isDefined(phoneCall) && phoneCall.status !== 'ready') {
      setPhoneCall({ ...phoneCall, isMinimized: false });
      enqueueToast({
        status: 'warning',
        children: t`Finish and log the current call before starting another one`,
      });
      return;
    }

    phoneCallRecorder.discard();
    setPhoneCall({
      personId,
      personName,
      phoneNumber,
      isPhoneNumberEditable: phoneNumber.trim() === '',
      status: 'ready',
      startedAt: null,
      durationInSeconds: 0,
      result: null,
      notes: '',
      taskId: null,
      isMinimized: false,
      recordingMode: 'none',
    });
  };

  return { openPhoneCall };
};
