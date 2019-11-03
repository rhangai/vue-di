import Vue, { VueConstructor } from 'vue';
import { VueDiServiceDataOptions, VueDiServiceData } from '../types/options';

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

		const data = this.createServiceData();

		/**
		 * Subsribe to the service data
		 * @param params
		 */
		const subscribe = (params?: any) => {
			// Save the parameters
			subscriptionLastParams = params;
			if (this.subscriptions[key]) {
				this.subscriptions[key].unsubscribe();
				this.subscriptions[key] = null;
			}

			// Close the old fetcher data
			if (data.fetcher) {
				if (data.fetcher.close) {
					data.fetcher.close();
				}
				data.fetcher = null;
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

				// Null result
				if (result == null) {
					data.error = null;
					data.value = null;
					data.fetcher = null;
					data.loading = false;
					data.complete = true;
					this.vm.$set(this.vm, key, null);
					return;
				}

				// Check if result is an obersable or anything with an observable$ method or property
				let observable = null;
				let fetcher = null;
				if (result.observable$) {
					fetcher = result;
					observable = typeof result.observable$ === 'function' ? result.observable$() : result.observable$;
				} else if (result.subscribe) {
					observable = result;
				}
				if (observable) {
					data.loading = true;
					data.complete = false;
					data.fetcher = fetcher;
					this.subscriptions[key] = observable.subscribe({
						next: (value: any) => {
							if (this.keys[key] !== callKey) return;
							data.loading = false;
							data.error = null;
							data.value = value;
							this.vm.$set(this.vm, key, value);
						},
						complete: () => {
							if (this.keys[key] !== callKey) return;
							data.loading = false;
							data.complete = true;
						},
						error: (error: any) => {
							if (this.keys[key] !== callKey) return;
							data.error = error;
							data.loading = false;
							data.complete = true;
						},
					});
					return;
				}

				// Fetch a promise
				if (result.then) {
					data.loading = true;
					data.complete = false;
					data.fetcher = null;
					result.then(
						(value: any) => {
							if (this.keys[key] !== callKey) return;
							data.error = null;
							data.value = value;
							data.loading = false;
							data.complete = true;
							this.vm.$set(this.vm, key, value);
						},
						(error: any) => {
							if (this.keys[key] !== callKey) return;
							data.error = error;
							data.loading = false;
							data.complete = true;
						}
					);
					return;
				}

				// Fetch the result normally
				data.error = null;
				data.value = result;
				data.fetcher = null;
				data.loading = false;
				data.complete = true;
				this.vm.$set(this.vm, key, result);
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
		data.refresh = function() {
			subscribe(subscriptionLastParams);
		};
		data.fetchMore = function() {
			if (data.complete || data.loading) return;
			if (data.fetcher && data.fetcher.fetchMore) {
				data.loading = true;
				return data.fetcher.fetchMore();
			}
		};
		return data;
	}

	createServiceData(): VueDiServiceData {
		// @ts-ignore
		const data: VueDiServiceData = this.vue.observable({
			value: null,
			error: null,
			loading: false,
			complete: false,
		});
		data.fetcher = null;
		return data;
	}
}
