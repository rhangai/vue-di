import path from 'path';

export default function nuxtBootstrapVue(moduleOptions) {
	moduleOptions = moduleOptions || {};

	const package = require('../package.json');
	this.addPlugin({
		src: path.resolve(__dirname, 'plugin.js'),
		options: {
			plugin: package.name,
			apollo: !!moduleOptions.apollo,
		},
	});
}
