import { getContext, untrack } from 'svelte';
import type {
	RemoteForm,
	RemoteFormInput,
	RemoteFormIssue
} from '@sveltejs/kit';

export type { RemoteForm, RemoteFormInput, RemoteFormIssue };

export const FORM_CONTEXT_KEY = 'r2-form';

export type FormErrors = Record<string, string>;
export type FormDataValues = Record<string, unknown>;
export type FormFieldStatus = 'default' | 'error' | 'success' | 'warning';

/**
 * Build a dotted path for nested form errors / remote issues
 * (e.g. `items.0.email`).
 */
export function fieldPath(...segments: Array<string | number>): string {
	return segments.map(String).filter((s) => s.length > 0).join('.');
}

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

/**
 * Shared resolution for form-aware controls (error / status / disabled).
 */
export function resolveFormFieldState(options: {
	name?: string;
	errorMessage?: string;
	helperText?: string;
	status?: FormFieldStatus;
	disabled?: boolean;
	form?: FormContext | null;
}): {
	error?: string;
	status: FormFieldStatus;
	helperText?: string;
	disabled: boolean;
} {
	const {
		name,
		errorMessage,
		helperText,
		status = 'default',
		disabled = false,
		form = null
	} = options;

	const error = errorMessage ?? (name && form ? form.getError(name) : undefined);
	return {
		error,
		status: error ? 'error' : status,
		helperText: error ?? helperText,
		disabled: disabled || Boolean(form?.loading) || Boolean(form?.disabled)
	};
}

/**
 * Push context → local inside an `$effect` that tracks `form.data[name]`.
 * Local value is read under `untrack` so user input is not overwritten when
 * the local state updates before `setData` lands.
 *
 * @example
 * ```ts
 * $effect(() => {
 *   if (!bindData || !name || !form) return;
 *   applyFormDataSync({
 *     fromCtx: form.data[name],
 *     getLocal: () => value,
 *     setLocal: (v) => { value = v; },
 *     map: (raw) => (raw !== undefined ? String(raw) : undefined)
 *   });
 * });
 * ```
 */
export function applyFormDataSync<T>(options: {
	fromCtx: unknown;
	getLocal: () => T;
	setLocal: (next: T) => void;
	map: (raw: unknown) => T | undefined;
	equals?: (a: T, b: T) => boolean;
}): void {
	const { fromCtx, getLocal, setLocal, map, equals = Object.is } = options;
	const next = map(fromCtx);
	if (next === undefined) return;
	if (equals(untrack(getLocal), next)) return;
	setLocal(next);
}

export function sameStringArray(a: string[], b: string[]): boolean {
	return a.length === b.length && a.every((v, i) => v === b[i]);
}
