<script lang="ts">
	import Toolbar from './Toolbar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
</script>

<div class="w-full max-w-2xl space-y-4">
	<Toolbar>
		{#snippet start()}
			<Button size="sm" variant="ghost">File</Button>
			<Button size="sm" variant="ghost">Edit</Button>
		{/snippet}
		{#snippet center()}
			<span class="text-sm font-medium text-primary">Untitled document</span>
		{/snippet}
		{#snippet end()}
			<IconButton label="Bold" size="sm" variant="ghost">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
					<path d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z" />
				</svg>
			</IconButton>
			<Button size="sm">Share</Button>
		{/snippet}
	</Toolbar>
</div>
