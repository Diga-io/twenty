import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { IconCheck } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[12]} ${themeCssVariables.spacing[4]};
  text-align: center;
`;

const StyledIcon = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.blue};
  border-radius: 50%;
  color: ${themeCssVariables.color.blue};
  display: flex;
  height: 56px;
  justify-content: center;
  width: 56px;
`;

const StyledTitle = styled.div`
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledDescription = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
`;

type TaskQueueSessionSummaryProps = {
  completedCount: number;
  skippedCount: number;
  onExit: () => void;
};

export const TaskQueueSessionSummary = ({
  completedCount,
  skippedCount,
  onExit,
}: TaskQueueSessionSummaryProps) => {
  const { t } = useLingui();

  return (
    <StyledContainer>
      <StyledIcon>
        <IconCheck size={28} />
      </StyledIcon>
      <StyledTitle>{t`Queue complete`}</StyledTitle>
      <StyledDescription>
        {t`${completedCount} completed · ${skippedCount} skipped`}
      </StyledDescription>
      <Button variant="solid" color="accent" onClick={onExit}>
        {t`Back to tasks`}
      </Button>
    </StyledContainer>
  );
};
