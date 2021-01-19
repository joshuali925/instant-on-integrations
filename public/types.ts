import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface InstantOnIntegrationsPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InstantOnIntegrationsPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
