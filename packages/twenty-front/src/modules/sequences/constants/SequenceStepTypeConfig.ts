import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import {
  IconBrandLinkedin,
  IconCheckbox,
  IconMail,
  IconPhone,
  type IconComponent,
} from 'twenty-ui/icon';
import { type ThemeColor } from 'twenty-ui/theme';

import { type SequenceStepType } from '@/sequences/types/SequenceStepType';

type SequenceStepTypeConfig = {
  label: MessageDescriptor;
  actionLabel: MessageDescriptor;
  Icon: IconComponent;
  color: ThemeColor;
};

export const SEQUENCE_STEP_TYPE_CONFIG: Record<
  SequenceStepType,
  SequenceStepTypeConfig
> = {
  CALL: {
    label: msg`Call`,
    actionLabel: msg`Call task`,
    Icon: IconPhone,
    color: 'green',
  },
  EMAIL: {
    label: msg`Email`,
    actionLabel: msg`Manual email task`,
    Icon: IconMail,
    color: 'blue',
  },
  LINKEDIN: {
    label: msg`LinkedIn`,
    actionLabel: msg`LinkedIn task`,
    Icon: IconBrandLinkedin,
    color: 'sky',
  },
  TODO: {
    label: msg`To-do`,
    actionLabel: msg`General task`,
    Icon: IconCheckbox,
    color: 'orange',
  },
};
