import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'twenty-shared/utils';
import { IconPlayerPlay } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

import { SequencePersonCell } from '@/sequences/components/SequencePersonCell';
import { SequencesEmptyState } from '@/sequences/components/SequencesEmptyState';
import { SequencesTable } from '@/sequences/components/SequencesTable';
import { SequencesTableCell } from '@/sequences/components/SequencesTableCell';
import { SequencesTableRow } from '@/sequences/components/SequencesTableRow';
import { SequenceStepTypeTag } from '@/sequences/components/SequenceStepTypeTag';
import { TaskQueueDueDate } from '@/sequences/components/TaskQueueDueDate';
import { type SequenceTask } from '@/sequences/types/SequenceTask';
import { getSequenceTaskPerson } from '@/sequences/utils/getSequenceTaskPerson';

const StyledTitle = styled.div`
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledSequenceName = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

type TaskQueueListProps = {
  tasks: SequenceTask[];
  isLoading: boolean;
  onStartFromTask: (taskId: string) => void;
};

export const TaskQueueList = ({
  tasks,
  isLoading,
  onStartFromTask,
}: TaskQueueListProps) => {
  const { t } = useLingui();

  if (!isLoading && tasks.length === 0) {
    return (
      <SequencesEmptyState
        title={t`You're all caught up`}
        description={t`No open tasks match these filters.`}
      />
    );
  }

  return (
    <SequencesTable headers={[t`Title`, t`Contact`, t`Type`, t`Due date`, '']}>
      {tasks.map((task) => {
        const sequenceName = task.sequenceEnrollment?.sequence?.name;

        return (
          <SequencesTableRow
            key={task.id}
            onClick={() => onStartFromTask(task.id)}
          >
            <SequencesTableCell>
              <StyledTitle>{task.title}</StyledTitle>
              {isDefined(sequenceName) && (
                <StyledSequenceName>{sequenceName}</StyledSequenceName>
              )}
            </SequencesTableCell>
            <SequencesTableCell>
              <SequencePersonCell person={getSequenceTaskPerson(task)} />
            </SequencesTableCell>
            <SequencesTableCell>
              <SequenceStepTypeTag type={task.taskType ?? 'TODO'} />
            </SequencesTableCell>
            <SequencesTableCell>
              <TaskQueueDueDate dueAt={task.dueAt} />
            </SequencesTableCell>
            <SequencesTableCell>
              <Button
                variant="ghost"
                size="sm"
                startIcon={<IconPlayerPlay size={14} />}
                onClick={(event) => {
                  event.stopPropagation();
                  onStartFromTask(task.id);
                }}
              >
                {t`Start`}
              </Button>
            </SequencesTableCell>
          </SequencesTableRow>
        );
      })}
    </SequencesTable>
  );
};
