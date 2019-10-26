/// <reference path="../types/vue.d.ts" />

import { PluginObject, VueConstructor } from 'vue';
import {
	InjectionToken,
	ValueProvider,
	FactoryProvider,
	TokenProvider,
	ClassProvider,
	DependencyContainer,
} from 'tsyringe';
import { setup } from './setup';

export type VueDiProvider = {
	token: InjectionToken;
	provider: ValueProvider<any> | FactoryProvider<any> | TokenProvider<any> | ClassProvider<any>;
};

export type VueDiOptions = {
	container?: DependencyContainer;
	providers?: VueDiProvider[];
};

const Plugin: PluginObject<VueDiOptions> = {
	install(vue: VueConstructor, options?: VueDiOptions) {
		setup(vue, options);
	},
};
export default Plugin;
export { setup };
