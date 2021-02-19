import React from 'react';
import { I18nProvider } from '@kbn/i18n/react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { ChromeBreadcrumb, CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import { PipelinesView } from './pipelines_view';
import { DashboardsView } from './dashboards_view';
import { renderPageWithSidebar } from './helpers/side_nav';
import { CreatePipeline } from './create_pipeline';

interface InstantOnIntegrationsAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  chrome: CoreStart['chrome'];
  navigation: NavigationPublicPluginStart;
}

export interface CoreDeps {
  http: CoreStart['http'];
  notifications: CoreStart['notifications'];
  setBreadcrumbs: (newBreadcrumbs: ChromeBreadcrumb[]) => void;
}

export const InstantOnIntegrationsApp = ({
  basename,
  notifications,
  http,
  chrome,
  navigation,
}: InstantOnIntegrationsAppDeps) => {
  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  const commonProps: CoreDeps = {
    http,
    notifications,
    setBreadcrumbs: chrome.setBreadcrumbs,
  };
  
  return (
    <HashRouter>
      <I18nProvider>
        <>
          <Switch>
            <Route
              exact
              path="/dashboards"
              render={(props) => renderPageWithSidebar(<DashboardsView {...commonProps} />, 1)}
            />
            <Route
              exact
              path={['/pipelines', '/']}
              render={(props) => renderPageWithSidebar(<PipelinesView {...commonProps} />, 2)}
            />
            <Route
              exact
              path={'/pipelines/create'}
              render={(props) => <CreatePipeline {...commonProps} />}
            />
          </Switch>
        </>
      </I18nProvider>
    </HashRouter>
  );
};
