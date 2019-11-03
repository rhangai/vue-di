export type VueDiServiceDataOptionsParams = object | number | string | symbol | boolean | null;

export type VueDiServiceDataOptions<T> = {
	service: any;
	method?: string;
	params?: ((this: T) => VueDiServiceDataOptionsParams) | VueDiServiceDataOptionsParams;
};

export type VueDiServiceData = {
	error: any;
	value: any;
	loading: boolean;
	complete: boolean;
	fetcher: any;
	fetchMore(): boolean | Promise<boolean>;
	refresh(): void;
};
