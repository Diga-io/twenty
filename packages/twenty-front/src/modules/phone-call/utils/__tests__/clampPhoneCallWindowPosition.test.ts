import { clampPhoneCallWindowPosition } from '@/phone-call/utils/clampPhoneCallWindowPosition';

const windowSize = { width: 300, height: 400 };
const viewportSize = { width: 1000, height: 800 };

describe('clampPhoneCallWindowPosition', () => {
  it('should keep a position that fits in the viewport', () => {
    expect(
      clampPhoneCallWindowPosition({
        position: { x: 100, y: 50 },
        windowSize,
        viewportSize,
      }),
    ).toEqual({ x: 100, y: 50 });
  });

  it('should keep the window fully inside the viewport', () => {
    expect(
      clampPhoneCallWindowPosition({
        position: { x: 950, y: -20 },
        windowSize,
        viewportSize,
      }),
    ).toEqual({ x: 700, y: 0 });
  });
});
