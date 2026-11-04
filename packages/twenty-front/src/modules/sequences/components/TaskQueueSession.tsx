import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import {
  IconArrowRight,
  IconBrandLinkedin,
  IconCheck,
  IconMail,
  IconPhone,
  IconX,
} from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';
import { useToast } from 'twenty-ui/components/feedback';

import { SEQUENCE_FORM_CONTROL_CLASS_NAME } from '@/sequences/components/SequenceFormStyles';
import { SequenceStepTypeTag } from '@/sequences/components/SequenceStepTypeTag';
import { TaskQueueContactCard } from '@/sequences/components/TaskQueueContactCard';
import { TaskQueueDueDate } from '@/sequences/components/TaskQueueDueDate';
import { TaskQueueSessionSummary } from '@/sequences/components/TaskQueueSessionSummary';
import {
  CALL_OUTCOMES,
  type CallOutcome,
} from '@/sequences/constants/CallOutcomes';
import { SEQUENCE_STEP_TYPE_CONFIG } from '@/sequences/constants/SequenceStepTypeConfig';
import { useCompleteSequenceTask } from '@/sequences/hooks/useCompleteSequenceTask';
import { type SequenceTask } from '@/sequences/types/SequenceTask';
import { buildTaskActivityLog } from '@/sequences/utils/buildTaskActivityLog';
import { formatSequencePersonPhone } from '@/sequences/utils/formatSequencePersonPhone';
import { getSequenceTaskPerson } from '@/sequences/utils/getSequenceTaskPerson';
import { parseSequenceSteps } from '@/sequences/utils/parseSequenceSteps';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledTopBar = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
`;

const StyledProgressLabel = styled.div`
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledProgressTrack = styled.div`
  background: ${themeCssVariables.background.tertiary};
  border-radius: ${themeCssVariables.border.radius.pill};
  flex: 1;
  height: 6px;
  max-width: 320px;
  overflow: hidden;
`;

const StyledProgressFill = styled.div`
  background: ${themeCssVariables.color.blue};
  height: 100%;
`;

const StyledBody = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const StyledMain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  overflow: auto;
  padding: ${themeCssVariables.spacing[6]};
`;

const StyledTaskHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledTaskMeta = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-wrap: wrap;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledTaskTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledPanel = styled.div`
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledPanelTitle = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const StyledInstructions = styled.div`
  color: ${themeCssVariables.font.color.primary};
  line-height: 1.5;
  white-space: pre-wrap;
`;

const StyledOutcomes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledOutcome = styled.button<{ isSelected: boolean }>`
  background: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.background.transparent.blue
      : themeCssVariables.background.primary};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.color.blue
      : themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledFooter = styled.div`
  align-items: center;
  border-top: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: flex-end;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledPrimaryAction = styled.a`
  align-items: center;
  align-self: flex-start;
  background: ${themeCssVariables.color.green};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  text-decoration: none;
`;

type TaskQueueSessionProps = {
  tasks: SequenceTask[];
  initialIndex: number;
  onExit: () => void;
};

export const TaskQueueSession = ({
  tasks,
  initialIndex,
  onExit,
}: TaskQueueSessionProps) => {
  const { t } = useLingui();
  const { enqueueToast } = useToast();
  const { completeSequenceTask } = useCompleteSequenceTask();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [completedCount, setCompletedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [callOutcome, setCallOutcome] = useState<CallOutcome | null>(null);
  const [notes, setNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const task = tasks[currentIndex];

  if (!isDefined(task)) {
    return (
      <TaskQueueSessionSummary
        completedCount={completedCount}
        skippedCount={skippedCount}
        onExit={onExit}
      />
    );
  }

  const taskType = task.taskType ?? 'TODO';
  const person = getSequenceTaskPerson(task);
  const phone = formatSequencePersonPhone(person);
  const email = person?.emails?.primaryEmail;
  const linkedinUrl = person?.linkedinLink?.primaryLinkUrl;
  const instructions = task.bodyV2?.markdown;
  const enrollment = task.sequenceEnrollment;
  const sequenceName = enrollment?.sequence?.name;
  const sequenceStepCount = parseSequenceSteps(
    enrollment?.sequence?.steps,
  ).length;
  const sequenceStepNumber = (enrollment?.currentStepIndex ?? 0) + 1;
  const taskNumber = currentIndex + 1;
  const taskCount = tasks.length;
  const progressPercentage = Math.round((currentIndex / taskCount) * 100);

  const goToNextTask = () => {
    setCallOutcome(null);
    setNotes('');
    setCurrentIndex((index) => index + 1);
  };

  const skip = () => {
    setSkippedCount((count) => count + 1);
    goToNextTask();
  };

  const complete = async () => {
    setIsCompleting(true);

    const outcomeLabel = CALL_OUTCOMES.find(
      (outcome) => outcome.value === callOutcome,
    )?.label;

    try {
      await completeSequenceTask({
        task,
        activityLog: buildTaskActivityLog({
          activityLabel: t(SEQUENCE_STEP_TYPE_CONFIG[taskType].label),
          taskTitle: task.title,
          outcomeLabel: isDefined(outcomeLabel) ? t(outcomeLabel) : null,
          outcomeHeading: t`Outcome`,
          notes,
        }),
      });
      setCompletedCount((count) => count + 1);
      goToNextTask();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      enqueueToast({
        status: 'error',
        children: t`Could not complete the task: ${errorMessage}`,
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <StyledContainer>
      <StyledTopBar>
        <StyledProgressLabel>
          {t`Task ${taskNumber} of ${taskCount}`}
        </StyledProgressLabel>
        <StyledProgressTrack>
          <StyledProgressFill style={{ width: `${progressPercentage}%` }} />
        </StyledProgressTrack>
        <Button
          variant="ghost"
          size="sm"
          startIcon={<IconX size={14} />}
          onClick={onExit}
        >
          {t`Exit queue`}
        </Button>
      </StyledTopBar>
      <StyledBody>
        <StyledMain>
          <StyledTaskHeader>
            <StyledTaskMeta>
              <SequenceStepTypeTag type={taskType} />
              <TaskQueueDueDate dueAt={task.dueAt} />
              {isDefined(sequenceName) && (
                <span>
                  {t`${sequenceName} · step ${sequenceStepNumber} of ${sequenceStepCount}`}
                </span>
              )}
            </StyledTaskMeta>
            <StyledTaskTitle>{task.title}</StyledTaskTitle>
          </StyledTaskHeader>

          {taskType === 'CALL' && isNonEmptyString(phone) && (
            <StyledPrimaryAction href={`tel:${phone}`}>
              <IconPhone size={16} />
              {t`Call ${phone}`}
            </StyledPrimaryAction>
          )}
          {taskType === 'EMAIL' && isNonEmptyString(email) && (
            <StyledPrimaryAction
              href={`mailto:${email}?subject=${encodeURIComponent(task.title ?? '')}`}
            >
              <IconMail size={16} />
              {t`Email ${email}`}
            </StyledPrimaryAction>
          )}
          {taskType === 'LINKEDIN' && isNonEmptyString(linkedinUrl) && (
            <StyledPrimaryAction
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
            >
              <IconBrandLinkedin size={16} />
              {t`Open LinkedIn profile`}
            </StyledPrimaryAction>
          )}

          {isNonEmptyString(instructions) && (
            <StyledPanel>
              <StyledPanelTitle>{t`Instructions`}</StyledPanelTitle>
              <StyledInstructions>{instructions}</StyledInstructions>
            </StyledPanel>
          )}

          <StyledPanel>
            {taskType === 'CALL' && (
              <>
                <StyledPanelTitle>{t`Call outcome`}</StyledPanelTitle>
                <StyledOutcomes>
                  {CALL_OUTCOMES.map((outcome) => (
                    <StyledOutcome
                      key={outcome.value}
                      type="button"
                      isSelected={callOutcome === outcome.value}
                      onClick={() =>
                        setCallOutcome((currentOutcome) =>
                          currentOutcome === outcome.value
                            ? null
                            : outcome.value,
                        )
                      }
                    >
                      {t(outcome.label)}
                    </StyledOutcome>
                  ))}
                </StyledOutcomes>
              </>
            )}
            <StyledPanelTitle>{t`Notes`}</StyledPanelTitle>
            <textarea
              className={SEQUENCE_FORM_CONTROL_CLASS_NAME}
              rows={4}
              value={notes}
              placeholder={t`Logged on the contact's timeline when you complete the task`}
              onChange={(event) => setNotes(event.target.value)}
            />
          </StyledPanel>
        </StyledMain>
        {isDefined(person) && <TaskQueueContactCard person={person} />}
      </StyledBody>
      <StyledFooter>
        <Button
          variant="outline"
          size="sm"
          endIcon={<IconArrowRight size={14} />}
          disabled={isCompleting}
          onClick={skip}
        >
          {t`Skip`}
        </Button>
        <Button
          variant="solid"
          color="accent"
          size="sm"
          startIcon={<IconCheck size={14} />}
          loading={isCompleting}
          onClick={complete}
        >
          {currentIndex + 1 < taskCount
            ? t`Complete and go to next`
            : t`Complete`}
        </Button>
      </StyledFooter>
    </StyledContainer>
  );
};
