/* <% if (options.reflectMetadata) { %> */
import 'reflect-metadata';
/* <% } %> */
import Vue from 'vue';
import VueRouter from 'vue-router';
/* <% if (options.apollo) { %> */
import ApolloClient from 'apollo-client';
/* <% } %> */
import { setup } from '<%= options.plugin %>';

export default async function(context, inject) {
	if (process.server) return;
	// Providers
	const providers = [];

	// Cria o container
	providers.push({
		token: VueRouter,
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
		token: ApolloClient,
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
