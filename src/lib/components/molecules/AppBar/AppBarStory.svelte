<script lang="ts">
	import AppBar from './AppBar.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
</script>

<div class="mx-auto max-w-sm overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
	<AppBar title="Inbox" subtitle="12 unread" showMenu sticky={false}>
		{#snippet trailing()}
			<IconButton label="Search" size="sm">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
				</svg>
			</IconButton>
		{/snippet}
	</AppBar>
	<div class="space-y-2 p-4">
		{#each ['Design review', 'Shipment update', 'Weekly digest'] as row}
			<div class="rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-sm text-primary">
				{row}
			</div>
		{/each}
	</div>
</div>
