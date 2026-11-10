import { type PhoneCallResult } from '@/phone-call/types/PhoneCallResult';
import { msg } from '@lingui/core/macro';
import { type MessageDescriptor } from '@lingui/core';

export const PHONE_CALL_RESULT_OPTIONS: {
  value: PhoneCallResult;
  label: MessageDescriptor;
}[] = [
  {
    value: 'connected',
    label: msg({ message: 'Connected', context: 'phone call result' }),
  },
  {
    value: 'no-answer',
    label: msg({ message: 'No answer', context: 'phone call result' }),
  },
  {
    value: 'busy',
    label: msg({ message: 'Busy', context: 'phone call result' }),
  },
  {
    value: 'voicemail',
    label: msg({ message: 'Voicemail', context: 'phone call result' }),
  },
  {
    value: 'wrong-number',
    label: msg({ message: 'Wrong number', context: 'phone call result' }),
  },
];
