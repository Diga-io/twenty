import { isDefined } from 'twenty-shared/utils';

import { type SequencePerson } from '@/sequences/types/SequencePerson';
import { type SequenceTask } from '@/sequences/types/SequenceTask';

export const getSequenceTaskPerson = (
  task: Pick<SequenceTask, 'taskTargets'>,
): SequencePerson | null =>
  task.taskTargets
    ?.map((taskTarget) => taskTarget.targetPerson)
    .find(isDefined) ?? null;
