<script lang="ts">
	import ErrorBoundary from './ErrorBoundary.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let boom = $state(false);
</script>

<div class="w-full max-w-md space-y-3">
	<Button size="sm" variant="destructive" onclick={() => (boom = true)}>Trigger error</Button>
	<ErrorBoundary>
		{#if boom}
			{(() => {
				throw new Error('Demo render failure');
			})()}
		{:else}
			<p class="rounded-xl border border-border bg-surface-elevated p-4 text-sm text-secondary">
				Content is healthy. Trigger an error to see the boundary.
			</p>
		{/if}
	</ErrorBoundary>
</div>
