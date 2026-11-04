import { CoreObjectNameSingular } from 'twenty-shared/types';

import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceEnrollmentObjectNameSingular';
import { type SequenceEnrollment } from '@/sequences/types/SequenceEnrollment';

export const useUnenrollFromSequence = () => {
  const { updateOneRecord } = useUpdateOneRecord();

  const { deleteOneRecord: deleteOneTask } = useDeleteOneRecord({
    objectNameSingular: CoreObjectNameSingular.Task,
  });

  const unenrollFromSequence = async ({
    sequenceEnrollmentId,
    openTaskIds,
  }: {
    sequenceEnrollmentId: string;
    openTaskIds: string[];
  }) => {
    await updateOneRecord<SequenceEnrollment>({
      objectNameSingular: SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR,
      idToUpdate: sequenceEnrollmentId,
      updateOneRecordInput: { status: 'UNENROLLED' },
    });

    // Soft-delete so an accidental unenroll can still be recovered.
    for (const openTaskId of openTaskIds) {
      await deleteOneTask(openTaskId);
    }
  };

  return { unenrollFromSequence };
};
