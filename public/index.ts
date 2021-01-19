import './index.scss';

import { InstantOnIntegrationsPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new InstantOnIntegrationsPlugin();
}
export { InstantOnIntegrationsPluginSetup, InstantOnIntegrationsPluginStart } from './types';
