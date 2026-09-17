<script
	lang="ts"
	generics="TData extends FormDataValues = FormDataValues, TInput extends RemoteFormInput | void = RemoteFormInput, TOutput = unknown"
>
	import type { Snippet } from 'svelte';
	import { setContext, untrack } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import type { RemoteFormInput, RemoteQueryUpdate } from '@sveltejs/kit';
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
		/**
		 * When `false`, skip Kit's default `invalidateAll()` after a successful remote form
		 * (via `submit().updates()`). Prefer {@link updates} to refresh specific queries.
		 * @default true
		 */
		invalidateAll?: boolean;
		/**
		 * Single-flight query refreshes. Passing this (even `[]`) opts out of `invalidateAll`.
		 * @see https://svelte.dev/docs/kit/remote-functions#Single-flight-mutations
		 */
		updates?: RemoteQueryUpdate[];
		onSuccess?: (result?: any) => void | Promise<void>;
		onError?: (error: string) => void;
		beforeSubmit?: () => void | Promise<void>;
		/** Bind the underlying `<form>` (e.g. Dialog footer `formRef.requestSubmit()`). */
		formRef?: HTMLFormElement | null;
		id?: string;
		enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
		/** Optional bag for submit/remote result exposed in context */
		result?: TOutput;
		title?: string;
		description?: string;
		/** Show a summary alert listing field errors after submit */
		showErrorSummary?: boolean;
		errorSummaryTitle?: string;
		gap?: 'sm' | 'md' | 'lg';
		class?: ClassValue;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
		/** Client-side submit (ignored when `remote` is set — use `remote.enhance`) */
		onsubmit?: (e: SubmitEvent) => void;
	}

	let {
		data = $bindable<TData>({} as TData),
		errors = $bindable<FormErrors>({}),
		loading = $bindable(false),
		disabled = false,
		remote = null,
		syncRemoteIssues = true,
		invalidateAll = true,
		updates,
		onSuccess,
		onError,
		beforeSubmit,
		formRef = $bindable<HTMLFormElement | null>(null),
		id,
		enctype,
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

	/** Client-side ceiling so a hung remote cannot leave Save spinning forever. */
	const SUBMIT_TIMEOUT_MS = 90_000;

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

	$effect(() => {
		const form = kitForm;
		if (!form || didInitRemoteFormId) return;
		didInitRemoteFormId = true;
		remoteFormId = untrack(() => getRemoteFormId(form.action));
	});

	function syncRemoteIssuesNow() {
		if (!kitForm || !syncRemoteIssues) return;
		const next = remoteIssuesToErrors(kitForm.fields.allIssues());
		errors = next;
		if (Object.keys(next).length > 0) submitted = true;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitted = true;
		onsubmit?.(e);
	}

	let formEl = $state<HTMLFormElement | null>(null);

	$effect(() => {
		formRef = formEl;
	});

	$effect(() => {
		const el = formEl;
		if (!el || !isRemote) return;
		const onSubmit = () => {
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
		};
		el.addEventListener('submit', onSubmit);
		return () => el.removeEventListener('submit', onSubmit);
	});

	function isKitRedirect(err: unknown): boolean {
		return Boolean(err && typeof err === 'object' && 'location' in err && 'status' in err);
	}

	function formatValidationIssues(): string {
		if (!kitForm) return '';
		const issues = kitForm.fields.allIssues?.();
		if (!issues?.length) return '';
		return issues
			.map((issue) => {
				const path = issue.path?.length ? issue.path.join('.') : 'formulario';
				return `${path}: ${issue.message}`;
			})
			.join(' · ');
	}

	function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error(message)), ms);
			promise.then(
				(value) => {
					clearTimeout(timer);
					resolve(value);
				},
				(err) => {
					clearTimeout(timer);
					reject(err);
				}
			);
		});
	}

	/** Kit: `submit().updates(...)` (even empty) prevents the default invalidateAll waterfall. */
	function runSubmit(
		submit: () => Promise<boolean> & {
			updates: (...args: RemoteQueryUpdate[]) => Promise<boolean>;
		}
	) {
		if (updates) return submit().updates(...updates);
		if (!invalidateAll) return submit().updates();
		return submit();
	}

	function reportError(message: string) {
		submitted = true;
		setError('_form', message);
		onError?.(message);
	}

	async function handleRemoteEnhance(submit: () => Promise<boolean> & {
		updates: (...args: RemoteQueryUpdate[]) => Promise<boolean>;
	}) {
		if (!kitForm) return;
		try {
			loading = true;
			clearErrors();
			await beforeSubmit?.();
			const ok = await withTimeout(
				runSubmit(submit),
				SUBMIT_TIMEOUT_MS,
				'La operación ha tardado demasiado. Comprueba la conexión e inténtalo de nuevo.'
			);
			const results = kitForm.result;
			result = results as TOutput | undefined;
			if (!ok) {
				syncRemoteIssuesNow();
				const issueSummary = formatValidationIssues();
				const message = issueSummary || 'Revisa los errores del formulario.';
				submitted = true;
				// Field issues already land in `errors`; only use `_form` when none were mapped.
				if (!issueSummary) setError('_form', message);
				onError?.(message);
			} else if (results && typeof results === 'object' && 'error' in results && results.error) {
				const err = results.error;
				const message =
					typeof err === 'string'
						? err
						: err instanceof Error
							? err.message
							: typeof err === 'object' && err !== null && 'message' in err
								? String((err as { message?: unknown }).message)
								: 'Ha ocurrido un error al guardar.';
				reportError(message);
			} else {
				// Clear busy UI before onSuccess — invalidateAll/refresh must not leave Save spinning.
				loading = false;
				try {
					await onSuccess?.(results);
				} catch (successErr) {
					console.error('[Form] onSuccess failed', successErr);
				}
			}
		} catch (e) {
			if (isKitRedirect(e)) throw e;
			const raw = e instanceof Error ? e.message : '';
			let message: string;
			if (/413|Payload Too Large|BODY_SIZE_LIMIT|exceeds limit|Content-length/i.test(raw)) {
				message = 'El archivo es demasiado grande. Prueba con una imagen de menos de 8 MB.';
			} else if (/502|504|Bad Gateway|Gateway Timeout|Failed to fetch|NetworkError/i.test(raw)) {
				message =
					'No se pudo completar la subida (error de red o servidor). Prueba de nuevo en unos segundos.';
			} else if (!raw || /unexpected error/i.test(raw)) {
				message = 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
			} else {
				message = raw;
			}
			reportError(message);
		} finally {
			loading = false;
		}
	}

	/**
	 * Full Kit `RemoteForm` → own `.enhance` (invalidateAll / updates / callbacks).
	 * Already-enhanced spread → caller owns enhance; pass through unchanged.
	 */
	function remoteFormAttrs(): object {
		if (!remote) return {};
		if (!kitForm) return remote as object;
		return kitForm.enhance(async ({ submit }) => {
			await handleRemoteEnhance(submit);
		}) as object;
	}
</script>

{#snippet fields()}
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
{/snippet}

{#if isRemote}
	<form
		bind:this={formEl}
		{...remoteFormAttrs()}
		{id}
		{enctype}
		class={['w-full', gaps[gap], className]}
		novalidate
		aria-busy={busy || undefined}
	>
		{@render fields()}
	</form>
{:else}
	<form
		bind:this={formEl}
		{id}
		{enctype}
		class={['w-full', gaps[gap], className]}
		onsubmit={handleSubmit}
		novalidate
		aria-busy={busy || undefined}
	>
		{@render fields()}
	</form>
{/if}
