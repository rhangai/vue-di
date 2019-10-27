/* <% if (options.reflectMetadata) { %> */
import 'reflect-metadata';
/* <% } %> */
import Vue from 'vue';
import { setup } from '<%= options.plugin %>';

export default async function(context, inject) {
	if (process.server) return;
	// Providers
	const providers = [];

	// Nuxt application
	providers.push({
		token: 'app',
		provider: {
			useValue: context.app,
		},
	});
	// Router
	providers.push({
		token: 'router',
		provider: {
			useValue: context.app.router,
		},
	});
	/* <% if (options.axios) { %> */
	providers.push({
		token: 'axios',
		provider: {
			useFactory: () => context.$axios,
		},
	});
	/* <% } %> */
	/* <% if (options.apollo) { %> */
	providers.push({
		token: 'apollo',
		provider: {
			useFactory: () => context.app.apolloProvider.clients.defaultClient,
		},
	});
	/* <% } %> */
	setup(Vue, {
		inject,
		providers,
	});
}
