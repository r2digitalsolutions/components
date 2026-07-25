<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';

	export type FormErrors = Record<string, string>;

	export interface FormContext {
		errors: FormErrors;
		submitted: boolean;
		loading: boolean;
		setError: (name: string, message: string) => void;
		clearError: (name: string) => void;
		clearErrors: () => void;
	}

	interface FormProps {
		errors?: FormErrors;
		loading?: boolean;
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
		onsubmit?: (e: SubmitEvent) => void;
	}

	let {
		errors = $bindable<FormErrors>({}),
		loading = false,
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

	setContext('r2-form', {
		get errors() {
			return errors;
		},
		get submitted() {
			return submitted;
		},
		get loading() {
			return loading;
		},
		setError,
		clearError,
		clearErrors
	} satisfies FormContext);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitted = true;
		onsubmit?.(e);
	}
</script>

<form
	class={['w-full', gaps[gap], className]}
	onsubmit={handleSubmit}
	novalidate
	aria-busy={loading || undefined}
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
