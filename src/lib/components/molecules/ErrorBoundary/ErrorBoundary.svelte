<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Bug from '@lucide/svelte/icons/bug';

	interface ErrorBoundaryProps {
		title?: string;
		description?: string;
		retryLabel?: string;
		/** Show technical error message / stack */
		showDetails?: boolean;
		/** compact = inline alert · panel = centered empty-state card */
		variant?: 'compact' | 'panel';
		class?: string;
		children?: Snippet;
		fallback?: Snippet<[{ error: Error; reset: () => void }]>;
		onerror?: (error: unknown) => void;
		onreset?: () => void;
	}

	let {
		title = 'Something went wrong',
		description = 'This section failed to render. You can try again or reload the page.',
		retryLabel = 'Try again',
		showDetails = true,
		variant = 'panel',
		class: className = '',
		children,
		fallback,
		onerror,
		onreset
	}: ErrorBoundaryProps = $props();

	let detailsOpen = $state(false);

	function toError(e: unknown): Error {
		return e instanceof Error ? e : new Error(String(e));
	}

	function handleBoundaryError(e: unknown) {
		onerror?.(e);
	}
</script>

{#snippet defaultFallback(error: Error, reset: () => void)}
	{#if variant === 'compact'}
		<div
			class={[
				'flex w-full items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/90 p-3.5 dark:border-red-900/50 dark:bg-red-950/35',
				className
			]}
			role="alert"
		>
			<span
				class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300"
			>
				<TriangleAlert class="h-4 w-4" strokeWidth={2} />
			</span>
			<div class="min-w-0 flex-1">
				<p class="text-sm font-semibold text-red-950 dark:text-red-50">{title}</p>
				<p class="mt-0.5 text-xs leading-relaxed text-red-900/75 dark:text-red-100/70">
					{description}
				</p>
				{#if showDetails && error.message}
					<p
						class="mt-2 truncate rounded-lg bg-red-100/80 px-2 py-1 font-mono text-[10px] text-red-800 dark:bg-red-950/50 dark:text-red-200"
						title={error.message}
					>
						{error.message}
					</p>
				{/if}
				<div class="mt-3">
					<Button
						size="sm"
						variant="secondary"
						onclick={() => {
							detailsOpen = false;
							onreset?.();
							reset();
						}}
					>
						{retryLabel}
					</Button>
				</div>
			</div>
		</div>
	{:else}
		<div
			class={[
				'flex w-full flex-col items-center rounded-2xl border border-border bg-surface-elevated px-6 py-10 text-center shadow-sm',
				className
			]}
			role="alert"
		>
			<span
				class="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-200/80 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900/50"
			>
				<TriangleAlert class="h-7 w-7" strokeWidth={1.75} />
			</span>

			<p class="mt-4 text-base font-semibold tracking-tight text-primary">{title}</p>
			<p class="mt-1.5 max-w-sm text-sm leading-relaxed text-secondary">{description}</p>

			<div class="mt-5 flex flex-wrap items-center justify-center gap-2">
				<Button
					size="sm"
					onclick={() => {
						detailsOpen = false;
						onreset?.();
						reset();
					}}
				>
					<span class="inline-flex items-center gap-1.5">
						<RefreshCw class="h-3.5 w-3.5" strokeWidth={2} />
						{retryLabel}
					</span>
				</Button>
			</div>

			{#if showDetails}
				<div class="mt-5 w-full max-w-md text-left">
					<button
						type="button"
						class="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-left text-xs font-medium text-secondary transition hover:bg-surface-overlay hover:text-primary"
						aria-expanded={detailsOpen}
						onclick={() => (detailsOpen = !detailsOpen)}
					>
						<span class="inline-flex items-center gap-1.5">
							<Bug class="h-3.5 w-3.5" strokeWidth={2} />
							Error details
						</span>
						<ChevronDown
							class={['h-3.5 w-3.5 transition-transform', detailsOpen && 'rotate-180']}
							strokeWidth={2}
						/>
					</button>

					{#if detailsOpen}
						<pre
							class="mt-2 max-h-40 overflow-auto rounded-xl border border-border bg-zinc-950 p-3 font-mono text-[10px] leading-relaxed text-zinc-200 dark:bg-black/60"
						>{error.message}{#if error.stack}

{error.stack}{/if}</pre>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
{/snippet}

<svelte:boundary onerror={handleBoundaryError}>
	{#if children}{@render children()}{/if}

	{#snippet failed(err, resetBoundary)}
		{@const error = toError(err)}
		{@const reset = () => resetBoundary()}
		{#if fallback}
			{@render fallback({ error, reset })}
		{:else}
			{@render defaultFallback(error, reset)}
		{/if}
	{/snippet}
</svelte:boundary>
