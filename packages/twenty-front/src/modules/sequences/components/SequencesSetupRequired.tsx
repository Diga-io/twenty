import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { IconTimelineEvent } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

import { useSetupSequencesDataModel } from '@/sequences/hooks/useSetupSequencesDataModel';

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  justify-content: center;
  margin: 0 auto;
  max-width: 480px;
  padding: ${themeCssVariables.spacing[12]} ${themeCssVariables.spacing[4]};
  text-align: center;
`;

const StyledTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledDescription = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  margin: 0;
`;

export const SequencesSetupRequired = () => {
  const { t } = useLingui();
  const { setupSequencesDataModel, isSettingUp } = useSetupSequencesDataModel();

  return (
    <StyledContainer>
      <IconTimelineEvent size={40} />
      <StyledTitle>{t`Set up sequences`}</StyledTitle>
      <StyledDescription>
        {t`Sequences add Sequence and Sequence enrollment objects to your workspace, plus a task type and a sequence link on tasks. This only needs to be done once.`}
      </StyledDescription>
      <Button
        variant="solid"
        color="accent"
        loading={isSettingUp}
        onClick={setupSequencesDataModel}
      >
        {t`Set up sequences`}
      </Button>
    </StyledContainer>
  );
};
