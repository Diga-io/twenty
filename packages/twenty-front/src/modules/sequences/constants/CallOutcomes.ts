import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';

export type CallOutcome =
  | 'CONNECTED'
  | 'LEFT_VOICEMAIL'
  | 'NO_ANSWER'
  | 'BUSY'
  | 'WRONG_NUMBER'
  | 'MEETING_BOOKED';

export const CALL_OUTCOMES: { value: CallOutcome; label: MessageDescriptor }[] =
  [
    { value: 'CONNECTED', label: msg`Connected` },
    { value: 'MEETING_BOOKED', label: msg`Meeting booked` },
    { value: 'LEFT_VOICEMAIL', label: msg`Left voicemail` },
    { value: 'NO_ANSWER', label: msg`No answer` },
    { value: 'BUSY', label: msg`Busy` },
    { value: 'WRONG_NUMBER', label: msg`Wrong number` },
  ];
