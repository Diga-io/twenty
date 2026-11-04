import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { IconCheck, IconPlus } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';
import { v4 } from 'uuid';

import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { SEQUENCE_FORM_CONTROL_CLASS_NAME } from '@/sequences/components/SequenceFormStyles';
import { SequenceStepCard } from '@/sequences/components/SequenceStepCard';
import { SEQUENCE_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceObjectNameSingular';
import { type Sequence } from '@/sequences/types/Sequence';
import { type SequenceStep } from '@/sequences/types/SequenceStep';
import { parseSequenceSteps } from '@/sequences/utils/parseSequenceSteps';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  margin: 0 auto;
  max-width: 760px;
  padding: ${themeCssVariables.spacing[6]} ${themeCssVariables.spacing[4]};
`;

const StyledToolbar = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
`;

const StyledHint = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledNameInput = styled.input`
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledSteps = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledAddStep = styled.div`
  border-left: 2px dashed ${themeCssVariables.border.color.medium};
  margin-left: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[3]} 0 0 ${themeCssVariables.spacing[4]};
`;

type SequenceStepsEditorProps = {
  sequence: Sequence;
  onSaved: () => void;
};

export const SequenceStepsEditor = ({
  sequence,
  onSaved,
}: SequenceStepsEditorProps) => {
  const { t } = useLingui();
  const { updateOneRecord } = useUpdateOneRecord();

  const [name, setName] = useState(sequence.name);
  const [description, setDescription] = useState(sequence.description ?? '');
  const [steps, setSteps] = useState<SequenceStep[]>(() =>
    parseSequenceSteps(sequence.steps),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateSteps = (nextSteps: SequenceStep[]) => {
    setSteps(nextSteps);
    setIsDirty(true);
  };

  const addStep = () =>
    updateSteps([
      ...steps,
      {
        id: v4(),
        type: 'CALL',
        delayInDays: 1,
        title: t`Call`,
        instructions: '',
      },
    ]);

  const save = async () => {
    setIsSaving(true);

    try {
      await updateOneRecord<Sequence>({
        objectNameSingular: SEQUENCE_OBJECT_NAME_SINGULAR,
        idToUpdate: sequence.id,
        updateOneRecordInput: {
          name: name.trim().length > 0 ? name.trim() : sequence.name,
          description,
          steps,
        },
      });
      setIsDirty(false);
      onSaved();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StyledContainer>
      <StyledToolbar>
        <StyledHint>
          {t`Contacts already enrolled pick up step changes from their next task onwards.`}
        </StyledHint>
        <Button
          variant="solid"
          color="accent"
          size="sm"
          startIcon={<IconCheck size={14} />}
          disabled={!isDirty}
          loading={isSaving}
          onClick={save}
        >
          {t`Save`}
        </Button>
      </StyledToolbar>
      <StyledFields>
        <StyledNameInput
          className={SEQUENCE_FORM_CONTROL_CLASS_NAME}
          value={name}
          aria-label={t`Sequence name`}
          onChange={(event) => {
            setName(event.target.value);
            setIsDirty(true);
          }}
        />
        <input
          className={SEQUENCE_FORM_CONTROL_CLASS_NAME}
          value={description}
          placeholder={t`Description`}
          onChange={(event) => {
            setDescription(event.target.value);
            setIsDirty(true);
          }}
        />
      </StyledFields>
      <StyledSteps>
        {steps.map((step, stepIndex) => (
          <SequenceStepCard
            key={step.id}
            step={step}
            stepIndex={stepIndex}
            isRemovable={steps.length > 1}
            onChange={(updatedStep) =>
              updateSteps(
                steps.map((existingStep) =>
                  existingStep.id === updatedStep.id
                    ? updatedStep
                    : existingStep,
                ),
              )
            }
            onRemove={() =>
              updateSteps(
                steps.filter((existingStep) => existingStep.id !== step.id),
              )
            }
          />
        ))}
        <StyledAddStep>
          <Button
            variant="outline"
            size="sm"
            startIcon={<IconPlus size={14} />}
            onClick={addStep}
          >
            {t`Add step`}
          </Button>
        </StyledAddStep>
      </StyledSteps>
    </StyledContainer>
  );
};
