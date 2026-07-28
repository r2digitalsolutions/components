<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	interface Props {
		variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
		label?: string;
		size?: 'sm' | 'md';
	}

	let { variant = 'primary', label = 'Registered component', size = 'md' }: Props = $props();
</script>

<Badge {variant} {size}>{label}</Badge>
