<script
	lang="ts"
	generics="TData extends FormDataValues = FormDataValues, TInput extends RemoteFormInput | void = RemoteFormInput, TOutput = unknown"
>
	import type { Snippet } from 'svelte';
	import { setContext, untrack } from 'svelte';
	import type { RemoteFormInput } from '@sveltejs/kit';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';
	import {
		FORM_CONTEXT_KEY,
		getRemoteFormId,
		isRemoteForm,
		remoteIssuesToErrors,
		type FormContext,
		type FormDataValues,
		type FormErrors,
		type FormRemote
	} from '$lib/utils/formContext.js';
	import { i18n } from '$lib/utils/i18n.svelte.js';

	interface FormProps {
		/** Field values shared via context (`getFormContext().data`) */
		data?: TData;
		errors?: FormErrors;
		loading?: boolean;
		disabled?: boolean;
		/**
		 * SvelteKit `RemoteForm` (or `.enhance(...)` return).
		 * Spread onto the native `<form>` for progressive enhancement.
		 * When set, we do **not** call `preventDefault` — Kit owns submit.
		 */
		remote?: FormRemote<TInput, TOutput> | null;
		/**
		 * When `remote` is a full `RemoteForm`, sync `fields.allIssues()` → `errors`.
		 * @default true
		 */
		syncRemoteIssues?: boolean;
		/** Optional bag for submit/remote result exposed in context */
		result?: TOutput;
		title?: string;
		description?: string;
		/** Show a summary alert listing field errors after submit */
		showErrorSummary?: boolean;
		errorSummaryTitle?: string;
		gap?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
		/** Client-side submit (ignored when `remote` is set — use `remote.enhance`) */
		onsubmit?: (e: SubmitEvent) => void;
	}

	let {
		data = $bindable<TData>({} as TData),
		errors = $bindable<FormErrors>({}),
		loading = false,
		disabled = false,
		remote = null,
		syncRemoteIssues = true,
		result = $bindable<TOutput | undefined>(undefined),
		title,
		description,
		showErrorSummary = true,
		errorSummaryTitle,
		gap = 'md',
		class: className = '',
		children,
		header,
		footer,
		onsubmit
	}: FormProps = $props();

	let submitted = $state(false);
	const resolvedErrorSummaryTitle = $derived(
		errorSummaryTitle ?? i18n.t('errorSummary')
	);

	const kitForm = $derived(isRemoteForm<TInput, TOutput>(remote) ? remote : null);
	const isRemote = $derived(remote != null);
	const remotePending = $derived(Boolean(kitForm?.pending));
	const busy = $derived(loading || remotePending || disabled);
	// Prefer page-provided `inputName` on fields; optional inferred id is set once below.
	let remoteFormId = $state<string | null>(null);
	let didInitRemoteFormId = false;

	const errorEntries = $derived(Object.entries(errors).filter(([, msg]) => Boolean(msg)));
	const hasErrors = $derived(errorEntries.length > 0);

	const gaps = {
		sm: 'space-y-3',
		md: 'space-y-4',
		lg: 'space-y-6'
	} as const;

	function setError(name: string, message: string) {
		errors = { ...errors, [name]: message };
	}

	function clearError(name: string) {
		if (!(name in errors)) return;
		const next = { ...errors };
		delete next[name];
		errors = next;
	}

	function clearErrors() {
		errors = {};
	}

	function setData<K extends keyof TData & string>(name: K, value: TData[K]) {
		data = { ...data, [name]: value };
	}

	function getError(name: string) {
		return errors[name];
	}

	function getData<K extends keyof TData & string>(name: K) {
		return data[name];
	}

	setContext(FORM_CONTEXT_KEY, {
		get data() {
			return data;
		},
		get errors() {
			return errors;
		},
		get submitted() {
			return submitted;
		},
		get loading() {
			return busy;
		},
		get disabled() {
			return disabled;
		},
		get result() {
			return (result ?? kitForm?.result) as TOutput | undefined;
		},
		get remote() {
			return kitForm as FormContext<TData, TOutput>['remote'];
		},
		get remoteFormId() {
			return remoteFormId;
		},
		setError,
		clearError,
		clearErrors,
		setData,
		getError,
		getData
	} satisfies FormContext<TData, TOutput>);

	if (kitForm && !didInitRemoteFormId) {
		didInitRemoteFormId = true;
		remoteFormId = untrack(() => getRemoteFormId(kitForm.action));
	}

	function syncRemoteIssuesNow() {
		if (!kitForm || !syncRemoteIssues) return;
		const next = remoteIssuesToErrors(kitForm.fields.allIssues());
		errors = next;
		if (Object.keys(next).length > 0) submitted = true;
	}

	function handleSubmit(e: SubmitEvent) {
		if (isRemote) {
			submitted = true;
			queueMicrotask(() => {
				const check = () => {
					if (kitForm && kitForm.pending > 0) {
						requestAnimationFrame(check);
						return;
					}
					syncRemoteIssuesNow();
				};
				check();
			});
			return;
		}
		e.preventDefault();
		submitted = true;
		onsubmit?.(e);
	}
</script>

<form
	{...(remote as object | null)}
	class={['w-full', gaps[gap], className]}
	onsubmit={handleSubmit}
	novalidate
	aria-busy={busy || undefined}
>
	{#if header}
		{@render header()}
	{:else if title || description}
		<div class="space-y-1">
			{#if title}
				<h2 class="text-lg font-semibold tracking-tight text-primary">{title}</h2>
			{/if}
			{#if description}
				<p class="text-sm text-secondary">{description}</p>
			{/if}
		</div>
	{/if}

	{#if showErrorSummary && submitted && hasErrors}
		<Alert variant="error" title={resolvedErrorSummaryTitle} dismissible={false}>
			<ul class="mt-1 list-disc space-y-0.5 pl-4 text-sm">
				{#each errorEntries as [field, message] (field)}
					<li>
						{#if field === '_form'}
							{message}
						{:else}
							<span class="font-medium capitalize">{field}</span>: {message}
						{/if}
					</li>
				{/each}
			</ul>
		</Alert>
	{/if}

	{#if children}{@render children()}{/if}

	{#if footer}
		<div class="flex flex-wrap items-center gap-2 pt-1">
			{@render footer()}
		</div>
	{/if}
</form>
