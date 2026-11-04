import { useLingui } from '@lingui/react/macro';
import { Tag } from 'twenty-ui/primitives/data-display';

import { type SequenceEnrollmentStatus } from '@/sequences/types/SequenceEnrollmentStatus';

type SequenceEnrollmentStatusTagProps = {
  status: SequenceEnrollmentStatus;
};

export const SequenceEnrollmentStatusTag = ({
  status,
}: SequenceEnrollmentStatusTagProps) => {
  const { t } = useLingui();

  switch (status) {
    case 'ACTIVE':
      return (
        <Tag color="green" variant="soft">
          {t`Active`}
        </Tag>
      );
    case 'FINISHED':
      return (
        <Tag color="blue" variant="soft">
          {t`Finished`}
        </Tag>
      );
    case 'UNENROLLED':
      return (
        <Tag color="gray" variant="soft">
          {t`Unenrolled`}
        </Tag>
      );
  }
};
