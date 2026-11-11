import { useComposeEmailRelatedRecordAction } from '@/activities/emails/hooks/useComposeEmailRelatedRecordAction';
import { useCreateActivityRelatedRecordAction } from '@/activities/hooks/useCreateActivityRelatedRecordAction';
import { type ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { getPersonContactCardData } from '@/object-record/record-show/utils/getPersonContactCardData';
import { UndecoratedLink } from '@/ui/navigation/link/components/UndecoratedLink/UndecoratedLink';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { type ReactNode } from 'react';
import { AppPath, CoreObjectNameSingular } from 'twenty-shared/types';
import { getAppPath } from 'twenty-shared/utils';
import {
  type IconComponent,
  IconMail,
  IconNotes,
  IconPhone,
} from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledCard = styled.section`
  background: ${themeCssVariables.background.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]} ${themeCssVariables.spacing[4]}
    ${themeCssVariables.spacing[3]};
`;

const StyledSubtitle = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
  overflow-wrap: anywhere;
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-around;
`;

const StyledActionButton = styled.button`
  align-items: center;
  background: none;
  border: 0;
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[1]};
  padding: 0;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:not(:disabled):hover > span {
    background: ${themeCssVariables.background.primary};
    border-color: ${themeCssVariables.color.blue};
  }
`;

const StyledActionLink = styled.a`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  flex-direction: column;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[1]};
  text-decoration: none;

  &:hover > span {
    background: ${themeCssVariables.background.primary};
    border-color: ${themeCssVariables.color.blue};
  }
`;

const StyledActionCircle = styled.span`
  align-items: center;
  background: ${themeCssVariables.background.transparent.blue};
  border: 1px solid transparent;
  border-radius: 50%;
  color: ${themeCssVariables.color.blue};
  display: grid;
  height: 38px;
  justify-items: center;
  transition:
    border-color 0.1s,
    background 0.1s;
  width: 38px;
`;

const StyledDetails = styled.dl`
  align-items: center;
  border-top: 1px solid ${themeCssVariables.border.color.light};
  display: grid;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  grid-template-columns: 72px minmax(0, 1fr);
  margin: 0;
  padding-top: ${themeCssVariables.spacing[3]};

  dt {
    color: ${themeCssVariables.font.color.tertiary};
  }

  dd {
    color: ${themeCssVariables.font.color.primary};
    margin: 0;
    overflow-wrap: anywhere;
  }

  a {
    color: ${themeCssVariables.color.blue};
    text-decoration: none;
  }
`;

const StyledEmpty = styled.span`
  color: ${themeCssVariables.font.color.light};
`;

type ContactActionProps = {
  label: string;
  Icon: IconComponent;
  disabled?: boolean;
  onClick?: () => void;
  href?: string | null;
};

const ContactAction = ({
  label,
  Icon,
  disabled = false,
  onClick,
  href,
}: ContactActionProps) => {
  const content = (
    <>
      <StyledActionCircle>
        <Icon size={17} />
      </StyledActionCircle>
      {label}
    </>
  );

  if (href !== undefined) {
    // Rendered as a button when there is nothing to dial, so it can be disabled.
    if (href === null) {
      return (
        <StyledActionButton type="button" disabled>
          {content}
        </StyledActionButton>
      );
    }

    return <StyledActionLink href={href}>{content}</StyledActionLink>;
  }

  return (
    <StyledActionButton type="button" disabled={disabled} onClick={onClick}>
      {content}
    </StyledActionButton>
  );
};

const valueOrDash = (value: ReactNode | null) =>
  value ?? <StyledEmpty>—</StyledEmpty>;

type PersonContactCardProps = {
  personId: string;
};

// Compact contact header for person record pages: "Job title · Company",
// quick actions (note, email, call) and the main ways to reach the person.
export const PersonContactCard = ({ personId }: PersonContactCardProps) => {
  const { t } = useLingui();

  const recordStore = useAtomFamilyStateValue(recordStoreFamilyState, personId);
  const { subtitle, email, phoneLabel, phoneHref, companyId, companyName } =
    getPersonContactCardData(recordStore);

  const targetRecord: ActivityTargetableObject = {
    id: personId,
    targetObjectNameSingular: CoreObjectNameSingular.Person,
  };

  const { action: createNoteAction } = useCreateActivityRelatedRecordAction({
    targetRecord,
    activityObjectNameSingular: CoreObjectNameSingular.Note,
  });

  const { action: composeEmailAction } = useComposeEmailRelatedRecordAction({
    targetRecord,
  });

  // Fall back to the user's mail client when in-app sending is not allowed.
  const canComposeInApp =
    composeEmailAction.isVisible && !composeEmailAction.disabled;

  return (
    <StyledCard aria-label={t`Contact card`}>
      {subtitle !== '' && <StyledSubtitle>{subtitle}</StyledSubtitle>}

      <StyledActions>
        <ContactAction
          label={t`Note`}
          Icon={IconNotes}
          disabled={!createNoteAction.isVisible}
          onClick={createNoteAction.execute}
        />
        {canComposeInApp || email === null ? (
          <ContactAction
            label={t`Email`}
            Icon={IconMail}
            disabled={!canComposeInApp}
            onClick={composeEmailAction.execute}
          />
        ) : (
          <ContactAction
            label={t`Email`}
            Icon={IconMail}
            href={`mailto:${email}`}
          />
        )}
        <ContactAction label={t`Call`} Icon={IconPhone} href={phoneHref} />
      </StyledActions>

      <StyledDetails>
        <dt>{t`Email`}</dt>
        <dd>{valueOrDash(email && <a href={`mailto:${email}`}>{email}</a>)}</dd>
        <dt>{t`Phone`}</dt>
        <dd>
          {valueOrDash(
            phoneLabel && phoneHref && <a href={phoneHref}>{phoneLabel}</a>,
          )}
        </dd>
        <dt>{t`Company`}</dt>
        <dd>
          {valueOrDash(
            companyName &&
              (companyId ? (
                <UndecoratedLink
                  to={getAppPath(AppPath.RecordShowPage, {
                    objectNameSingular: CoreObjectNameSingular.Company,
                    objectRecordId: companyId,
                  })}
                >
                  {companyName}
                </UndecoratedLink>
              ) : (
                companyName
              )),
          )}
        </dd>
      </StyledDetails>
    </StyledCard>
  );
};
