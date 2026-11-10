import { formatPhoneCallDuration } from '@/phone-call/utils/formatPhoneCallDuration';

describe('formatPhoneCallDuration', () => {
  it('should pad minutes and seconds', () => {
    expect(formatPhoneCallDuration(0)).toBe('00:00');
    expect(formatPhoneCallDuration(5)).toBe('00:05');
    expect(formatPhoneCallDuration(205)).toBe('03:25');
  });

  it('should keep counting minutes past one hour', () => {
    expect(formatPhoneCallDuration(3725)).toBe('62:05');
  });

  it('should floor fractions and ignore negative values', () => {
    expect(formatPhoneCallDuration(59.9)).toBe('00:59');
    expect(formatPhoneCallDuration(-3)).toBe('00:00');
  });
});
