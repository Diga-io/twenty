import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme';

import { type SequencePerson } from '@/sequences/types/SequencePerson';
import { formatSequencePersonName } from '@/sequences/utils/formatSequencePersonName';

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledInitials = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.tertiary};
  border-radius: 50%;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  flex-shrink: 0;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  height: 28px;
  justify-content: center;
  text-transform: uppercase;
  width: 28px;
`;

const StyledName = styled(Link)`
  color: ${themeCssVariables.color.blue};
  font-weight: ${themeCssVariables.font.weight.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledSubtitle = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

type SequencePersonCellProps = {
  person: SequencePerson | null | undefined;
};

export const SequencePersonCell = ({ person }: SequencePersonCellProps) => {
  const name = formatSequencePersonName(person);
  const initials = name
    .split(' ')
    .map((namePart) => namePart.charAt(0))
    .slice(0, 2)
    .join('');
  const subtitle = [person?.jobTitle, person?.company?.name]
    .filter((value) => (value ?? '').length > 0)
    .join(' · ');

  return (
    <StyledContainer>
      <StyledInitials>{initials}</StyledInitials>
      <div>
        <StyledName
          to={`/object/person/${person?.id ?? ''}`}
          onClick={(event) => event.stopPropagation()}
        >
          {name.length > 0 ? name : '-'}
        </StyledName>
        {subtitle.length > 0 && <StyledSubtitle>{subtitle}</StyledSubtitle>}
      </div>
    </StyledContainer>
  );
};
