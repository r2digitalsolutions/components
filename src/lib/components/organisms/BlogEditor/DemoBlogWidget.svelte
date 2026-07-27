<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	interface Props {
		variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
		label?: string;
	}

	let { variant = 'primary', label = 'Registered component' }: Props = $props();
</script>

<Badge {variant}>{label}</Badge>
