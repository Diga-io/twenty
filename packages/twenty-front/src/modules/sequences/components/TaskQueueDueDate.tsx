import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { themeCssVariables } from 'twenty-ui/theme';

import { isTaskInDueBucket } from '@/sequences/utils/isTaskInDueBucket';

const StyledDueDate = styled.span<{ isOverdue: boolean }>`
  color: ${({ isOverdue }) =>
    isOverdue
      ? themeCssVariables.font.color.danger
      : themeCssVariables.font.color.secondary};
  font-weight: ${({ isOverdue }) =>
    isOverdue
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  white-space: nowrap;
`;

type TaskQueueDueDateProps = {
  dueAt: string | null;
};

export const TaskQueueDueDate = ({ dueAt }: TaskQueueDueDateProps) => {
  const { t } = useLingui();

  if (!isNonEmptyString(dueAt)) {
    return <StyledDueDate isOverdue={false}>{t`No due date`}</StyledDueDate>;
  }

  const isOverdue = isTaskInDueBucket({
    task: { dueAt },
    bucket: 'OVERDUE',
    now: new Date(),
  });
  const formattedDueDate = new Date(dueAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });

  return (
    <StyledDueDate isOverdue={isOverdue}>
      {isOverdue ? t`Overdue · ${formattedDueDate}` : formattedDueDate}
    </StyledDueDate>
  );
};
