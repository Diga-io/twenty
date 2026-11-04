import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledRow = styled.tr<{ isClickable: boolean }>`
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'default')};

  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

type SequencesTableRowProps = {
  children: ReactNode;
  onClick?: () => void;
};

export const SequencesTableRow = ({
  children,
  onClick,
}: SequencesTableRowProps) => (
  <StyledRow isClickable={onClick !== undefined} onClick={onClick}>
    {children}
  </StyledRow>
);
