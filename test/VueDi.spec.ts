import { createWrapper } from './lib';
import { injectable, container } from 'tsyringe';

@injectable()
class TestServiceA {}

@injectable()
class TestServiceChildA extends TestServiceA {}

@injectable()
class TestServiceB {}

describe('VueDi', () => {
	it('should setup', async () => {
		const { wrapper } = createWrapper({
			component: v =>
				v.extend({
					template: `<div />`,
					services: {
						serviceA: TestServiceA,
						serviceB: TestServiceB,
					},
				}),
		});

		expect(wrapper.vm).toHaveProperty('$services');
		expect(wrapper.vm.$services).toHaveProperty('serviceA');
		expect(wrapper.vm.$services.serviceA).toBeInstanceOf(TestServiceA);
		expect(wrapper.vm.$services).toHaveProperty('serviceB');
		expect(wrapper.vm.$services.serviceB).toBeInstanceOf(TestServiceB);
		wrapper.destroy();
	});

	it('should setup with extra providers', async () => {
		const { wrapper } = createWrapper({
			providers: [
				{
					token: 'token-value',
					provider: {
						useValue: 'value',
					},
				},
				{
					token: TestServiceA,
					provider: {
						useClass: TestServiceChildA,
					},
				},
			],
			component: v =>
				v.extend({
					template: `<div />`,
					services: {
						tokenValue: 'token-value',
						serviceA: TestServiceA,
						serviceC: null as any,
					},
				}),
		});

		expect(wrapper.vm.$services.tokenValue).toBe('value');
		expect(wrapper.vm.$services.serviceA).toBeInstanceOf(TestServiceChildA);
		expect(wrapper.vm.$services.serviceC).not.toBeDefined();
		wrapper.destroy();
	});

	it('should not setup on null services', async () => {
		const { wrapper } = createWrapper({
			component: v =>
				v.extend({
					template: `<div />`,
				}),
		});
		expect(wrapper.vm.$services).not.toBeDefined();
		wrapper.destroy();
	});

	it('should reject on null containers', async () => {
		expect(() => {
			createWrapper({
				container: null as any,
				component: v =>
					v.extend({
						template: `<div />`,
					}),
			});
		}).toThrowError();
	});

	it('should inject when provided (for nuxt)', async () => {
		const inject: any = jest.fn(() => {});
		const { wrapper } = createWrapper({
			inject,
			component: v =>
				v.extend({
					template: `<div />`,
				}),
		});
		expect(inject).toBeCalledWith('container', container);
		wrapper.destroy();
	});
});
