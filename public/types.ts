import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface InstantOnIntegrationsPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InstantOnIntegrationsPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}

export interface PipelineType {
  description?: string;
  processors: any[];
  version?: number;
  on_failure?: any[];
}