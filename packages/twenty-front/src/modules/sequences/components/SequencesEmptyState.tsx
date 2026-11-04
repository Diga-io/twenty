import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-direction: column;
  font-size: ${themeCssVariables.font.size.md};
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[12]} ${themeCssVariables.spacing[4]};
  text-align: center;
`;

const StyledTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

type SequencesEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export const SequencesEmptyState = ({
  title,
  description,
  action,
}: SequencesEmptyStateProps) => (
  <StyledContainer>
    <StyledTitle>{title}</StyledTitle>
    <div>{description}</div>
    {action}
  </StyledContainer>
);
