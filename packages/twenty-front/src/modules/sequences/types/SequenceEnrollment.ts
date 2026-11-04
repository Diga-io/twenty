import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { type Sequence } from '@/sequences/types/Sequence';
import { type SequenceEnrollmentStatus } from '@/sequences/types/SequenceEnrollmentStatus';
import { type SequencePerson } from '@/sequences/types/SequencePerson';

export type SequenceEnrollment = ObjectRecord & {
  name: string;
  status: SequenceEnrollmentStatus;
  currentStepIndex: number;
  personId: string | null;
  sequenceId: string | null;
  person?: SequencePerson | null;
  sequence?: Pick<Sequence, 'id' | 'name' | 'steps'> | null;
};
