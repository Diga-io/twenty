const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

// Delays are relative to the moment the previous step is completed (or to the
// enrollment for the first step), mirroring how HubSpot schedules sequences.
export const computeSequenceStepDueAt = ({
  fromDate,
  delayInDays,
}: {
  fromDate: Date;
  delayInDays: number;
}): Date => new Date(fromDate.getTime() + delayInDays * MILLISECONDS_IN_A_DAY);
