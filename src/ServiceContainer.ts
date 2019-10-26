import Vue, { VueConstructor } from 'vue';
import { VueDiServiceDataOptions } from '../types/options';

export class ServiceContainer {
	private readonly subscriptions: { [key: string]: any } = {};
	private keys: { [key: string]: any } = {};

	constructor(private readonly vue: VueConstructor, private readonly vm: Vue) {}

	data() {
		const servicesData: any = {};
		if (this.vm.$options.servicesData) {
			for (const key in this.vm.$options.servicesData) {
				const serviceData = this.vm.$options.servicesData[key];
				if (!serviceData) {
					continue;
				}
				servicesData[key] = null;
			}
		}
		return servicesData;
	}

	setup() {
		this.setupServices();
		this.setupServicesData();
	}

	/// Destroy the subscriptions, if any
	destroy() {
		for (const key in this.subscriptions) {
			if (this.subscriptions[key]) this.subscriptions[key].unsubscribe();
		}
		this.keys = {};
	}

	/**
	 * Setup the $services variable on the vue vm
	 */
	setupServices() {
		// Create the services
		const services: any = {};
		if (this.vm.$options.services) {
			for (const key in this.vm.$options.services) {
				const serviceClass = this.vm.$options.services[key];
				if (!serviceClass) {
					services[key] = null;
				} else {
					services[key] = this.vm.$container.resolve(serviceClass);
				}
			}
		}
		Object.defineProperty(this.vm, '$services', {
			writable: true,
			enumerable: true,
			value: Object.freeze(services),
		});
	}

	/**
	 * Setup every $servicesData
	 *
	 * For every servicesData entry, resolve the property and create a $services
	 */
	setupServicesData() {
		// Create the services
		const servicesData: any = {};
		if (this.vm.$options.servicesData) {
			for (const key in this.vm.$options.servicesData) {
				const serviceData = this.vm.$options.servicesData[key];
				if (!serviceData) {
					continue;
				}
				servicesData[key] = this.setupServiceDataItem(key, serviceData);
			}
		}
		Object.defineProperty(this.vm, '$servicesData', {
			writable: true,
			enumerable: true,
			value: Object.freeze(servicesData),
		});
	}

	/// Setup every item
	setupServiceDataItem(key: string, serviceData: VueDiServiceDataOptions<Vue> | { new (...args: any[]): any }) {
		/// When a constructor is passed directly, call the fetch$
		if (typeof serviceData === 'function') {
			serviceData = {
				service: serviceData,
			};
		}

		const service = this.vm.$container.resolve(serviceData.service);
		const method = serviceData.method || 'fetch$';
		const params = serviceData.params;

		let subscriptionLastParams: any = null;

		const data = this.vue.observable({
			value: null,
			error: null,
			loading: false,
		});
		const subscribe = (params?: any) => {
			subscriptionLastParams = params;
			if (this.subscriptions[key]) {
				this.subscriptions[key].unsubscribe();
				this.subscriptions[key] = null;
			}

			const callKey = {};
			this.keys[key] = callKey;

			try {
				//@ts-ignore
				if (!service[method]) {
					throw new Error(`Method "${method}" does not exist on serviceData "${key}".`);
				}

				// @ts-ignore
				const result = service[method].call(service, params);
				if (result == null) {
					data.error = null;
					data.value = null;
					this.vm.$set(this.vm, key, null);
				} else if (result.subscribe) {
					data.loading = true;
					this.subscriptions[key] = result.subscribe({
						next: (value: any) => {
							if (this.keys[key] !== callKey) return;
							data.loading = false;
							data.error = null;
							data.value = value;
							this.vm.$set(this.vm, key, value);
						},
						error: (error: any) => {
							if (this.keys[key] !== callKey) return;
							data.loading = false;
							data.error = error;
						},
					});
				} else if (result.then) {
					data.loading = true;
					result.then(
						(value: any) => {
							if (this.keys[key] !== callKey) return;
							data.loading = false;
							data.error = null;
							data.value = value;
							this.vm.$set(this.vm, key, value);
						},
						(error: any) => {
							if (this.keys[key] !== callKey) return;
							data.loading = false;
							data.error = error;
						}
					);
				} else {
					data.error = null;
					data.value = result;
					this.vm.$set(this.vm, key, result);
				}
			} catch (err) {
				data.error = err;
			}
		};

		if (typeof params === 'function') {
			this.vm.$watch(
				// @ts-ignore
				params,
				(params: any) => {
					subscribe(params);
				},
				{ immediate: true }
			);
		} else {
			subscribe(params);
		}
		// @ts-ignore
		data.refresh = function() {
			subscribe(subscriptionLastParams);
		};
		return data;
	}
}