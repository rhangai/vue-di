import Vue from 'vue';
import VueRouter from 'vue-router';
/* <% if (options.apollo) { %> */
import ApolloClient from 'apollo-client';
/* <% } %> */
import { setup } from '<%= options.plugin %>';

export default async function(context, inject) {
	// Providers
	const providers = [];

	// Cria o container
	providers.push({
		token: VueRouter,
		provider: {
			useValue: context.app.router,
		},
	});
	/* <% if (options.apollo) { %> */
	providers.push({
		token: ApolloClient,
		useValue: context.app.apolloProvider.clients.defaultClient,
	});
	/* <% } %> */
	setup(Vue, {
		inject,
		providers,
	});
}
