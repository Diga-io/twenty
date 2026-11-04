import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { Link } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { SequencesEmptyState } from '@/sequences/components/SequencesEmptyState';
import { SequenceStepTypeIcons } from '@/sequences/components/SequenceStepTypeIcons';
import { SequencesTable } from '@/sequences/components/SequencesTable';
import { SequencesTableCell } from '@/sequences/components/SequencesTableCell';
import { SequencesTableRow } from '@/sequences/components/SequencesTableRow';
import { SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceEnrollmentObjectNameSingular';
import { SEQUENCE_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceObjectNameSingular';
import { SEQUENCE_SHOW_PATH } from '@/sequences/constants/SequenceShowPath';
import { type Sequence } from '@/sequences/types/Sequence';
import { type SequenceEnrollment } from '@/sequences/types/SequenceEnrollment';
import { parseSequenceSteps } from '@/sequences/utils/parseSequenceSteps';

const StyledName = styled(Link)`
  color: ${themeCssVariables.color.blue};
  font-weight: ${themeCssVariables.font.weight.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledDescription = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin-top: ${themeCssVariables.spacing[1]};
`;

export const SequencesList = () => {
  const { t } = useLingui();

  const { records: sequences, loading } = useFindManyRecords<Sequence>({
    objectNameSingular: SEQUENCE_OBJECT_NAME_SINGULAR,
    recordGqlFields: {
      id: true,
      name: true,
      description: true,
      steps: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: 'DescNullsLast' }],
    fetchPolicy: 'network-only',
  });

  const { records: enrollments } = useFindManyRecords<SequenceEnrollment>({
    objectNameSingular: SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR,
    recordGqlFields: { id: true, status: true, sequenceId: true },
    limit: 1000,
    fetchPolicy: 'network-only',
  });

  if (!loading && sequences.length === 0) {
    return (
      <SequencesEmptyState
        title={t`No sequences yet`}
        description={t`Create a sequence to automate your call, email and LinkedIn follow-ups.`}
      />
    );
  }

  const countEnrollments = (sequenceId: string, status: string) =>
    enrollments.filter(
      (enrollment) =>
        enrollment.sequenceId === sequenceId && enrollment.status === status,
    ).length;

  return (
    <SequencesTable
      headers={[
        t`Name`,
        t`Steps`,
        t`Active`,
        t`Finished`,
        t`Unenrolled`,
        t`Created`,
      ]}
    >
      {sequences.map((sequence) => {
        const steps = parseSequenceSteps(sequence.steps);

        return (
          <SequencesTableRow key={sequence.id}>
            <SequencesTableCell>
              <StyledName
                to={SEQUENCE_SHOW_PATH.replace(':sequenceId', sequence.id)}
              >
                {sequence.name}
              </StyledName>
              {sequence.description && (
                <StyledDescription>{sequence.description}</StyledDescription>
              )}
            </SequencesTableCell>
            <SequencesTableCell>
              <SequenceStepTypeIcons steps={steps} />
            </SequencesTableCell>
            <SequencesTableCell>
              {countEnrollments(sequence.id, 'ACTIVE')}
            </SequencesTableCell>
            <SequencesTableCell>
              {countEnrollments(sequence.id, 'FINISHED')}
            </SequencesTableCell>
            <SequencesTableCell>
              {countEnrollments(sequence.id, 'UNENROLLED')}
            </SequencesTableCell>
            <SequencesTableCell>
              {new Date(sequence.createdAt).toLocaleDateString()}
            </SequencesTableCell>
          </SequencesTableRow>
        );
      })}
    </SequencesTable>
  );
};
