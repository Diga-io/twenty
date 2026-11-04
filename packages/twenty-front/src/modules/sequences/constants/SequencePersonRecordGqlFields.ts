import { type RecordGqlFields } from 'twenty-shared/types';

export const SEQUENCE_PERSON_RECORD_GQL_FIELDS: RecordGqlFields = {
  id: true,
  name: true,
  jobTitle: true,
  avatarUrl: true,
  emails: true,
  phones: true,
  linkedinLink: true,
  company: { id: true, name: true },
};
