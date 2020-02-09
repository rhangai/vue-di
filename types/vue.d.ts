import Vue from 'vue';
import { DependencyContainer } from 'tsyringe';

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {
		services?: {
			[key: string]: any;
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
