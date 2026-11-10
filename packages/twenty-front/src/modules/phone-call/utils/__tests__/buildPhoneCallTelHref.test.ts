import { buildPhoneCallTelHref } from '@/phone-call/utils/buildPhoneCallTelHref';

describe('buildPhoneCallTelHref', () => {
  it('should keep the international prefix and strip formatting', () => {
    expect(buildPhoneCallTelHref(' +34 600 12-34 56 ')).toBe(
      'tel:+34600123456',
    );
  });

  it('should strip formatting from local numbers', () => {
    expect(buildPhoneCallTelHref('(91) 555 01 02')).toBe('tel:915550102');
  });

  it('should return null when there is no digit', () => {
    expect(buildPhoneCallTelHref('')).toBeNull();
    expect(buildPhoneCallTelHref('abc')).toBeNull();
  });
});
