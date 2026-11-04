import { useLingui } from '@lingui/react/macro';
import { useParams } from 'react-router-dom';
import { IconTimelineEvent } from 'twenty-ui/icon';

import { SequenceShowContent } from '@/sequences/components/SequenceShowContent';
import { SequencesPageLayout } from '@/sequences/components/SequencesPageLayout';

export const SequenceShowPage = () => {
  const { t } = useLingui();
  const { sequenceId = '' } = useParams<{ sequenceId: string }>();

  return (
    <SequencesPageLayout
      title={t`Sequences`}
      Icon={IconTimelineEvent}
      renderContent={() => (
        <SequenceShowContent key={sequenceId} sequenceId={sequenceId} />
      )}
    />
  );
};
