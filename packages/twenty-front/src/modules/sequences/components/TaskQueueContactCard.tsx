import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { Link } from 'react-router-dom';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import {
  IconBrandLinkedin,
  IconBuildingSkyscraper,
  IconMail,
  IconPhone,
} from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme';

import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { SEQUENCE_PERSON_RECORD_GQL_FIELDS } from '@/sequences/constants/SequencePersonRecordGqlFields';
import { type SequencePerson } from '@/sequences/types/SequencePerson';
import { formatSequencePersonName } from '@/sequences/utils/formatSequencePersonName';
import { formatSequencePersonPhone } from '@/sequences/utils/formatSequencePersonPhone';

const StyledCard = styled.aside`
  background: ${themeCssVariables.background.secondary};
  border-left: 1px solid ${themeCssVariables.border.color.medium};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  overflow: auto;
  padding: ${themeCssVariables.spacing[6]} ${themeCssVariables.spacing[4]};
  width: 340px;
`;

const StyledIdentity = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  text-align: center;
`;

const StyledInitials = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.blue};
  border-radius: 50%;
  color: ${themeCssVariables.color.blue};
  display: flex;
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  height: 64px;
  justify-content: center;
  margin-bottom: ${themeCssVariables.spacing[2]};
  text-transform: uppercase;
  width: 64px;
`;

const StyledName = styled(Link)`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  text-decoration: none;

  &:hover {
    color: ${themeCssVariables.color.blue};
  }
`;

const StyledSubtitle = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledSectionTitle = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.04em;
  padding-bottom: ${themeCssVariables.spacing[1]};
  text-transform: uppercase;
`;

const StyledProperty = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  font-size: ${themeCssVariables.font.size.md};
  gap: ${themeCssVariables.spacing[2]};
  overflow-wrap: anywhere;

  a {
    color: ${themeCssVariables.color.blue};
    text-decoration: none;
  }
`;

const StyledEmptyValue = styled.span`
  color: ${themeCssVariables.font.color.light};
`;

type TaskQueueContactCardProps = {
  person: SequencePerson;
};

export const TaskQueueContactCard = ({
  person: personFromTask,
}: TaskQueueContactCardProps) => {
  const { t } = useLingui();
  // Task targets are fetched too deep for the API to resolve the person's
  // company, so load the full contact on its own.
  const { record: fullPerson } = useFindOneRecord<
    SequencePerson & { __typename: string }
  >({
    objectNameSingular: CoreObjectNameSingular.Person,
    objectRecordId: personFromTask.id,
    recordGqlFields: SEQUENCE_PERSON_RECORD_GQL_FIELDS,
  });
  const person = fullPerson ?? personFromTask;
  const name = formatSequencePersonName(person);
  const phone = formatSequencePersonPhone(person);
  const email = person.emails?.primaryEmail;
  const linkedinUrl = person.linkedinLink?.primaryLinkUrl;
  const initials = name
    .split(' ')
    .map((namePart) => namePart.charAt(0))
    .slice(0, 2)
    .join('');

  return (
    <StyledCard>
      <StyledIdentity>
        <StyledInitials>{initials}</StyledInitials>
        <StyledName to={`/object/person/${person.id}`}>{name}</StyledName>
        {isNonEmptyString(person.jobTitle) && (
          <StyledSubtitle>{person.jobTitle}</StyledSubtitle>
        )}
      </StyledIdentity>
      <StyledSectionTitle>{t`About this contact`}</StyledSectionTitle>
      <StyledProperty>
        <IconPhone size={16} />
        {isNonEmptyString(phone) ? (
          <a href={`tel:${phone}`}>{phone}</a>
        ) : (
          <StyledEmptyValue>{t`No phone number`}</StyledEmptyValue>
        )}
      </StyledProperty>
      <StyledProperty>
        <IconMail size={16} />
        {isNonEmptyString(email) ? (
          <a href={`mailto:${email}`}>{email}</a>
        ) : (
          <StyledEmptyValue>{t`No email`}</StyledEmptyValue>
        )}
      </StyledProperty>
      <StyledProperty>
        <IconBuildingSkyscraper size={16} />
        {isNonEmptyString(person.company?.name) ? (
          <Link to={`/object/company/${person.company.id}`}>
            {person.company.name}
          </Link>
        ) : (
          <StyledEmptyValue>{t`No company`}</StyledEmptyValue>
        )}
      </StyledProperty>
      {isNonEmptyString(linkedinUrl) && (
        <StyledProperty>
          <IconBrandLinkedin size={16} />
          <a href={linkedinUrl} target="_blank" rel="noreferrer">
            {t`LinkedIn profile`}
          </a>
        </StyledProperty>
      )}
    </StyledCard>
  );
};
