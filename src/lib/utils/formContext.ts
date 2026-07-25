import { getContext } from 'svelte';
import type {
	RemoteForm,
	RemoteFormInput,
	RemoteFormIssue
} from '@sveltejs/kit';

export type { RemoteForm, RemoteFormInput, RemoteFormIssue };

export const FORM_CONTEXT_KEY = 'r2-form';

export type FormErrors = Record<string, string>;
export type FormDataValues = Record<string, unknown>;

/**
 * Spreadable remote form binding: a Kit `RemoteForm` or the object returned by `.enhance(...)`.
 *
 * @example
 * ```ts
 * remote={createPost}
 * remote={createPost.enhance(async (form) => { ... })}
 * ```
 */
export type FormRemote<
	Input extends RemoteFormInput | void = RemoteFormInput,
	Output = unknown
> =
	| RemoteForm<Input, Output>
	| ReturnType<RemoteForm<Input, Output>['enhance']>;

/** @deprecated Use `FormRemote` (or `RemoteForm` from `@sveltejs/kit`) */
export type RemoteFormSpread<
	Input extends RemoteFormInput | void = RemoteFormInput,
	Output = unknown
> = FormRemote<Input, Output>;

export interface FormContext<
	TData extends FormDataValues = FormDataValues,
	TResult = unknown
> {
	/** Current field values (bindable from `<Form bind:data>`) */
	data: TData;
	errors: FormErrors;
	submitted: boolean;
	loading: boolean;
	disabled: boolean;
	/** Last result from a remote form / submit handler, if any */
	result: TResult | undefined;
	setError: (name: string, message: string) => void;
	clearError: (name: string) => void;
	clearErrors: () => void;
	setData: <K extends keyof TData & string>(name: K, value: TData[K]) => void;
	getError: (name: string) => string | undefined;
	getData: <K extends keyof TData & string>(name: K) => TData[K] | undefined;
}

/**
 * Access the nearest `<Form>` context from a child component.
 * Returns `null` when used outside a Form.
 *
 * @example
 * ```ts
 * const form = getFormContext<{ email: string }, { ok: boolean }>();
 * form?.getData('email');
 * form?.result?.ok;
 * ```
 */
export function getFormContext<
	TData extends FormDataValues = FormDataValues,
	TResult = unknown
>(): FormContext<TData, TResult> | null {
	return getContext<FormContext<TData, TResult> | null>(FORM_CONTEXT_KEY) ?? null;
}

/**
 * Map Kit `RemoteFormIssue[]` → `{ field: message }` for `<Form bind:errors>`.
 *
 * @example
 * ```ts
 * errors = remoteIssuesToErrors(createPost.fields.allIssues());
 * ```
 */
export function remoteIssuesToErrors(
	issues: RemoteFormIssue[] | null | undefined
): FormErrors {
	if (!issues?.length) return {};
	const next: FormErrors = {};
	for (const issue of issues) {
		const key = issue.path.map(String).filter(Boolean).join('.') || '_form';
		if (!next[key]) next[key] = issue.message;
	}
	return next;
}

/** True when the spread value is a full `RemoteForm` (has `fields` / `pending`). */
export function isRemoteForm<
	Input extends RemoteFormInput | void = RemoteFormInput,
	Output = unknown
>(remote: FormRemote<Input, Output> | null | undefined): remote is RemoteForm<Input, Output> {
	return !!remote && 'fields' in remote && typeof (remote as RemoteForm<Input, Output>).fields === 'object';
}
