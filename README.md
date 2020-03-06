# vue-di

Dependency Injection for vue, made simple.

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
yarn add @renanhangai/vue-di tsyringe reflect-metadata
```

### Installation with **nuxt**

on your entrypoint

```js
import 'reflect-metadata';
import Vue from 'vue';
import VueDi from '@renanhangai/vue-di';
import { container } from 'tsyringe';

Vue.use(VueDi, {
	container,
	// ... other options
});
```

on `vue.config.js`

```js
module.exports = {
	transpileDependencies: ['@renanhangai/vue-di'],
};
```

### Installation with **nuxt**

```js
export default {
	modules: ['@renanhangai/vue-di/nuxt'],
	build: {
		transpile: ['@renanhangai/vue-di'],
	},
};
```
