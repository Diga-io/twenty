import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const StyledHeaderCell = styled.th`
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.04em;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  position: sticky;
  text-align: left;
  text-transform: uppercase;
  top: 0;
  white-space: nowrap;
  z-index: 1;
`;

type SequencesTableProps = {
  headers: ReactNode[];
  children: ReactNode;
};

export const SequencesTable = ({ headers, children }: SequencesTableProps) => (
  <StyledTable>
    <thead>
      <tr>
        {headers.map((header, index) => (
          <StyledHeaderCell key={index}>{header}</StyledHeaderCell>
        ))}
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </StyledTable>
);
