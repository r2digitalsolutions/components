<script lang="ts">
	import Rating from './Rating.svelte';

	let props = $props<{
		value?: number;
		max?: number;
		size?: 'sm' | 'md' | 'lg';
		readonly?: boolean;
	}>();

	let value = $state(props.value ?? 3);
</script>

<Rating
	bind:value
	max={props.max ?? 5}
	size={props.size ?? 'md'}
	readonly={props.readonly ?? false}
/>
