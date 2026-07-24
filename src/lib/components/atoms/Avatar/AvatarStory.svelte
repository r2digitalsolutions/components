<script lang="ts">
	import Avatar from './Avatar.svelte';

	let props = $props<{
		src?: string;
		alt?: string;
		name?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		status?: 'online' | 'offline' | 'busy' | 'away' | null;
	}>();
</script>

<Avatar
	src={props.src}
	alt={props.alt}
	name={props.name ?? 'Rafael González'}
	size={props.size ?? 'md'}
	status={props.status ?? null}
/>
