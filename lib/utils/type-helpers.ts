export type WithUndefined<TObject extends Record<string, unknown>> = {
	[Key in keyof TObject]: null extends TObject[Key] ? TObject[Key] : TObject[Key] | undefined;
};
