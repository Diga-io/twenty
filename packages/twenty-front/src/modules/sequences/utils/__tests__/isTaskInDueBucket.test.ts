import { type TaskDueBucket } from '@/sequences/types/TaskDueBucket';
import { isTaskInDueBucket } from '@/sequences/utils/isTaskInDueBucket';

const now = new Date(2026, 10, 4, 12, 0);

const yesterday = new Date(2026, 10, 3, 9, 0).toISOString();
const todayLater = new Date(2026, 10, 4, 18, 0).toISOString();
const tomorrow = new Date(2026, 10, 5, 9, 0).toISOString();

const getBuckets = (dueAt: string | null) =>
  (['DUE_TODAY', 'OVERDUE', 'UPCOMING', 'ANY_DATE'] as TaskDueBucket[]).filter(
    (bucket) => isTaskInDueBucket({ task: { dueAt }, bucket, now }),
  );

describe('isTaskInDueBucket', () => {
  it('should include overdue tasks in due today', () => {
    expect(getBuckets(yesterday)).toEqual(['DUE_TODAY', 'OVERDUE', 'ANY_DATE']);
  });

  it('should place tasks due later today only in due today', () => {
    expect(getBuckets(todayLater)).toEqual(['DUE_TODAY', 'ANY_DATE']);
  });

  it('should place future and undated tasks in upcoming', () => {
    expect(getBuckets(tomorrow)).toEqual(['UPCOMING', 'ANY_DATE']);
    expect(getBuckets(null)).toEqual(['UPCOMING', 'ANY_DATE']);
  });
});
