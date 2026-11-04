import { css } from '@linaria/core';
import { themeCssVariables } from 'twenty-ui/theme';

// Native form controls keep the editor lightweight; this class gives them the
// workspace look.
export const SEQUENCE_FORM_CONTROL_CLASS_NAME = css`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-sizing: border-box;
  color: ${themeCssVariables.font.color.primary};
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]};
  width: 100%;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
    outline: none;
  }
`;
