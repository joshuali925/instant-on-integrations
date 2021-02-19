import { EuiPage, EuiPageBody, EuiPageSideBar, EuiSideNav } from '@elastic/eui';
import React from 'react';

export const renderPageWithSidebar = (BodyComponent: JSX.Element, activeId = 1) => {
  function SideNav({ activeId }: { activeId: number }) {
    return (
      <EuiSideNav
        items={[
          {
            name: 'Instant on Integrations',
            id: 0,
            items: [
              {
                name: 'Dashboards',
                id: 1,
                href: '#/dashboards',
              },
              {
                name: 'Pipelines',
                id: 2,
                href: '#/pipelines',
              },
            ].map((item) => {
              return { ...item, isSelected: activeId === item.id };
            }),
          },
        ]}
      />
    );
  }

  return (
    <EuiPage>
      <EuiPageSideBar>
        <SideNav activeId={activeId} />
      </EuiPageSideBar>
      <EuiPageBody>{BodyComponent}</EuiPageBody>
    </EuiPage>
  );
};
