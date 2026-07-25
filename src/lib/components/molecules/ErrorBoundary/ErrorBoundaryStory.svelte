<script lang="ts">
	import ErrorBoundary from './ErrorBoundary.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let {
		variant = 'panel',
		startBroken = false
	}: {
		variant?: 'panel' | 'compact';
		startBroken?: boolean;
	} = $props();

	let boom = $state(startBroken);
	let key = $state(0);

	function trigger() {
		boom = true;
		key += 1;
	}

	function heal() {
		boom = false;
		key += 1;
	}
</script>

<div class="w-full max-w-lg space-y-4">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Error boundary</p>
		<p class="text-xs text-secondary">
			Captura errores de render con <code class="rounded bg-surface-overlay px-1 text-[10px]"
				>svelte:boundary</code
			>. Fallback panel o compacto.
		</p>
	</div>

	<div class="flex flex-wrap gap-2">
		<Button size="sm" variant="destructive" onclick={trigger}>Trigger error</Button>
		<Button size="sm" variant="secondary" onclick={heal}>Reset demo</Button>
	</div>

	{#key key}
		<ErrorBoundary {variant} onreset={heal}>
			{#if boom}
				{(() => {
					throw new Error('Demo render failure: widget crashed while loading data');
				})()}
			{:else}
				<div
					class="rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm"
				>
					<p class="text-sm font-medium text-primary">Healthy widget</p>
					<p class="mt-1 text-xs leading-relaxed text-secondary">
						Everything is fine. Trigger an error to see the boundary UI.
					</p>
					<div class="mt-4 grid grid-cols-3 gap-2">
						{#each ['A', 'B', 'C'] as cell}
							<div
								class="rounded-xl border border-border bg-surface px-3 py-4 text-center text-xs font-medium text-muted"
							>
								{cell}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</ErrorBoundary>
	{/key}
</div>
