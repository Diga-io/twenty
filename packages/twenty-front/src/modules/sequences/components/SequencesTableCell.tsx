import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledCell = styled.td`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[3]};
  vertical-align: middle;
`;

export const SequencesTableCell = ({ children }: { children?: ReactNode }) => (
  <StyledCell>{children}</StyledCell>
);
