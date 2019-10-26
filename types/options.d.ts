export type VueDiServiceDataOptionsParams = object | number | string | symbol | boolean | null;

export type VueDiServiceDataOptions<T> = {
	service: any;
	method?: string;
	params?: ((this: T) => VueDiServiceDataOptionsParams) | VueDiServiceDataOptionsParams;
};

export type VueDiServiceData = {
	value: any;
	error: any;
	loading: boolean;
	refresh: () => void;
};
