# @rhangai/vue-di

Dependency Injection for vue, using [tsryinge](https://github.com/microsoft/tsyringe)

## Basic Usage

Simple usage

`Data.service.ts`

```ts
import { injectable } from 'tsyringe';

@injectable()
class DataService {
	constructor() {}

	async doSomething() {}
}
```

`User.service.ts`

```ts
import { singleton } from 'tsyringe';
import { DataService } from './Data.service';

@singleton()
class UserService {
	constructor(private readonly dataService: DataService) {}

	async login() {
		await this.dataService.doSomething();
		return request(...);
	}
}
```

`Component.vue`

```ts
import { UserService } from 'services/User.service';

export default {
	services: {
		userService: UserService,
	},
	methods: {
		async login() {
			await this.$services.userService.login();
		},
	},
};
```

## Installation

```sh
yarn add @rhangai/vue-di tsyringe reflect-metadata
```

### Installation with **nuxt**

on your entrypoint

```js
import 'reflect-metadata';
import Vue from 'vue';
import VueDi from '@rhangai/vue-di';
import { container } from 'tsyringe';

Vue.use(VueDi, {
	container,
	// ... other options
});
```

on `vue.config.js`

```js
module.exports = {
	transpileDependencies: ['@rhangai/vue-di'],
};
```

### Installation with **nuxt**

```js
export default {
	modules: ['@rhangai/vue-di/nuxt'],
	build: {
		transpile: ['@rhangai/vue-di'],
	},
};
```

When using nuxt, there is already a few services registered.

-   `app`: Nuxt Application
-   `router`: Vue Router
-   `axios`: this.\$axios if using @nuxtjs/axios
-   `apollo`: this.\$apollo if using @nuxtjs/apollo

```ts
import { injectable, inject } from 'tsyringe';

@injectable()
export class LoginService {
	constructor(@inject('axios') private readonly axios: any) {}

	async login() {
		const response = await this.axios.post(/* ... */);
	}
}
```
