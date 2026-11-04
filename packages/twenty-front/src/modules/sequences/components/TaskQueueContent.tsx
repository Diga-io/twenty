import { styled } from '@linaria/react';
import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconPlayerPlay } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

import { TaskQueueFilterChip } from '@/sequences/components/TaskQueueFilterChip';
import { TaskQueueList } from '@/sequences/components/TaskQueueList';
import { TaskQueueSession } from '@/sequences/components/TaskQueueSession';
import { SEQUENCE_STEP_TYPE_CONFIG } from '@/sequences/constants/SequenceStepTypeConfig';
import { SEQUENCE_STEP_TYPES } from '@/sequences/constants/SequenceStepTypes';
import { useTaskQueueTasks } from '@/sequences/hooks/useTaskQueueTasks';
import { type SequenceStepType } from '@/sequences/types/SequenceStepType';
import { type SequenceTask } from '@/sequences/types/SequenceTask';
import { type TaskDueBucket } from '@/sequences/types/TaskDueBucket';
import { isTaskInDueBucket } from '@/sequences/utils/isTaskInDueBucket';

const DUE_BUCKETS: { value: TaskDueBucket; label: MessageDescriptor }[] = [
  { value: 'DUE_TODAY', label: msg`Due today` },
  { value: 'OVERDUE', label: msg`Overdue` },
  { value: 'UPCOMING', label: msg`Upcoming` },
  { value: 'ANY_DATE', label: msg`All` },
];

const StyledToolbar = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[4]};
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledChipRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledChipCount = styled.span`
  margin-left: ${themeCssVariables.spacing[1]};
  opacity: 0.7;
`;

const StyledSeparator = styled.span`
  background: ${themeCssVariables.border.color.medium};
  height: 16px;
  width: 1px;
`;

type TaskQueueSessionSnapshot = {
  tasks: SequenceTask[];
  initialIndex: number;
};

export const TaskQueueContent = () => {
  const { t } = useLingui();

  const [dueBucket, setDueBucket] = useState<TaskDueBucket>('DUE_TODAY');
  const [taskType, setTaskType] = useState<SequenceStepType | null>(null);
  const [onlyMine, setOnlyMine] = useState(true);
  const [session, setSession] = useState<TaskQueueSessionSnapshot | null>(null);

  const { tasks, loading, refetch } = useTaskQueueTasks({ onlyMine });

  const now = new Date();
  const tasksOfType = tasks.filter(
    (task) => !isDefined(taskType) || (task.taskType ?? 'TODO') === taskType,
  );
  const visibleTasks = tasksOfType.filter((task) =>
    isTaskInDueBucket({ task, bucket: dueBucket, now }),
  );
  const visibleTaskCount = visibleTasks.length;

  // The session works on a frozen snapshot so completing a task does not
  // reshuffle the queue under the user.
  const startSession = (initialIndex: number) =>
    setSession({ tasks: visibleTasks, initialIndex });

  const exitSession = () => {
    setSession(null);
    refetch();
  };

  if (isDefined(session)) {
    return (
      <TaskQueueSession
        tasks={session.tasks}
        initialIndex={session.initialIndex}
        onExit={exitSession}
      />
    );
  }

  return (
    <>
      <StyledToolbar>
        <StyledFilters>
          <StyledChipRow>
            {DUE_BUCKETS.map((bucket) => (
              <TaskQueueFilterChip
                key={bucket.value}
                isActive={dueBucket === bucket.value}
                onClick={() => setDueBucket(bucket.value)}
              >
                {t(bucket.label)}
                <StyledChipCount>
                  {
                    tasksOfType.filter((task) =>
                      isTaskInDueBucket({ task, bucket: bucket.value, now }),
                    ).length
                  }
                </StyledChipCount>
              </TaskQueueFilterChip>
            ))}
          </StyledChipRow>
          <StyledChipRow>
            <TaskQueueFilterChip
              isActive={!isDefined(taskType)}
              onClick={() => setTaskType(null)}
            >
              {t`All types`}
            </TaskQueueFilterChip>
            {SEQUENCE_STEP_TYPES.map((stepType) => (
              <TaskQueueFilterChip
                key={stepType}
                isActive={taskType === stepType}
                onClick={() => setTaskType(stepType)}
              >
                {t(SEQUENCE_STEP_TYPE_CONFIG[stepType].label)}
              </TaskQueueFilterChip>
            ))}
            <StyledSeparator />
            <TaskQueueFilterChip
              isActive={onlyMine}
              onClick={() => setOnlyMine(true)}
            >
              {t`Assigned to me`}
            </TaskQueueFilterChip>
            <TaskQueueFilterChip
              isActive={!onlyMine}
              onClick={() => setOnlyMine(false)}
            >
              {t`Everyone`}
            </TaskQueueFilterChip>
          </StyledChipRow>
        </StyledFilters>
        <Button
          variant="solid"
          color="accent"
          size="sm"
          startIcon={<IconPlayerPlay size={14} />}
          disabled={visibleTaskCount === 0}
          onClick={() => startSession(0)}
        >
          {t`Start ${visibleTaskCount} tasks`}
        </Button>
      </StyledToolbar>
      <TaskQueueList
        tasks={visibleTasks}
        isLoading={loading}
        onStartFromTask={(taskId) =>
          startSession(
            Math.max(
              0,
              visibleTasks.findIndex((task) => task.id === taskId),
            ),
          )
        }
      />
    </>
  );
};
