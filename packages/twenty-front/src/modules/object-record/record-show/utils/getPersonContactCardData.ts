import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { isNonEmptyString } from '@sniptt/guards';

export type PersonContactCardData = {
  subtitle: string;
  email: string | null;
  phoneLabel: string | null;
  phoneHref: string | null;
  companyId: string | null;
  companyName: string | null;
};

const readString = (value: unknown): string | null =>
  isNonEmptyString(value) ? value.trim() || null : null;

const readObject = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : null;

// Builds the "Job title · Company" line and the direct contact links shown
// in the person contact card header.
export const getPersonContactCardData = (
  record: ObjectRecord | null | undefined,
): PersonContactCardData => {
  const jobTitle = readString(record?.jobTitle);

  const company = readObject(record?.company);
  const companyName = readString(company?.name);
  const companyId = readString(company?.id);

  const emails = readObject(record?.emails);
  const email = readString(emails?.primaryEmail);

  const phones = readObject(record?.phones);
  const phoneNumber = readString(phones?.primaryPhoneNumber);
  const callingCode = readString(phones?.primaryPhoneCallingCode);

  const phoneLabel = phoneNumber
    ? [callingCode, phoneNumber].filter(isNonEmptyString).join(' ')
    : null;

  const phoneHref = phoneLabel
    ? `tel:${phoneLabel.replace(/[^\d+]/g, '')}`
    : null;

  return {
    subtitle: [jobTitle, companyName].filter(isNonEmptyString).join(' · '),
    email,
    phoneLabel,
    phoneHref,
    companyId,
    companyName,
  };
};
