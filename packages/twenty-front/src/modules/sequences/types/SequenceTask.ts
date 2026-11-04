import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { type Sequence } from '@/sequences/types/Sequence';
import { type SequenceEnrollment } from '@/sequences/types/SequenceEnrollment';
import { type SequencePerson } from '@/sequences/types/SequencePerson';
import { type SequenceStepType } from '@/sequences/types/SequenceStepType';

export type SequenceTask = ObjectRecord & {
  createdAt: string;
  title: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | null;
  dueAt: string | null;
  taskType: SequenceStepType | null;
  bodyV2: { markdown: string | null } | null;
  assigneeId: string | null;
  sequenceEnrollmentId: string | null;
  sequenceEnrollment?:
    | (Pick<
        SequenceEnrollment,
        'id' | 'currentStepIndex' | 'status' | 'sequenceId'
      > & {
        sequence?: Pick<Sequence, 'id' | 'name' | 'steps'> | null;
      })
    | null;
  taskTargets?: {
    id: string;
    targetPersonId: string | null;
    targetPerson?: SequencePerson | null;
  }[];
};
