<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ErrorBoundaryProps {
		class?: string;
		children?: Snippet;
		fallback?: Snippet<[{ error: Error; reset: () => void }]>;
		onerror?: (error: unknown) => void;
	}

	let {
		class: className = '',
		children,
		fallback,
		onerror
	}: ErrorBoundaryProps = $props();

	let error = $state<Error | null>(null);

	function reset() {
		error = null;
	}

	function handleError(e: unknown) {
		error = e instanceof Error ? e : new Error(String(e));
		onerror?.(e);
	}
</script>

{#if error}
	<div class={['rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/40', className]} role="alert">
		{#if fallback}
			{@render fallback({ error, reset })}
		{:else}
			<p class="text-sm font-semibold text-red-800 dark:text-red-200">Something went wrong</p>
			<p class="mt-1 text-xs text-red-700 dark:text-red-300">{error.message}</p>
			<button
				type="button"
				class="mt-3 text-xs font-medium text-red-800 underline dark:text-red-200"
				onclick={reset}
			>
				Try again
			</button>
		{/if}
	</div>
{:else}
	<svelte:boundary onerror={handleError}>
		{#if children}{@render children()}{/if}
		{#snippet failed(err, resetBoundary)}
			{@const e = err instanceof Error ? err : new Error(String(err))}
			<div class={['rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/40', className]} role="alert">
				{#if fallback}
					{@render fallback({ error: e, reset: () => { resetBoundary(); reset(); } })}
				{:else}
					<p class="text-sm font-semibold text-red-800 dark:text-red-200">Something went wrong</p>
					<p class="mt-1 text-xs text-red-700 dark:text-red-300">{e.message}</p>
					<button
						type="button"
						class="mt-3 text-xs font-medium text-red-800 underline dark:text-red-200"
						onclick={() => {
							resetBoundary();
							reset();
						}}
					>
						Try again
					</button>
				{/if}
			</div>
		{/snippet}
	</svelte:boundary>
{/if}
