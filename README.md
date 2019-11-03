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
import { ReplaySubject } from 'rxjs';

@singleton()
class UserService {
	private readonly usuario$ = new ReplaySubject(1);
	constructor(private readonly dataService: DataService) {}

	async login() {
		this.dataService.doSomething();
		this.usuario$.next({ id: 1, name: "John Doe" });
		return request(...);
	}

	fetch$() {
		return this.usuario$;
	}
}
```

`Component.vue`

```ts
//<template><div>{{user}}</div></template>
import { UserService } from 'services/User.service';

export default {
	services: {
		userService: UserService,
	},
	servicesData: {
		user: {
			service: UserService,
			method: 'fetch$',
		},
	},
	methods: {
		async login() {
			await this.$services.userService.login();
		},
		doSomethingWithUser() {
			if (!this.user) return 'Invalid user';
			send(this.user.name);
		},
	},
};
```

## Installation

```sh
yarn add @renanhangai/vue-di reflect-metadata
```

### Installation with **nuxt**

on your entrypoint

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

## ServiceData

When using servicesData, you may return a few things

### Observable

Returning an observable makes the component subscribe to it and react to its changes

### Promise

### Value

### DataFetcher

Returning an object with an observable\$ method or property will subscribe to it and allow a few more options
