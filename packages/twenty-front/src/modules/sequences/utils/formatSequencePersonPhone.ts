import { isNonEmptyString } from '@sniptt/guards';

import { type SequencePerson } from '@/sequences/types/SequencePerson';

export const formatSequencePersonPhone = (
  person: Pick<SequencePerson, 'phones'> | null | undefined,
): string | null => {
  const phoneNumber = person?.phones?.primaryPhoneNumber;

  if (!isNonEmptyString(phoneNumber)) {
    return null;
  }

  const callingCode = person?.phones?.primaryPhoneCallingCode ?? '';

  return `${callingCode}${phoneNumber}`.replace(/\s+/g, '');
};
