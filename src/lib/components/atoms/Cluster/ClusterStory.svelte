<script lang="ts">
	import Cluster from './Cluster.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';

	let props = $props<{ gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' }>();
</script>

<Cluster gap={props.gap ?? 'sm'} class="w-full max-w-md">
	<Chip>Design</Chip>
	<Chip variant="primary">Svelte</Chip>
	<Chip variant="success">Tailwind</Chip>
	<Chip>Accessibility</Chip>
	<Chip variant="warning">Dark mode</Chip>
</Cluster>
