import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { IconX } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';
import { useToast } from 'twenty-ui/components/feedback';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { SEQUENCE_FORM_CONTROL_CLASS_NAME } from '@/sequences/components/SequenceFormStyles';
import { SequencePersonCell } from '@/sequences/components/SequencePersonCell';
import { SEQUENCE_PERSON_RECORD_GQL_FIELDS } from '@/sequences/constants/SequencePersonRecordGqlFields';
import { useEnrollPeopleInSequence } from '@/sequences/hooks/useEnrollPeopleInSequence';
import { type Sequence } from '@/sequences/types/Sequence';
import { type SequencePerson } from '@/sequences/types/SequencePerson';
import { formatSequencePersonName } from '@/sequences/utils/formatSequencePersonName';

const StyledOverlay = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.overlaySecondary};
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
`;

const StyledDialog = styled.div`
  background: ${themeCssVariables.background.primary};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.strong};
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  width: 560px;
`;

const StyledHeader = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md}
    ${themeCssVariables.border.radius.md} 0 0;
  display: flex;
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledSearch = styled.div`
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledList = styled.div`
  border-top: 1px solid ${themeCssVariables.border.color.light};
  flex: 1;
  overflow: auto;
`;

const StyledOption = styled.label<{ isDisabled: boolean }>`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};

  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledOptionHint = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin-left: auto;
`;

const StyledFooter = styled.div`
  align-items: center;
  border-top: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledFooterActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

type SequenceEnrollContactsModalProps = {
  sequence: Sequence;
  activelyEnrolledPersonIds: string[];
  onClose: () => void;
  onEnrolled: () => void;
};

export const SequenceEnrollContactsModal = ({
  sequence,
  activelyEnrolledPersonIds,
  onClose,
  onEnrolled,
}: SequenceEnrollContactsModalProps) => {
  const { t } = useLingui();
  const { enqueueToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const { enrollPeopleInSequence, isEnrolling } = useEnrollPeopleInSequence();

  const { records: people } = useFindManyRecords<
    SequencePerson & { __typename: string; createdAt: string }
  >({
    objectNameSingular: CoreObjectNameSingular.Person,
    recordGqlFields: SEQUENCE_PERSON_RECORD_GQL_FIELDS,
    orderBy: [{ name: { firstName: 'AscNullsLast' } }],
    limit: 500,
    fetchPolicy: 'network-only',
  });

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredPeople = people.filter((person) =>
    [
      formatSequencePersonName(person),
      person.emails?.primaryEmail,
      person.company?.name,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearchTerm),
  );

  const togglePerson = (personId: string) =>
    setSelectedPersonIds((currentIds) =>
      currentIds.includes(personId)
        ? currentIds.filter((currentId) => currentId !== personId)
        : [...currentIds, personId],
    );

  const selectableFilteredPeople = filteredPeople.filter(
    (person) => !activelyEnrolledPersonIds.includes(person.id),
  );

  const areAllSelected =
    selectableFilteredPeople.length > 0 &&
    selectableFilteredPeople.every((person) =>
      selectedPersonIds.includes(person.id),
    );

  const toggleAll = () =>
    setSelectedPersonIds(
      areAllSelected ? [] : selectableFilteredPeople.map((person) => person.id),
    );

  const selectedCount = selectedPersonIds.length;
  const sequenceName = sequence.name;

  const enroll = async () => {
    try {
      await enrollPeopleInSequence({
        sequence,
        people: people.filter((person) =>
          selectedPersonIds.includes(person.id),
        ),
      });
      enqueueToast({
        status: 'success',
        children: t`${selectedCount} contacts enrolled`,
      });
      onEnrolled();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      enqueueToast({
        status: 'error',
        children: t`Could not enroll contacts: ${errorMessage}`,
      });
    }
  };

  return (
    <StyledOverlay onClick={onClose}>
      <StyledDialog
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <StyledHeader>
          {t`Enroll contacts in ${sequenceName}`}
          <Button
            variant="ghost"
            size="sm"
            aria-label={t`Close`}
            startIcon={<IconX size={16} />}
            onClick={onClose}
          />
        </StyledHeader>
        <StyledSearch>
          <input
            className={SEQUENCE_FORM_CONTROL_CLASS_NAME}
            placeholder={t`Search contacts by name, email or company`}
            value={searchTerm}
            autoFocus
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </StyledSearch>
        <StyledList>
          <StyledOption isDisabled={false}>
            <input
              type="checkbox"
              checked={areAllSelected}
              onChange={toggleAll}
            />
            {t`Select all`}
          </StyledOption>
          {filteredPeople.map((person) => {
            const isAlreadyEnrolled = activelyEnrolledPersonIds.includes(
              person.id,
            );

            return (
              <StyledOption key={person.id} isDisabled={isAlreadyEnrolled}>
                <input
                  type="checkbox"
                  disabled={isAlreadyEnrolled}
                  checked={selectedPersonIds.includes(person.id)}
                  onChange={() => togglePerson(person.id)}
                />
                <SequencePersonCell person={person} />
                {isAlreadyEnrolled && (
                  <StyledOptionHint>{t`Already enrolled`}</StyledOptionHint>
                )}
              </StyledOption>
            );
          })}
        </StyledList>
        <StyledFooter>
          <span>{t`${selectedCount} selected`}</span>
          <StyledFooterActions>
            <Button variant="outline" size="sm" onClick={onClose}>
              {t`Cancel`}
            </Button>
            <Button
              variant="solid"
              color="accent"
              size="sm"
              disabled={selectedCount === 0}
              loading={isEnrolling}
              onClick={enroll}
            >
              {t`Enroll`}
            </Button>
          </StyledFooterActions>
        </StyledFooter>
      </StyledDialog>
    </StyledOverlay>
  );
};
