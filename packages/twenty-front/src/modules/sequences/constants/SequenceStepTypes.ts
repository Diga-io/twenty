import { SEQUENCE_STEP_TYPE_CONFIG } from '@/sequences/constants/SequenceStepTypeConfig';
import { type SequenceStepType } from '@/sequences/types/SequenceStepType';

export const SEQUENCE_STEP_TYPES = Object.keys(
  SEQUENCE_STEP_TYPE_CONFIG,
) as SequenceStepType[];
