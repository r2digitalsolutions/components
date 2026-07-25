<script lang="ts">
	import Stories from './Stories.svelte';
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-3">
	<Stories
		items={[
			{ id: '1', name: 'Your story', seen: true },
			{ id: '2', name: 'Elena', live: true },
			{ id: '3', name: 'Kai' },
			{ id: '4', name: 'Nora' },
			{ id: '5', name: 'Omar', seen: true },
			{ id: '6', name: 'Ivy' }
		]}
	/>
</div>
