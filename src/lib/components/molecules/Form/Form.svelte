<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';
	import {
		FORM_CONTEXT_KEY,
		remoteIssuesToErrors,
		type FormContext,
		type FormDataValues,
		type FormErrors,
		type RemoteFormSpread
	} from '$lib/utils/formContext.js';

	interface FormProps {
		/** Field values shared via context (`getFormContext().data`) */
		data?: FormDataValues;
		errors?: FormErrors;
		loading?: boolean;
		disabled?: boolean;
		/**
		 * SvelteKit remote `form()` instance (or `.enhance(...)`).
		 * Spread onto the native `<form>` for progressive enhancement.
		 * When set, we do **not** call `preventDefault` — Kit owns submit.
		 */
		remote?: RemoteFormSpread | null;
		/**
		 * When `remote` is set, sync `remote.fields.allIssues()` → `errors`.
		 * @default true
		 */
		syncRemoteIssues?: boolean;
		/** Optional bag for submit/remote result exposed in context */
		result?: unknown;
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
		data = $bindable<FormDataValues>({}),
		errors = $bindable<FormErrors>({}),
		loading = false,
		disabled = false,
		remote = null,
		syncRemoteIssues = true,
		result = $bindable<unknown>(undefined),
		title,
		description,
		showErrorSummary = true,
		errorSummaryTitle = 'Please fix the following',
		gap = 'md',
		class: className = '',
		children,
		header,
		footer,
		onsubmit
	}: FormProps = $props();

	let submitted = $state(false);

	const isRemote = $derived(remote != null);
	const remotePending = $derived(Boolean(remote?.pending));
	const busy = $derived(loading || remotePending || disabled);

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

	function setData(name: string, value: unknown) {
		data = { ...data, [name]: value };
	}

	function getError(name: string) {
		return errors[name];
	}

	function getData<T = unknown>(name: string) {
		return data[name] as T | undefined;
	}

	// Keep context getters live so children always see current state
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
			return result ?? remote?.result;
		},
		setError,
		clearError,
		clearErrors,
		setData,
		getError,
		getData
	} satisfies FormContext);

	// Bridge Kit remote validation issues → Form errors
	$effect(() => {
		if (!isRemote || !syncRemoteIssues) return;
		const allIssues = remote?.fields?.allIssues;
		if (typeof allIssues !== 'function') return;
		errors = remoteIssuesToErrors(allIssues());
	});

	// Mirror remote result into bindable result when present
	$effect(() => {
		if (!isRemote) return;
		if (remote?.result !== undefined) result = remote.result;
	});

	function handleSubmit(e: SubmitEvent) {
		if (isRemote) {
			// Kit remote attachment owns the submit lifecycle
			submitted = true;
			return;
		}
		e.preventDefault();
		submitted = true;
		onsubmit?.(e);
	}
</script>

<form
	{...(remote as Record<string | symbol, unknown> | null)}
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
		<Alert variant="error" title={errorSummaryTitle} dismissible={false}>
			<ul class="mt-1 list-disc space-y-0.5 pl-4 text-sm">
				{#each errorEntries as [field, message] (field)}
					<li>
						<span class="font-medium capitalize">{field}</span>: {message}
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
