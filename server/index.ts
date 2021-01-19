import { PluginInitializerContext } from '../../../src/core/server';
import { InstantOnIntegrationsPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new InstantOnIntegrationsPlugin(initializerContext);
}

export { InstantOnIntegrationsPluginSetup, InstantOnIntegrationsPluginStart } from './types';
