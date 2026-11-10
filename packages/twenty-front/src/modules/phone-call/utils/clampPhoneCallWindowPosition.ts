export type PhoneCallWindowPosition = { x: number; y: number };

export const clampPhoneCallWindowPosition = ({
  position,
  windowSize,
  viewportSize,
}: {
  position: PhoneCallWindowPosition;
  windowSize: { width: number; height: number };
  viewportSize: { width: number; height: number };
}): PhoneCallWindowPosition => ({
  x: Math.min(
    Math.max(0, position.x),
    Math.max(0, viewportSize.width - windowSize.width),
  ),
  y: Math.min(
    Math.max(0, position.y),
    Math.max(0, viewportSize.height - windowSize.height),
  ),
});
