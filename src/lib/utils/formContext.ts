import { getContext } from 'svelte';

export const FORM_CONTEXT_KEY = 'r2-form';

export type FormErrors = Record<string, string>;
export type FormDataValues = Record<string, unknown>;

export interface FormContext {
	/** Current field values (bindable from `<Form bind:data>`) */
	data: FormDataValues;
	errors: FormErrors;
	submitted: boolean;
	loading: boolean;
	disabled: boolean;
	/** Last result from a remote form / submit handler, if any */
	result: unknown;
	setError: (name: string, message: string) => void;
	clearError: (name: string) => void;
	clearErrors: () => void;
	setData: (name: string, value: unknown) => void;
	getError: (name: string) => string | undefined;
	getData: <T = unknown>(name: string) => T | undefined;
}

/**
 * Access the nearest `<Form>` context from a child component.
 * Returns `null` when used outside a Form.
 */
export function getFormContext(): FormContext | null {
	return getContext<FormContext | null>(FORM_CONTEXT_KEY) ?? null;
}

/** Issue shape compatible with SvelteKit remote `fields.allIssues()` / field issues. */
export interface RemoteFormIssue {
	message: string;
	path?: PropertyKey[];
}

/**
 * Structural subset of SvelteKit `RemoteForm` / `.enhance(...)` return value.
 * Spread onto `<form>` the same way as `{...createPost}` — includes the attachment symbol.
 * Kept loose so this package does not hard-depend on `@sveltejs/kit` types.
 */
export type RemoteFormSpread = {
	method?: 'POST' | 'GET' | 'post' | 'get' | 'dialog' | 'DIALOG';
	action?: string;
	pending?: number;
	result?: unknown;
	submitted?: boolean;
	fields?: {
		allIssues?: () => RemoteFormIssue[] | undefined;
		value?: () => FormDataValues;
	};
	/** Attachment + any other Kit props */
	[key: symbol | string]: unknown;
};

/**
 * Map Kit-style validation issues → `{ field: message }` for `<Form bind:errors>`.
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
		const key =
			issue.path
				?.map(String)
				.filter(Boolean)
				.join('.') || '_form';
		if (!next[key]) next[key] = issue.message;
	}
	return next;
}
