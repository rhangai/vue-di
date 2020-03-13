import VueDi, { VueDiOptions } from '../src';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { container } from 'tsyringe';

type CreateVueOptions<V extends Vue> = VueDiOptions & {
	setup?: (v: VueConstructor<Vue>) => unknown;
};
type CreateWrapperOptions<V extends Vue> = CreateVueOptions<V> & {
	component?: (v: VueConstructor<Vue>) => VueConstructor<V>;
};

type CreateWrapperResult<V extends Vue> = {
	wrapper: Wrapper<V>;
	vue: VueConstructor;
};

function createVue(options?: CreateVueOptions<Vue>) {
	options = {
		container,
		...options,
	};
	const vue = createLocalVue();
	vue.use(VueDi, options);
	return { vue };
}

export function createWrapper<V extends Vue>(
	options?: CreateWrapperOptions<V>
): CreateWrapperResult<V> {
	const { vue } = createVue(options);
	const component =
		options?.component?.(vue) ??
		vue.extend({
			template: '<div />',
		});
	const wrapper = mount(component, { localVue: vue });
	return { wrapper: wrapper as any, vue };
}
