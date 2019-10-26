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

	doSomething() {}
}
```

`User.service.ts`

```ts
import { singleton } from 'tsyringe';
import { DataService } from './Data.service';

@singleton()
class UserService {
	constructor(private readonly dataService: DataService) {}

	login() {
		this.dataService.doSomething();
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
		login() {
			this.$services.userService.login();
		},
	},
};
```

## Installation

```sh
yarn add @renanhangai/vue-di reflect-metadata
```

### Installation with **nuxt**

on your entrypoit

```js
import 'reflect-metadata';
import Vue from 'vue';
import VueDi from '@renanhangai/vue-di';

Vue.use(VueDi, options);
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
