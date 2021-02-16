import React from 'react';
import { I18nProvider } from '@kbn/i18n/react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import { PipelinesView } from './pipelines_view';
import { DashboardsView } from './dashboards_view';

interface InstantOnIntegrationsAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const InstantOnIntegrationsApp = ({
  basename,
  notifications,
  http,
  navigation,
}: InstantOnIntegrationsAppDeps) => {
  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <HashRouter>
    <I18nProvider>
      <>
        <Switch>
          <Route
            exact
            path={['/pipelines', '/']}
            render={(props) => <PipelinesView http={http} notifications={notifications} />}
          />
          <Route
            exact
            path="/dashboards"
            render={(props) => <DashboardsView http={http} notifications={notifications} />}
          />
          </Switch>
        </>
      </I18nProvider>
      </HashRouter>
  );
};
