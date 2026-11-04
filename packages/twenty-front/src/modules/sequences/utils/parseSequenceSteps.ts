import { isNonEmptyString, isNumber, isObject } from '@sniptt/guards';

import { type SequenceStep } from '@/sequences/types/SequenceStep';
import { type SequenceStepType } from '@/sequences/types/SequenceStepType';

const SEQUENCE_STEP_TYPES: SequenceStepType[] = [
  'CALL',
  'EMAIL',
  'TODO',
  'LINKEDIN',
];

const isSequenceStepType = (value: unknown): value is SequenceStepType =>
  SEQUENCE_STEP_TYPES.includes(value as SequenceStepType);

// Steps live in a RAW_JSON field, so anything persisted by hand or by an
// older client is normalized instead of trusted.
export const parseSequenceSteps = (rawSteps: unknown): SequenceStep[] => {
  if (!Array.isArray(rawSteps)) {
    return [];
  }

  return rawSteps.flatMap((rawStep, index) => {
    if (!isObject(rawStep)) {
      return [];
    }

    const step = rawStep as Record<string, unknown>;

    return [
      {
        id: isNonEmptyString(step.id) ? step.id : `step-${index}`,
        type: isSequenceStepType(step.type) ? step.type : 'TODO',
        delayInDays:
          isNumber(step.delayInDays) && step.delayInDays >= 0
            ? Math.floor(step.delayInDays)
            : 0,
        title: isNonEmptyString(step.title) ? step.title : '',
        instructions: isNonEmptyString(step.instructions)
          ? step.instructions
          : '',
      },
    ];
  });
};
