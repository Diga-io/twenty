import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';

import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { DEFAULT_SEQUENCE_STEPS } from '@/sequences/constants/DefaultSequenceSteps';
import { SEQUENCE_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceObjectNameSingular';
import { SEQUENCE_SHOW_PATH } from '@/sequences/constants/SequenceShowPath';
import { type Sequence } from '@/sequences/types/Sequence';

export const useCreateSequence = () => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const { createOneRecord } = useCreateOneRecord<Sequence>({
    objectNameSingular: SEQUENCE_OBJECT_NAME_SINGULAR,
    skipPostOptimisticEffect: true,
  });

  const createSequence = async (name: string) => {
    setIsCreating(true);

    try {
      const sequenceId = v4();

      await createOneRecord({
        id: sequenceId,
        name,
        description: '',
        steps: DEFAULT_SEQUENCE_STEPS.map((step) => ({
          ...step,
          id: v4(),
          title: t(step.title),
          instructions: t(step.instructions),
        })),
      });

      navigate(SEQUENCE_SHOW_PATH.replace(':sequenceId', sequenceId));
    } finally {
      setIsCreating(false);
    }
  };

  return { createSequence, isCreating };
};
