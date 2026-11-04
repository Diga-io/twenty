import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { v4 } from 'uuid';

import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceEnrollmentObjectNameSingular';
import { useCreateSequenceStepTask } from '@/sequences/hooks/useCreateSequenceStepTask';
import { type Sequence } from '@/sequences/types/Sequence';
import { type SequenceEnrollment } from '@/sequences/types/SequenceEnrollment';
import { type SequencePerson } from '@/sequences/types/SequencePerson';
import { formatSequencePersonName } from '@/sequences/utils/formatSequencePersonName';
import { parseSequenceSteps } from '@/sequences/utils/parseSequenceSteps';

export const useEnrollPeopleInSequence = () => {
  const { t } = useLingui();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { createOneRecord: createOneEnrollment } =
    useCreateOneRecord<SequenceEnrollment>({
      objectNameSingular: SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR,
      skipPostOptimisticEffect: true,
    });

  const { createSequenceStepTask } = useCreateSequenceStepTask();

  const enrollPeopleInSequence = async ({
    sequence,
    people,
  }: {
    sequence: Pick<Sequence, 'id' | 'name' | 'steps'>;
    people: Pick<SequencePerson, 'id' | 'name'>[];
  }) => {
    const firstStep = parseSequenceSteps(sequence.steps)[0];

    if (!isDefined(firstStep)) {
      throw new Error(t`This sequence has no steps`);
    }

    setIsEnrolling(true);

    try {
      const enrolledAt = new Date();

      // Sequential on purpose: keeps the API load low and the order of the
      // resulting queue predictable.
      for (const person of people) {
        const sequenceEnrollmentId = v4();

        await createOneEnrollment({
          id: sequenceEnrollmentId,
          name: `${sequence.name} - ${formatSequencePersonName(person)}`,
          personId: person.id,
          sequenceId: sequence.id,
          status: 'ACTIVE',
          currentStepIndex: 0,
        });

        await createSequenceStepTask({
          step: firstStep,
          sequenceEnrollmentId,
          personId: person.id,
          fromDate: enrolledAt,
        });
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  return { enrollPeopleInSequence, isEnrolling };
};
