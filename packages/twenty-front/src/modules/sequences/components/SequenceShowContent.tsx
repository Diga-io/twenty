import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { IconArrowLeft, IconUserPlus } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { SequenceEnrollContactsModal } from '@/sequences/components/SequenceEnrollContactsModal';
import { SequenceEnrollmentsTable } from '@/sequences/components/SequenceEnrollmentsTable';
import { SequencesEmptyState } from '@/sequences/components/SequencesEmptyState';
import { SequenceStepsEditor } from '@/sequences/components/SequenceStepsEditor';
import { SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceEnrollmentObjectNameSingular';
import { SEQUENCE_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceObjectNameSingular';
import { SEQUENCE_PERSON_RECORD_GQL_FIELDS } from '@/sequences/constants/SequencePersonRecordGqlFields';
import { SEQUENCES_PATH } from '@/sequences/constants/SequencesPath';
import { type Sequence } from '@/sequences/types/Sequence';
import { type SequenceEnrollment } from '@/sequences/types/SequenceEnrollment';
import { parseSequenceSteps } from '@/sequences/utils/parseSequenceSteps';

const StyledHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  gap: ${themeCssVariables.spacing[4]};
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]} 0;
`;

const StyledHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledBackLink = styled(Link)`
  align-items: center;
  color: ${themeCssVariables.color.blue};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[1]};
  text-decoration: none;
`;

const StyledTitle = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledTabs = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledTab = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  border-bottom: 3px solid
    ${({ isActive }) =>
      isActive ? themeCssVariables.color.blue : 'transparent'};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} 0;
`;

const StyledHeaderActions = styled.div`
  align-self: flex-start;
  padding-top: ${themeCssVariables.spacing[6]};
`;

type SequenceShowTab = 'steps' | 'enrolled';

type SequenceShowContentProps = {
  sequenceId: string;
};

export const SequenceShowContent = ({
  sequenceId,
}: SequenceShowContentProps) => {
  const { t } = useLingui();
  const [activeTab, setActiveTab] = useState<SequenceShowTab>('steps');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const {
    records: sequences,
    loading,
    refetch: refetchSequence,
  } = useFindManyRecords<Sequence>({
    objectNameSingular: SEQUENCE_OBJECT_NAME_SINGULAR,
    recordGqlFields: {
      id: true,
      name: true,
      description: true,
      steps: true,
      createdAt: true,
    },
    filter: { id: { eq: sequenceId } },
    fetchPolicy: 'network-only',
  });

  const { records: enrollments, refetch: refetchEnrollments } =
    useFindManyRecords<SequenceEnrollment>({
      objectNameSingular: SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR,
      recordGqlFields: {
        id: true,
        name: true,
        status: true,
        currentStepIndex: true,
        personId: true,
        sequenceId: true,
        createdAt: true,
        person: SEQUENCE_PERSON_RECORD_GQL_FIELDS,
      },
      filter: { sequenceId: { eq: sequenceId } },
      orderBy: [{ createdAt: 'DescNullsLast' }],
      limit: 1000,
      fetchPolicy: 'network-only',
    });

  const sequence = sequences[0];

  if (!isDefined(sequence)) {
    return loading ? null : (
      <SequencesEmptyState
        title={t`Sequence not found`}
        description={t`It may have been deleted.`}
      />
    );
  }

  const steps = parseSequenceSteps(sequence.steps);
  const activeEnrollmentCount = enrollments.filter(
    (enrollment) => enrollment.status === 'ACTIVE',
  ).length;
  const enrollmentCount = enrollments.length;
  const activelyEnrolledPersonIds = enrollments
    .filter((enrollment) => enrollment.status === 'ACTIVE')
    .map((enrollment) => enrollment.personId)
    .filter(isDefined);

  return (
    <>
      <StyledHeader>
        <StyledHeaderLeft>
          <StyledBackLink to={SEQUENCES_PATH}>
            <IconArrowLeft size={14} />
            {t`Back to sequences`}
          </StyledBackLink>
          <StyledTitle>{sequence.name}</StyledTitle>
          <StyledTabs role="tablist">
            <StyledTab
              role="tab"
              isActive={activeTab === 'steps'}
              onClick={() => setActiveTab('steps')}
            >
              {t`Steps`}
            </StyledTab>
            <StyledTab
              role="tab"
              isActive={activeTab === 'enrolled'}
              onClick={() => setActiveTab('enrolled')}
            >
              {t`Enrolled (${activeEnrollmentCount} active / ${enrollmentCount})`}
            </StyledTab>
          </StyledTabs>
        </StyledHeaderLeft>
        <StyledHeaderActions>
          <Button
            variant="solid"
            color="accent"
            size="sm"
            startIcon={<IconUserPlus size={14} />}
            disabled={steps.length === 0}
            onClick={() => setIsEnrollModalOpen(true)}
          >
            {t`Enroll contacts`}
          </Button>
        </StyledHeaderActions>
      </StyledHeader>
      {activeTab === 'steps' ? (
        <SequenceStepsEditor
          key={sequence.id}
          sequence={sequence}
          onSaved={() => refetchSequence()}
        />
      ) : (
        <SequenceEnrollmentsTable
          enrollments={enrollments}
          steps={steps}
          onChanged={() => refetchEnrollments()}
        />
      )}
      {isEnrollModalOpen && (
        <SequenceEnrollContactsModal
          sequence={sequence}
          activelyEnrolledPersonIds={activelyEnrolledPersonIds}
          onClose={() => setIsEnrollModalOpen(false)}
          onEnrolled={() => {
            setIsEnrollModalOpen(false);
            setActiveTab('enrolled');
            refetchEnrollments();
          }}
        />
      )}
    </>
  );
};
