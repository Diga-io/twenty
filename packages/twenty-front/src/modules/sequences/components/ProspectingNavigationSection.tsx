import { useLingui } from '@lingui/react/macro';
import { useMatch } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { IconListCheck, IconTimelineEvent } from 'twenty-ui/icon';

import { SEQUENCE_SHOW_PATH } from '@/sequences/constants/SequenceShowPath';
import { SEQUENCES_PATH } from '@/sequences/constants/SequencesPath';
import { TASK_QUEUE_PATH } from '@/sequences/constants/TaskQueuePath';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';

export const ProspectingNavigationSection = () => {
  const { t } = useLingui();

  const sequencesMatch = useMatch(SEQUENCES_PATH);
  const sequenceShowMatch = useMatch(SEQUENCE_SHOW_PATH);
  const taskQueueMatch = useMatch(TASK_QUEUE_PATH);

  const isSequencesActive =
    isDefined(sequencesMatch) || isDefined(sequenceShowMatch);
  const isTaskQueueActive = isDefined(taskQueueMatch);

  return (
    <NavigationDrawerSection>
      <NavigationDrawerAnimatedCollapseWrapper>
        <NavigationDrawerSectionTitle label={t`Prospecting`} />
      </NavigationDrawerAnimatedCollapseWrapper>
      <NavigationDrawerItem
        label={t`Task queue`}
        to={TASK_QUEUE_PATH}
        Icon={IconListCheck}
        active={isTaskQueueActive}
      />
      <NavigationDrawerItem
        label={t`Sequences`}
        to={SEQUENCES_PATH}
        Icon={IconTimelineEvent}
        active={isSequencesActive}
      />
    </NavigationDrawerSection>
  );
};
