import path from 'path';

export default function nuxtBootstrapVue(moduleOptions) {
	moduleOptions = moduleOptions || {};

	const pkg = require('../package.json');
	this.addPlugin({
		src: path.resolve(__dirname, 'plugin.js'),
		options: {
			plugin: pkg.name,
			apollo: optionsApolloCheck(this.options, moduleOptions),
			axios: optionsAxiosCheck(this.options, moduleOptions),
		},
	});
}

function optionsApolloCheck(options, moduleOptions) {
	if (moduleOptions.apollo != null) return !!moduleOptions.apollo;
	if (!options.modules) return false;
	return options.modules.indexOf('@nuxtjs/apollo') >= 0;
}

function optionsAxiosCheck(options, moduleOptions) {
	if (moduleOptions.apollo != null) return !!moduleOptions.apollo;
	if (!options.modules) return false;
	return options.modules.indexOf('@nuxtjs/axios') >= 0;
}
