import { type SequencePerson } from '@/sequences/types/SequencePerson';
import { getSequenceTaskPerson } from '@/sequences/utils/getSequenceTaskPerson';

const person = {
  id: 'person-1',
  name: { firstName: 'Ada', lastName: 'Lovelace' },
} as SequencePerson;

describe('getSequenceTaskPerson', () => {
  it('should return the first target that is a person', () => {
    expect(
      getSequenceTaskPerson({
        taskTargets: [
          { id: 'target-1', targetPersonId: null, targetPerson: null },
          { id: 'target-2', targetPersonId: 'person-1', targetPerson: person },
        ],
      }),
    ).toBe(person);
  });

  it('should return null when no target is a person', () => {
    expect(getSequenceTaskPerson({ taskTargets: [] })).toBeNull();
    expect(getSequenceTaskPerson({})).toBeNull();
  });
});
