import { useLingui } from '@lingui/react/macro';
import { Tag } from 'twenty-ui/primitives/data-display';

import { SEQUENCE_STEP_TYPE_CONFIG } from '@/sequences/constants/SequenceStepTypeConfig';
import { type SequenceStepType } from '@/sequences/types/SequenceStepType';

type SequenceStepTypeTagProps = {
  type: SequenceStepType;
};

export const SequenceStepTypeTag = ({ type }: SequenceStepTypeTagProps) => {
  const { t } = useLingui();
  const { label, Icon, color } = SEQUENCE_STEP_TYPE_CONFIG[type];

  return (
    <Tag color={color} variant="soft" startIcon={<Icon size={14} />}>
      {t(label)}
    </Tag>
  );
};
