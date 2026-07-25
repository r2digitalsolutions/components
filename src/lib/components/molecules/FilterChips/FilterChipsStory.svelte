<script lang="ts">
	import FilterChips from './FilterChips.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let value = $state(['open']);
</script>

<div class="space-y-2">
	<FilterChips
		bind:value
		items={[
			{ id: 'open', label: 'Open', count: 12 },
			{ id: 'mine', label: 'Assigned to me', count: 4 },
			{ id: 'urgent', label: 'Urgent', count: 2 },
			{ id: 'done', label: 'Done', count: 48 }
		]}
	/>
	<Text size="xs" tone="muted">Selected: {value.join(', ') || 'none'}</Text>
</div>
