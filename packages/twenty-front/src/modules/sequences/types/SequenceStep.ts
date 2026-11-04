import { type SequenceStepType } from '@/sequences/types/SequenceStepType';

export type SequenceStep = {
  id: string;
  type: SequenceStepType;
  delayInDays: number;
  title: string;
  instructions: string;
};
