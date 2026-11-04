import { isNonEmptyString } from '@sniptt/guards';

import { type SequenceTask } from '@/sequences/types/SequenceTask';
import { type TaskDueBucket } from '@/sequences/types/TaskDueBucket';

const getStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getEndOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

// "Due today" includes overdue work, like HubSpot's default queue view.
export const isTaskInDueBucket = ({
  task,
  bucket,
  now,
}: {
  task: Pick<SequenceTask, 'dueAt'>;
  bucket: TaskDueBucket;
  now: Date;
}): boolean => {
  if (bucket === 'ANY_DATE') {
    return true;
  }

  if (!isNonEmptyString(task.dueAt)) {
    return bucket === 'UPCOMING';
  }

  const dueTime = new Date(task.dueAt).getTime();

  switch (bucket) {
    case 'DUE_TODAY':
      return dueTime < getEndOfDay(now).getTime();
    case 'OVERDUE':
      return dueTime < getStartOfDay(now).getTime();
    case 'UPCOMING':
      return dueTime >= getEndOfDay(now).getTime();
  }
};
