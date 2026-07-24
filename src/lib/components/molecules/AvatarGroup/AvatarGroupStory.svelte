<script lang="ts">
	import AvatarGroup, { type AvatarGroupItem } from './AvatarGroup.svelte';

	let props = $props<{
		max?: number;
		size?: 'xs' | 'sm' | 'md' | 'lg';
	}>();

	const items: AvatarGroupItem[] = [
		{ id: '1', name: 'Ana Perez' },
		{ id: '2', name: 'Luis Martin' },
		{ id: '3', name: 'Sofia Ruiz' },
		{ id: '4', name: 'Diego Lopez' },
		{ id: '5', name: 'Maria Santos' },
		{ id: '6', name: 'Pablo Vega' }
	];
</script>

<AvatarGroup {items} max={props.max ?? 4} size={props.size ?? 'md'} />
