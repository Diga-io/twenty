import { isNonEmptyString } from '@sniptt/guards';

import { type SequenceTask } from '@/sequences/types/SequenceTask';

const getDueTime = (task: Pick<SequenceTask, 'dueAt'>) =>
  isNonEmptyString(task.dueAt)
    ? new Date(task.dueAt).getTime()
    : Number.POSITIVE_INFINITY;

export const sortTasksForQueue = <
  TTask extends Pick<SequenceTask, 'dueAt' | 'createdAt'>,
>(
  tasks: TTask[],
): TTask[] =>
  [...tasks].sort(
    (taskA, taskB) =>
      getDueTime(taskA) - getDueTime(taskB) ||
      taskA.createdAt.localeCompare(taskB.createdAt),
  );
