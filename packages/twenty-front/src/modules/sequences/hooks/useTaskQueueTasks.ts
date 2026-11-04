import { CoreObjectNameSingular } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { SEQUENCE_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceObjectNameSingular';
import { SEQUENCE_TASK_RECORD_GQL_FIELDS } from '@/sequences/constants/SequenceTaskRecordGqlFields';
import { type Sequence } from '@/sequences/types/Sequence';
import { type SequenceTask } from '@/sequences/types/SequenceTask';
import { attachSequencesToTasks } from '@/sequences/utils/attachSequencesToTasks';
import { sortTasksForQueue } from '@/sequences/utils/sortTasksForQueue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useTaskQueueTasks = ({ onlyMine }: { onlyMine: boolean }) => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const currentWorkspaceMemberId = currentWorkspaceMember?.id;

  const openStatusFilter = { status: { in: ['TODO', 'IN_PROGRESS'] } };

  const {
    records,
    loading: tasksLoading,
    refetch,
  } = useFindManyRecords<SequenceTask>({
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

  const { records: sequences, loading: sequencesLoading } =
    useFindManyRecords<Sequence>({
      objectNameSingular: SEQUENCE_OBJECT_NAME_SINGULAR,
      recordGqlFields: { id: true, name: true, steps: true },
      fetchPolicy: 'network-only',
    });

  return {
    tasks: sortTasksForQueue(attachSequencesToTasks(records, sequences)),
    loading: tasksLoading || sequencesLoading,
    refetch,
  };
};
