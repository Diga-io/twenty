import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { type IconComponent } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme';

import { SequencesSetupRequired } from '@/sequences/components/SequencesSetupRequired';
import { useSequencesDataModelStatus } from '@/sequences/hooks/useSequencesDataModelStatus';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';

const StyledBody = styled.div`
  background: ${themeCssVariables.background.primary};
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  width: 100%;
`;

type SequencesPageLayoutProps = {
  title: string;
  Icon: IconComponent;
  actionButton?: ReactNode;
  // Only rendered once the custom objects exist; record hooks would throw
  // on unknown objects otherwise.
  renderContent: () => ReactNode;
};

export const SequencesPageLayout = ({
  title,
  Icon,
  actionButton,
  renderContent,
}: SequencesPageLayoutProps) => {
  const { isDataModelReady } = useSequencesDataModelStatus();

  return (
    <>
      <PageTitle title={title} />
      <PageCardLayout
        header={
          <PageCardHeader
            icon={<Icon size={16} />}
            title={title}
            actionButton={isDataModelReady ? actionButton : undefined}
          />
        }
      >
        <StyledBody>
          {isDataModelReady ? renderContent() : <SequencesSetupRequired />}
        </StyledBody>
      </PageCardLayout>
    </>
  );
};
