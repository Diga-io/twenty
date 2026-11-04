import { type Sequence } from '@/sequences/types/Sequence';
import { type SequenceTask } from '@/sequences/types/SequenceTask';
import { attachSequencesToTasks } from '@/sequences/utils/attachSequencesToTasks';

const sequence = {
  __typename: 'Sequence',
  id: 'sequence-1',
  name: 'Outbound',
  description: null,
  steps: [{ type: 'CALL' }, { type: 'EMAIL' }],
} as Sequence;

const buildTask = (
  sequenceEnrollment: SequenceTask['sequenceEnrollment'],
): SequenceTask =>
  ({
    __typename: 'Task',
    id: 'task-1',
    sequenceEnrollment,
  }) as SequenceTask;

describe('attachSequencesToTasks', () => {
  it('should attach the sequence of each enrollment', () => {
    const [task] = attachSequencesToTasks(
      [
        buildTask({
          id: 'enrollment-1',
          currentStepIndex: 0,
          status: 'ACTIVE',
          sequenceId: 'sequence-1',
          sequence: null,
        }),
      ],
      [sequence],
    );

    expect(task.sequenceEnrollment?.sequence).toEqual({
      id: 'sequence-1',
      name: 'Outbound',
      steps: sequence.steps,
    });
  });

  it('should leave tasks without a known sequence untouched', () => {
    const taskWithoutEnrollment = buildTask(null);
    const taskWithUnknownSequence = buildTask({
      id: 'enrollment-2',
      currentStepIndex: 0,
      status: 'ACTIVE',
      sequenceId: 'missing',
      sequence: null,
    });

    const result = attachSequencesToTasks(
      [taskWithoutEnrollment, taskWithUnknownSequence],
      [sequence],
    );

    expect(result[0]).toBe(taskWithoutEnrollment);
    expect(result[1].sequenceEnrollment?.sequence).toBeNull();
  });
});
