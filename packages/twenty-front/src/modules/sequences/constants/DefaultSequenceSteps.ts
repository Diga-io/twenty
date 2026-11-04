import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';

import { type SequenceStep } from '@/sequences/types/SequenceStep';

type DefaultSequenceStep = Pick<SequenceStep, 'type' | 'delayInDays'> & {
  title: MessageDescriptor;
  instructions: MessageDescriptor;
};

// Typical outbound cadence used as a starting point for new sequences.
export const DEFAULT_SEQUENCE_STEPS: DefaultSequenceStep[] = [
  {
    type: 'CALL',
    delayInDays: 0,
    title: msg`Intro call`,
    instructions: msg`Introduce yourself and qualify the need.`,
  },
  {
    type: 'EMAIL',
    delayInDays: 1,
    title: msg`Follow-up email`,
    instructions: msg`Send a short recap with a meeting link.`,
  },
  {
    type: 'CALL',
    delayInDays: 2,
    title: msg`Second call attempt`,
    instructions: msg`Try a different time of day.`,
  },
  {
    type: 'LINKEDIN',
    delayInDays: 2,
    title: msg`Connect on LinkedIn`,
    instructions: msg`Send a personalised connection request.`,
  },
  {
    type: 'CALL',
    delayInDays: 3,
    title: msg`Break-up call`,
    instructions: msg`Last attempt before closing the loop.`,
  },
];
