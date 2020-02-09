import { VueConstructor } from 'vue';
import { VueDiOptions } from '.';
import { container } from 'tsyringe';
import { ServiceContainer } from './ServiceContainer';

export type VueDiSetupOptions = VueDiOptions & {
	inject?: any;
};

/**
 * Setup the plugin
 * @param vue
 * @param options
 */
export function setup(vue: VueConstructor, options?: VueDiSetupOptions) {
	options = { ...options };

	// Create the container
	const appContainer = options.container || container;
	if (options.providers) {
		for (const provider of options.providers) {
			appContainer.register(provider.token, provider.provider as any);
		}
	}

	// Inject using nuxt if inject is provided
	if (options.inject) {
		options.inject('container', appContainer);
	} else {
		Object.defineProperty(vue.prototype, '$container', {
			writable: false,
			enumerable: true,
			value: appContainer,
		});
	}

	vue.mixin({
		/**
		 * Create the service container
		 */
		beforeCreate() {
			if (!this.$options.services) return;
			const container = new ServiceContainer(vue, this);
			container.setup();
			//@ts-ignore
			this._serviceContainer = container;
		},
		beforeDestroy() {
			//@ts-ignore
			this._serviceContainer && this._serviceContainer.destroy();
		},
	});
}
