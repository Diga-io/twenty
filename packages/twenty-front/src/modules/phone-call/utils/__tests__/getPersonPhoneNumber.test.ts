import { getPersonPhoneNumber } from '@/phone-call/utils/getPersonPhoneNumber';

describe('getPersonPhoneNumber', () => {
  it('should prefix the calling code', () => {
    expect(
      getPersonPhoneNumber({
        primaryPhoneNumber: '600123456',
        primaryPhoneCallingCode: '+34',
      }),
    ).toBe('+34 600123456');
  });

  it('should not duplicate an existing international prefix', () => {
    expect(
      getPersonPhoneNumber({
        primaryPhoneNumber: '+34600123456',
        primaryPhoneCallingCode: '+34',
      }),
    ).toBe('+34600123456');
  });

  it('should return an empty string when the person has no phone', () => {
    expect(getPersonPhoneNumber(undefined)).toBe('');
    expect(
      getPersonPhoneNumber({
        primaryPhoneNumber: '  ',
        primaryPhoneCallingCode: '+34',
      }),
    ).toBe('');
  });
});
