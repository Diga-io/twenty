import { isDefined } from 'twenty-shared/utils';

import { type Sequence } from '@/sequences/types/Sequence';
import { type SequenceTask } from '@/sequences/types/SequenceTask';

// The API does not resolve task -> sequenceEnrollment -> sequence, so the
// sequence (and its steps) is fetched on its own and attached here.
export const attachSequencesToTasks = (
  tasks: SequenceTask[],
  sequences: Pick<Sequence, 'id' | 'name' | 'steps'>[],
): SequenceTask[] => {
  const sequencesById = new Map(
    sequences.map((sequence) => [sequence.id, sequence]),
  );

  return tasks.map((task) => {
    const enrollment = task.sequenceEnrollment;
    const sequence = isDefined(enrollment?.sequenceId)
      ? sequencesById.get(enrollment.sequenceId)
      : undefined;

    if (!isDefined(enrollment) || !isDefined(sequence)) {
      return task;
    }

    return {
      ...task,
      sequenceEnrollment: {
        ...enrollment,
        sequence: {
          id: sequence.id,
          name: sequence.name,
          steps: sequence.steps,
        },
      },
    };
  });
};
