import { formatSequencePersonPhone } from '@/sequences/utils/formatSequencePersonPhone';

describe('formatSequencePersonPhone', () => {
  it('should join the calling code and strip whitespace', () => {
    expect(
      formatSequencePersonPhone({
        phones: {
          primaryPhoneNumber: '612 34 56 78',
          primaryPhoneCallingCode: '+34',
        },
      }),
    ).toBe('+34612345678');
  });

  it('should return null without a primary phone number', () => {
    expect(formatSequencePersonPhone(null)).toBeNull();
    expect(
      formatSequencePersonPhone({
        phones: { primaryPhoneNumber: '', primaryPhoneCallingCode: '+34' },
      }),
    ).toBeNull();
  });
});
