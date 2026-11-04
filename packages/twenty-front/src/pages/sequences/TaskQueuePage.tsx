import { useLingui } from '@lingui/react/macro';
import { IconListCheck } from 'twenty-ui/icon';

import { SequencesPageLayout } from '@/sequences/components/SequencesPageLayout';
import { TaskQueueContent } from '@/sequences/components/TaskQueueContent';

export const TaskQueuePage = () => {
  const { t } = useLingui();

  return (
    <SequencesPageLayout
      title={t`Task queue`}
      Icon={IconListCheck}
      renderContent={() => <TaskQueueContent />}
    />
  );
};
