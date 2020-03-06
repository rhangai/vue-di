import { VueConstructor } from 'vue';
import { VueDiOptions } from '.';
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
	const container = options.container;
	if (!container)
		throw new Error(`Invalid container when installing vue-di. Did you use { container } from "tsyringe" module?`);
	if (options.providers) {
		for (const provider of options.providers) {
			container.register(provider.token, provider.provider as any);
		}
	}

	// Inject using nuxt if inject is provided
	if (options.inject) {
		options.inject('container', container);
	} else {
		Object.defineProperty(vue.prototype, '$container', {
			writable: false,
			enumerable: true,
			value: container,
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
