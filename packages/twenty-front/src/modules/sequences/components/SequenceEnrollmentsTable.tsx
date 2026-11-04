import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Button } from 'twenty-ui/primitives/input';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { SequenceEnrollmentStatusTag } from '@/sequences/components/SequenceEnrollmentStatusTag';
import { SequencePersonCell } from '@/sequences/components/SequencePersonCell';
import { SequencesEmptyState } from '@/sequences/components/SequencesEmptyState';
import { SequenceStepTypeTag } from '@/sequences/components/SequenceStepTypeTag';
import { SequencesTable } from '@/sequences/components/SequencesTable';
import { SequencesTableCell } from '@/sequences/components/SequencesTableCell';
import { SequencesTableRow } from '@/sequences/components/SequencesTableRow';
import { useUnenrollFromSequence } from '@/sequences/hooks/useUnenrollFromSequence';
import { type SequenceEnrollment } from '@/sequences/types/SequenceEnrollment';
import { type SequenceStep } from '@/sequences/types/SequenceStep';
import { type SequenceTask } from '@/sequences/types/SequenceTask';

type SequenceEnrollmentsTableProps = {
  enrollments: SequenceEnrollment[];
  steps: SequenceStep[];
  onChanged: () => void;
};

export const SequenceEnrollmentsTable = ({
  enrollments,
  steps,
  onChanged,
}: SequenceEnrollmentsTableProps) => {
  const { t } = useLingui();
  const { unenrollFromSequence } = useUnenrollFromSequence();
  const [unenrollingId, setUnenrollingId] = useState<string | null>(null);

  const enrollmentIds = enrollments.map((enrollment) => enrollment.id);

  const { records: openTasks, refetch: refetchOpenTasks } =
    useFindManyRecords<SequenceTask>({
      objectNameSingular: CoreObjectNameSingular.Task,
      recordGqlFields: {
        id: true,
        dueAt: true,
        status: true,
        taskType: true,
        sequenceEnrollmentId: true,
      },
      filter: {
        and: [
          { sequenceEnrollmentId: { in: enrollmentIds } },
          { status: { in: ['TODO', 'IN_PROGRESS'] } },
        ],
      },
      skip: enrollmentIds.length === 0,
      limit: 1000,
      fetchPolicy: 'network-only',
    });

  if (enrollments.length === 0) {
    return (
      <SequencesEmptyState
        title={t`No contacts enrolled`}
        description={t`Use "Enroll contacts" to start this sequence for your prospects.`}
      />
    );
  }

  const unenroll = async (enrollment: SequenceEnrollment) => {
    setUnenrollingId(enrollment.id);

    try {
      await unenrollFromSequence({
        sequenceEnrollmentId: enrollment.id,
        openTaskIds: openTasks
          .filter((task) => task.sequenceEnrollmentId === enrollment.id)
          .map((task) => task.id),
      });
      await refetchOpenTasks();
      onChanged();
    } finally {
      setUnenrollingId(null);
    }
  };

  return (
    <SequencesTable
      headers={[
        t`Contact`,
        t`Status`,
        t`Current step`,
        t`Next task due`,
        t`Enrolled`,
        '',
      ]}
    >
      {enrollments.map((enrollment) => {
        const currentStep = steps[enrollment.currentStepIndex];
        const stepNumber = enrollment.currentStepIndex + 1;
        const stepCount = steps.length;
        const nextTask = openTasks.find(
          (task) => task.sequenceEnrollmentId === enrollment.id,
        );

        return (
          <SequencesTableRow key={enrollment.id}>
            <SequencesTableCell>
              <SequencePersonCell person={enrollment.person} />
            </SequencesTableCell>
            <SequencesTableCell>
              <SequenceEnrollmentStatusTag status={enrollment.status} />
            </SequencesTableCell>
            <SequencesTableCell>
              {enrollment.status === 'ACTIVE' && isDefined(currentStep) ? (
                <>
                  {t`${stepNumber} of ${stepCount}`}{' '}
                  <SequenceStepTypeTag type={currentStep.type} />
                </>
              ) : (
                '-'
              )}
            </SequencesTableCell>
            <SequencesTableCell>
              {isDefined(nextTask?.dueAt)
                ? new Date(nextTask.dueAt).toLocaleDateString()
                : '-'}
            </SequencesTableCell>
            <SequencesTableCell>
              {new Date(enrollment.createdAt).toLocaleDateString()}
            </SequencesTableCell>
            <SequencesTableCell>
              {enrollment.status === 'ACTIVE' && (
                <Button
                  variant="ghost"
                  size="sm"
                  color="danger"
                  loading={unenrollingId === enrollment.id}
                  onClick={() => unenroll(enrollment)}
                >
                  {t`Unenroll`}
                </Button>
              )}
            </SequencesTableCell>
          </SequencesTableRow>
        );
      })}
    </SequencesTable>
  );
};
