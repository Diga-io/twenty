import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { IconTrash } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

import { SEQUENCE_FORM_CONTROL_CLASS_NAME } from '@/sequences/components/SequenceFormStyles';
import { SequenceStepTypeTag } from '@/sequences/components/SequenceStepTypeTag';
import { SEQUENCE_STEP_TYPE_CONFIG } from '@/sequences/constants/SequenceStepTypeConfig';
import { SEQUENCE_STEP_TYPES } from '@/sequences/constants/SequenceStepTypes';
import { type SequenceStep } from '@/sequences/types/SequenceStep';
import { type SequenceStepType } from '@/sequences/types/SequenceStepType';

const StyledDelay = styled.div`
  align-items: center;
  border-left: 2px dashed ${themeCssVariables.border.color.medium};
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  margin-left: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[2]} 0 ${themeCssVariables.spacing[2]}
    ${themeCssVariables.spacing[6]};
`;

const StyledDelayInput = styled.input`
  width: 64px;
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.light};
`;

const StyledCardHeader = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md}
    ${themeCssVariables.border.radius.md} 0 0;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledStepLabel = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledCardBody = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: 180px 1fr;
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledField = styled.label<{ isFullWidth?: boolean }>`
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-direction: column;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: ${themeCssVariables.spacing[1]};
  grid-column: ${({ isFullWidth }) => (isFullWidth === true ? '1 / -1' : 'auto')};
`;

type SequenceStepCardProps = {
  step: SequenceStep;
  stepIndex: number;
  onChange: (step: SequenceStep) => void;
  onRemove: () => void;
  isRemovable: boolean;
};

export const SequenceStepCard = ({
  step,
  stepIndex,
  onChange,
  onRemove,
  isRemovable,
}: SequenceStepCardProps) => {
  const { t } = useLingui();
  const stepNumber = stepIndex + 1;
  const delayInDays = step.delayInDays;

  return (
    <div>
      <StyledDelay>
        {stepIndex === 0 ? t`Starts` : t`Wait`}
        <StyledDelayInput
          className={SEQUENCE_FORM_CONTROL_CLASS_NAME}
          type="number"
          min={0}
          value={delayInDays}
          onChange={(event) =>
            onChange({
              ...step,
              delayInDays: Math.max(0, Number(event.target.value) || 0),
            })
          }
        />
        {stepIndex === 0
          ? t`days after enrollment`
          : t`days after the previous task is completed`}
      </StyledDelay>
      <StyledCard>
        <StyledCardHeader>
          <StyledStepLabel>
            {t`Step ${stepNumber}`}
            <SequenceStepTypeTag type={step.type} />
          </StyledStepLabel>
          {isRemovable && (
            <Button
              variant="ghost"
              size="sm"
              color="danger"
              startIcon={<IconTrash size={14} />}
              onClick={onRemove}
            >
              {t`Delete`}
            </Button>
          )}
        </StyledCardHeader>
        <StyledCardBody>
          <StyledField>
            {t`Task type`}
            <select
              className={SEQUENCE_FORM_CONTROL_CLASS_NAME}
              value={step.type}
              onChange={(event) =>
                onChange({
                  ...step,
                  type: event.target.value as SequenceStepType,
                })
              }
            >
              {SEQUENCE_STEP_TYPES.map((stepType) => (
                <option key={stepType} value={stepType}>
                  {t(SEQUENCE_STEP_TYPE_CONFIG[stepType].actionLabel)}
                </option>
              ))}
            </select>
          </StyledField>
          <StyledField>
            {t`Task title`}
            <input
              className={SEQUENCE_FORM_CONTROL_CLASS_NAME}
              value={step.title}
              placeholder={t`e.g. Intro call`}
              onChange={(event) =>
                onChange({ ...step, title: event.target.value })
              }
            />
          </StyledField>
          <StyledField isFullWidth>
            {t`Instructions / script`}
            <textarea
              className={SEQUENCE_FORM_CONTROL_CLASS_NAME}
              rows={3}
              value={step.instructions}
              placeholder={t`What should the rep say or do?`}
              onChange={(event) =>
                onChange({ ...step, instructions: event.target.value })
              }
            />
          </StyledField>
        </StyledCardBody>
      </StyledCard>
    </div>
  );
};
