import { v4 } from 'uuid';
import { CoreObjectNameSingular } from 'twenty-shared/types';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { type SequenceStep } from '@/sequences/types/SequenceStep';
import { type SequenceTask } from '@/sequences/types/SequenceTask';
import { computeSequenceStepDueAt } from '@/sequences/utils/computeSequenceStepDueAt';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

type CreateSequenceStepTaskArgs = {
  step: SequenceStep;
  sequenceEnrollmentId: string;
  personId: string;
  fromDate: Date;
  assigneeId?: string | null;
};

export const useCreateSequenceStepTask = () => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const { createOneRecord: createOneTask } = useCreateOneRecord<SequenceTask>({
    objectNameSingular: CoreObjectNameSingular.Task,
    skipPostOptimisticEffect: true,
  });

  const { createOneRecord: createOneTaskTarget } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.TaskTarget,
    skipPostOptimisticEffect: true,
  });

  const createSequenceStepTask = async ({
    step,
    sequenceEnrollmentId,
    personId,
    fromDate,
    assigneeId,
  }: CreateSequenceStepTaskArgs) => {
    const taskId = v4();

    await createOneTask({
      id: taskId,
      title: step.title,
      taskType: step.type,
      status: 'TODO',
      dueAt: computeSequenceStepDueAt({
        fromDate,
        delayInDays: step.delayInDays,
      }).toISOString(),
      bodyV2: { markdown: step.instructions },
      assigneeId: assigneeId ?? currentWorkspaceMember?.id ?? null,
      sequenceEnrollmentId,
    });

    await createOneTaskTarget({
      id: v4(),
      taskId,
      targetPersonId: personId,
    });

    return taskId;
  };

  return { createSequenceStepTask };
};
