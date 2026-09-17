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
	/**
	 * Full Kit `RemoteForm` when `<Form remote={...}>` received one
	 * (not an `.enhance(...)` return). Used by fields to call `.as()`.
	 */
	remote: RemoteForm<any, any> | null;
	/** Stable Kit form id (`1p9kxmo/login_user`) for encoding input names */
	remoteFormId: string | null;
	setError: (name: string, message: string) => void;
	clearError: (name: string) => void;
	clearErrors: () => void;
	setData: <K extends keyof TData & string>(name: K, value: TData[K]) => void;
	getError: (name: string) => string | undefined;
	getData: <K extends keyof TData & string>(name: K) => TData[K] | undefined;
}

/**
 * Props safe to spread onto library `<Input>` / `<PasswordInput>` for Kit remote forms.
 * Omits Kit `value` getters/setters so they do not fight `bind:value`.
 */
export type ResolvedRemoteInputProps = {
	name?: string;
};

/**
 * Extract Kit remote form id from `remote.action` (`?/remote=<id>`).
 * Pass `untrack(() => remote.action)` from callers inside effects/derived.
 */
export function getRemoteFormId(action: string | undefined | null): string | null {
	if (!action) return null;
	const match = action.match(/\/remote=([^&]+)/);
	return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Resolve HTML input props for a field inside a Kit remote form.
 *
 * Kit 2.70+ `.as()` emits the logical path only (`email`, `n:age`, `b:active`).
 * The remote id lives on the form `action` (`?/remote=…`), not on each field name.
 * Appending `/${formId}` breaks `convert_formdata` / `split_path` — especially with
 * keyed instances (`.for(key)` → `…/"default"`), which surfaces as:
 * `Invalid path status/…/updateProduct_remote/"default"`.
 *
 * `formId` is kept for call-site compatibility / legacy stripping in
 * {@link parseRemoteFieldName}; it is not appended to `name`.
 */
export function resolveRemoteInputProps(
	_formId: string | null | undefined,
	logicalName: string | undefined,
	type: string = 'text'
): ResolvedRemoteInputProps {
	if (!logicalName) return {};

	// Already Kit-encoded or legacy `field/formId` — leave as-is.
	if (logicalName.includes('/')) {
		return { name: logicalName };
	}

	let prefix = '';
	if (type === 'number' || type === 'range') prefix = 'n:';
	else if (type === 'checkbox' || type === 'boolean') prefix = 'b:';

	return { name: `${prefix}${logicalName}` };
}

export type ParsedRemoteFieldName = {
	/** Field path for errors / `form.data` (`email`, `items[0].name`) */
	logicalName: string | undefined;
	/** Exact HTML `name` to put on the input (Kit-encoded or plain) */
	htmlName: string | undefined;
	/** True when `name` still has a legacy `/${formId}` suffix */
	isEncoded: boolean;
};

/**
 * Split a (possibly legacy) HTML `name` into logical + html parts.
 * Plain Kit 2.70+ names (`email`, `n:age`) pass through unchanged.
 *
 * Still strips a legacy `/${formId}` suffix when present (older lib builds
 * appended the remote action id to every field name).
 */
export function parseRemoteFieldName(
	name: string | undefined,
	formId?: string | null
): ParsedRemoteFieldName {
	if (!name) {
		return { logicalName: undefined, htmlName: undefined, isEncoded: false };
	}

	const htmlName = name;

	if (formId && name.endsWith(`/${formId}`)) {
		let logical = name.slice(0, -(formId.length + 1));
		if (logical.startsWith('n:') || logical.startsWith('b:')) logical = logical.slice(2);
		if (logical.endsWith('[]')) logical = logical.slice(0, -2);
		return { logicalName: logical, htmlName, isEncoded: true };
	}

	// Legacy heuristic: names with `/` used to mean `field/formId`
	if (name.includes('/')) {
		let rest = name;
		if (rest.startsWith('n:') || rest.startsWith('b:')) rest = rest.slice(2);
		const slash = rest.indexOf('/');
		if (slash !== -1) {
			let logical = rest.slice(0, slash);
			if (logical.endsWith('[]')) logical = logical.slice(0, -2);
			return { logicalName: logical, htmlName, isEncoded: true };
		}
	}

	let logical = name;
	if (logical.startsWith('n:') || logical.startsWith('b:')) logical = logical.slice(2);
	if (logical.endsWith('[]')) logical = logical.slice(0, -2);
	return { logicalName: logical, htmlName: name, isEncoded: false };
}

/**
 * Safe props to spread onto `FormField` / `FormPasswordInput` from Kit `.as(...)`.
 * Keeps `name` (+ `type`) and drops Kit `value` / `defaultValue` accessors that
 * fight library `$bindable` and can cause `effect_update_depth_exceeded`.
 *
 * @example
 * ```svelte
 * <FormField {...remoteAsProps(login_user.fields.email.as('email'))} label="Email" />
 * ```
 */
export function remoteAsProps(asProps: {
	name: string;
	type?: string;
}): { name: string; type?: string } {
	return asProps.type != null
		? { name: asProps.name, type: asProps.type }
		: { name: asProps.name };
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
	// Avoid reading `.fields` (client getter allocates a proxy and can loop in `$derived`).
	return !!remote && 'fields' in remote;
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
