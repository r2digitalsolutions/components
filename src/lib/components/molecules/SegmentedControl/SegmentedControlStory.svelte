<script lang="ts">
	import SegmentedControl, { type SegmentItem } from './SegmentedControl.svelte';

	let props = $props<{
		size?: 'sm' | 'md' | 'lg';
		fullWidth?: boolean;
	}>();

	const items: SegmentItem[] = [
		{ id: 'day', label: 'Day' },
		{ id: 'week', label: 'Week' },
		{ id: 'month', label: 'Month' },
		{ id: 'year', label: 'Year', disabled: true }
	];

	let value = $state('week');
</script>

<div class="w-96 max-w-full">
	<SegmentedControl
		{items}
		bind:value
		size={props.size ?? 'md'}
		fullWidth={props.fullWidth ?? false}
	/>
</div>
