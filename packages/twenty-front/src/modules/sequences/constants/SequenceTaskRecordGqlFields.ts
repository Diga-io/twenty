import { type RecordGqlFields } from 'twenty-shared/types';

import { SEQUENCE_PERSON_RECORD_GQL_FIELDS } from '@/sequences/constants/SequencePersonRecordGqlFields';

export const SEQUENCE_TASK_RECORD_GQL_FIELDS: RecordGqlFields = {
  id: true,
  title: true,
  status: true,
  dueAt: true,
  createdAt: true,
  taskType: true,
  bodyV2: true,
  assigneeId: true,
  sequenceEnrollmentId: true,
  sequenceEnrollment: {
    id: true,
    status: true,
    currentStepIndex: true,
    sequenceId: true,
  },
  taskTargets: {
    id: true,
    targetPersonId: true,
    targetPerson: SEQUENCE_PERSON_RECORD_GQL_FIELDS,
  },
};
