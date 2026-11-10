import { useTasks } from '@/activities/tasks/hooks/useTasks';
import {
  StyledPhoneCallField,
  StyledPhoneCallSelect,
} from '@/phone-call/components/PhoneCallWindow.styles';
import { useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { CoreObjectNameSingular } from 'twenty-shared/types';

type PhoneCallTaskSelectProps = {
  personId: string;
  taskId: string | null;
  onTaskIdChange: (taskId: string | null) => void;
};

export const PhoneCallTaskSelect = ({
  personId,
  taskId,
  onTaskIdChange,
}: PhoneCallTaskSelectProps) => {
  const { t } = useLingui();
  const { tasks } = useTasks({
    targetableObjects: [
      { id: personId, targetObjectNameSingular: CoreObjectNameSingular.Person },
    ],
  });

  const openTasks = tasks.filter((task) => task.status !== 'DONE');

  if (openTasks.length === 0) {
    return null;
  }

  return (
    <StyledPhoneCallField>
      {t`Complete a task`}
      <StyledPhoneCallSelect
        value={taskId ?? ''}
        onChange={(event) =>
          onTaskIdChange(
            isNonEmptyString(event.target.value) ? event.target.value : null,
          )
        }
      >
        <option value="">{t`No task`}</option>
        {openTasks.map((task) => (
          <option key={task.id} value={task.id}>
            {isNonEmptyString(task.title) ? task.title : t`Untitled task`}
          </option>
        ))}
      </StyledPhoneCallSelect>
    </StyledPhoneCallField>
  );
};
