import { isNonEmptyString } from '@sniptt/guards';

type PersonPhones = {
  primaryPhoneNumber?: string | null;
  primaryPhoneCallingCode?: string | null;
};

export const getPersonPhoneNumber = (
  phones: PersonPhones | null | undefined,
) => {
  const primaryPhoneNumber = phones?.primaryPhoneNumber?.trim();

  if (!isNonEmptyString(primaryPhoneNumber)) {
    return '';
  }

  const callingCode = phones?.primaryPhoneCallingCode?.trim();

  if (!isNonEmptyString(callingCode) || primaryPhoneNumber.startsWith('+')) {
    return primaryPhoneNumber;
  }

  return `${callingCode} ${primaryPhoneNumber}`;
};
