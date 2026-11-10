export const buildPhoneCallTelHref = (phoneNumber: string) => {
  const trimmedPhoneNumber = phoneNumber.trim();
  const digits = trimmedPhoneNumber.replace(/\D/g, '');

  if (digits.length === 0) {
    return null;
  }

  return `tel:${trimmedPhoneNumber.startsWith('+') ? '+' : ''}${digits}`;
};
