import { CoreObjectNameSingular } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { SEQUENCE_TASK_RECORD_GQL_FIELDS } from '@/sequences/constants/SequenceTaskRecordGqlFields';
import { type SequenceTask } from '@/sequences/types/SequenceTask';
import { sortTasksForQueue } from '@/sequences/utils/sortTasksForQueue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useTaskQueueTasks = ({ onlyMine }: { onlyMine: boolean }) => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const currentWorkspaceMemberId = currentWorkspaceMember?.id;

  const openStatusFilter = { status: { in: ['TODO', 'IN_PROGRESS'] } };

  const { records, loading, refetch } = useFindManyRecords<SequenceTask>({
    objectNameSingular: CoreObjectNameSingular.Task,
    recordGqlFields: SEQUENCE_TASK_RECORD_GQL_FIELDS,
    filter:
      onlyMine && isDefined(currentWorkspaceMemberId)
        ? {
            and: [
              openStatusFilter,
              { assigneeId: { eq: currentWorkspaceMemberId } },
            ],
          }
        : openStatusFilter,
    orderBy: [{ dueAt: 'AscNullsLast' }],
    limit: 500,
    fetchPolicy: 'network-only',
  });

  return { tasks: sortTasksForQueue(records), loading, refetch };
};
