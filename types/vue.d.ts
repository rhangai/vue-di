import Vue from 'vue';
import { DependencyContainer } from 'tsyringe';
import { VueDiServiceDataOptions, VueDiServiceData } from './options';

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {
		services?: {
			[key: string]: any;
		};
		servicesData?: {
			[key: string]: VueDiServiceDataOptions<V> | { new (...args: any[]): any };
		};
	}
}
/**
 * Extends the VueInterface
 */
declare module 'vue/types/vue' {
	interface Vue {
		$container: DependencyContainer;
		$services: {
			[key: string]: any;
		};
		$servicesData: {
			[key: string]: VueDiServiceData;
		};
	}
}
