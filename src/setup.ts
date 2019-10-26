import { VueConstructor } from 'vue';
import { VueDiOptions } from '.';
import { container } from 'tsyringe';

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
		beforeCreate() {
			const services: any = {};
			if (this.$options.services) {
				for (const key in this.$options.services) {
					const serviceClass = this.$options.services[key];
					if (!serviceClass) {
						services[key] = null;
					} else {
						services[key] = this.$container.resolve(serviceClass);
					}
				}
			}
			Object.defineProperty(this, '$services', {
				writable: false,
				enumerable: true,
				value: Object.freeze(services),
			});
		},
	});
}
