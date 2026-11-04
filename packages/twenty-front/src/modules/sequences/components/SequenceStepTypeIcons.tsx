import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme';

import { SEQUENCE_STEP_TYPE_CONFIG } from '@/sequences/constants/SequenceStepTypeConfig';
import { type SequenceStep } from '@/sequences/types/SequenceStep';

const StyledContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
`;

type SequenceStepTypeIconsProps = {
  steps: SequenceStep[];
};

// Compact cadence preview, similar to the step icons in HubSpot's list.
export const SequenceStepTypeIcons = ({
  steps,
}: SequenceStepTypeIconsProps) => (
  <StyledContainer>
    {steps.map((step) => {
      const { Icon } = SEQUENCE_STEP_TYPE_CONFIG[step.type];

      return <Icon key={step.id} size={14} />;
    })}
  </StyledContainer>
);
