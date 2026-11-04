import { computeSequenceStepDueAt } from '@/sequences/utils/computeSequenceStepDueAt';

describe('computeSequenceStepDueAt', () => {
  it('should add the delay in days to the reference date', () => {
    expect(
      computeSequenceStepDueAt({
        fromDate: new Date('2026-11-04T10:00:00.000Z'),
        delayInDays: 3,
      }).toISOString(),
    ).toBe('2026-11-07T10:00:00.000Z');
  });

  it('should keep the reference date for a zero delay', () => {
    expect(
      computeSequenceStepDueAt({
        fromDate: new Date('2026-11-04T10:00:00.000Z'),
        delayInDays: 0,
      }).toISOString(),
    ).toBe('2026-11-04T10:00:00.000Z');
  });
});
