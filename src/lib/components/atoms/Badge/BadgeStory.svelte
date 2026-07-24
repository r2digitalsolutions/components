<script lang="ts">
	import Badge from './Badge.svelte';

	let props = $props<{
		variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
		size?: 'sm' | 'md' | 'lg';
		rounded?: boolean;
		dot?: boolean;
		label?: string;
	}>();
</script>

<Badge
	variant={props.variant ?? 'primary'}
	size={props.size ?? 'md'}
	rounded={props.rounded ?? false}
	dot={props.dot ?? false}
>
	{props.label ?? 'Badge'}
</Badge>
