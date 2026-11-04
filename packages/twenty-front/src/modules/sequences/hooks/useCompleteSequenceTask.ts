import { isNonEmptyString } from '@sniptt/guards';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { v4 } from 'uuid';

import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceEnrollmentObjectNameSingular';
import { useCreateSequenceStepTask } from '@/sequences/hooks/useCreateSequenceStepTask';
import { type SequenceEnrollment } from '@/sequences/types/SequenceEnrollment';
import { type SequenceTask } from '@/sequences/types/SequenceTask';
import { getSequenceTaskPerson } from '@/sequences/utils/getSequenceTaskPerson';
import { parseSequenceSteps } from '@/sequences/utils/parseSequenceSteps';

type CompleteSequenceTaskArgs = {
  task: SequenceTask;
  // Logged as a note on the contact so it shows up in its timeline.
  activityLog?: { title: string; markdown: string } | null;
};

export const useCompleteSequenceTask = () => {
  const { updateOneRecord } = useUpdateOneRecord();
  const { createSequenceStepTask } = useCreateSequenceStepTask();

  const { createOneRecord: createOneNote } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.Note,
    skipPostOptimisticEffect: true,
  });

  const { createOneRecord: createOneNoteTarget } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.NoteTarget,
    skipPostOptimisticEffect: true,
  });

  const completeSequenceTask = async ({
    task,
    activityLog,
  }: CompleteSequenceTaskArgs) => {
    const person = getSequenceTaskPerson(task);

    await updateOneRecord({
      objectNameSingular: CoreObjectNameSingular.Task,
      idToUpdate: task.id,
      updateOneRecordInput: { status: 'DONE' },
    });

    if (
      isDefined(person) &&
      isDefined(activityLog) &&
      isNonEmptyString(activityLog.markdown)
    ) {
      const noteId = v4();

      await createOneNote({
        id: noteId,
        title: activityLog.title,
        bodyV2: { markdown: activityLog.markdown },
      });

      await createOneNoteTarget({
        id: v4(),
        noteId,
        targetPersonId: person.id,
      });
    }

    const enrollment = task.sequenceEnrollment;

    if (
      !isDefined(enrollment) ||
      enrollment.status !== 'ACTIVE' ||
      !isDefined(person)
    ) {
      return;
    }

    const steps = parseSequenceSteps(enrollment.sequence?.steps);
    const nextStepIndex = enrollment.currentStepIndex + 1;
    const nextStep = steps[nextStepIndex];

    if (!isDefined(nextStep)) {
      await updateOneRecord<SequenceEnrollment>({
        objectNameSingular: SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR,
        idToUpdate: enrollment.id,
        updateOneRecordInput: { status: 'FINISHED' },
      });

      return;
    }

    await createSequenceStepTask({
      step: nextStep,
      sequenceEnrollmentId: enrollment.id,
      personId: person.id,
      fromDate: new Date(),
      assigneeId: task.assigneeId,
    });

    await updateOneRecord<SequenceEnrollment>({
      objectNameSingular: SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR,
      idToUpdate: enrollment.id,
      updateOneRecordInput: { currentStepIndex: nextStepIndex },
    });
  };

  return { completeSequenceTask };
};
