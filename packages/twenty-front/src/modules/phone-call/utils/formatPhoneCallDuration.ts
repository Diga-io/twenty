export const formatPhoneCallDuration = (durationInSeconds: number) => {
  const safeDurationInSeconds = Math.max(0, Math.floor(durationInSeconds));
  const minutes = Math.floor(safeDurationInSeconds / 60);
  const seconds = safeDurationInSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
