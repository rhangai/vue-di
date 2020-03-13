import Vue from 'vue';
import { DependencyContainer, InjectionToken } from 'tsyringe';

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {
		services?: {
			[key: string]: InjectionToken;
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
	}
}
