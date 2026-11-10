import { type PhoneCall } from '@/phone-call/types/PhoneCall';
import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const phoneCallState = createAtomState<PhoneCall | null>({
  key: 'phoneCallState',
  defaultValue: null,
});
