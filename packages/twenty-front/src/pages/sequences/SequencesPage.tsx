import { useLingui } from '@lingui/react/macro';
import { IconPlus, IconTimelineEvent } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';

import { SequencesList } from '@/sequences/components/SequencesList';
import { SequencesPageLayout } from '@/sequences/components/SequencesPageLayout';
import { useCreateSequence } from '@/sequences/hooks/useCreateSequence';

const CreateSequenceButton = () => {
  const { t } = useLingui();
  const { createSequence, isCreating } = useCreateSequence();

  return (
    <Button
      variant="solid"
      color="accent"
      size="sm"
      startIcon={<IconPlus size={14} />}
      loading={isCreating}
      onClick={() => createSequence(t`New sequence`)}
    >
      {t`Create sequence`}
    </Button>
  );
};

export const SequencesPage = () => {
  const { t } = useLingui();

  return (
    <SequencesPageLayout
      title={t`Sequences`}
      Icon={IconTimelineEvent}
      actionButton={<CreateSequenceButton />}
      renderContent={() => <SequencesList />}
    />
  );
};
