import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme';

export const StyledPhoneCallWindow = styled.section`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.lg};
  bottom: ${themeCssVariables.spacing[6]};
  box-shadow: ${themeCssVariables.boxShadow.strong};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  right: ${themeCssVariables.spacing[6]};
  width: 320px;
  z-index: 40;
`;

export const StyledPhoneCallHeader = styled.header`
  align-items: center;
  background: ${themeCssVariables.color.blue};
  color: ${themeCssVariables.grayScale.gray1};
  cursor: grab;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  touch-action: none;
  user-select: none;

  &[data-status='in-progress'] {
    background: ${themeCssVariables.color.orange};
  }

  &:active {
    cursor: grabbing;
  }
`;

export const StyledPhoneCallHeaderTitle = styled.span`
  flex: 1;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

export const StyledPhoneCallTimer = styled.span`
  font-size: ${themeCssVariables.font.size.md};
  font-variant-numeric: tabular-nums;
  font-weight: ${themeCssVariables.font.weight.medium};
`;

export const StyledPhoneCallHeaderButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: inherit;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: ${themeCssVariables.spacing[1]};

  &:hover {
    background: ${themeCssVariables.background.transparent.strong};
  }
`;

export const StyledPhoneCallBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
`;

export const StyledPhoneCallContact = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

export const StyledPhoneCallPersonName = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

export const StyledPhoneCallPhoneNumber = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
`;

export const StyledPhoneCallRecordingStatus = styled.p`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  margin: 0;

  &[data-recording='true'] {
    color: ${themeCssVariables.font.color.danger};
  }
`;

export const StyledPhoneCallRecordingDot = styled.span`
  background: currentColor;
  border-radius: 50%;
  flex-shrink: 0;
  height: 8px;
  width: 8px;
`;

export const StyledPhoneCallField = styled.label`
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  flex-direction: column;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: ${themeCssVariables.spacing[1]};
`;

export const StyledPhoneCallSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.strong};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.primary};
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.md};
  height: 32px;
  padding: 0 ${themeCssVariables.spacing[2]};

  &:disabled {
    background: ${themeCssVariables.background.tertiary};
    color: ${themeCssVariables.font.color.light};
    cursor: not-allowed;
  }

  &:focus-visible {
    border-color: ${themeCssVariables.color.blue};
    outline: none;
  }
`;

export const StyledPhoneCallActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};

  > * {
    flex: 1;
  }
`;
