import { type SequencePerson } from '@/sequences/types/SequencePerson';

export const formatSequencePersonName = (
  person: Pick<SequencePerson, 'name'> | null | undefined,
): string =>
  [person?.name?.firstName, person?.name?.lastName]
    .filter((namePart) => (namePart ?? '').trim().length > 0)
    .join(' ');
