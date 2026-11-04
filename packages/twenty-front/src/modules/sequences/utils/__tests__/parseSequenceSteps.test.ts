import { parseSequenceSteps } from '@/sequences/utils/parseSequenceSteps';

describe('parseSequenceSteps', () => {
  it('should return an empty list for non-array values', () => {
    expect(parseSequenceSteps(null)).toEqual([]);
    expect(parseSequenceSteps({ type: 'CALL' })).toEqual([]);
  });

  it('should keep valid steps and normalize invalid fields', () => {
    expect(
      parseSequenceSteps([
        {
          id: 'a',
          type: 'CALL',
          delayInDays: 2.7,
          title: 'Intro call',
          instructions: 'Ask for budget',
        },
        { type: 'FAX', delayInDays: -3 },
        'not a step',
      ]),
    ).toEqual([
      {
        id: 'a',
        type: 'CALL',
        delayInDays: 2,
        title: 'Intro call',
        instructions: 'Ask for budget',
      },
      {
        id: 'step-1',
        type: 'TODO',
        delayInDays: 0,
        title: '',
        instructions: '',
      },
    ]);
  });
});
