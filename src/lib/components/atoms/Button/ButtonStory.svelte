<script lang="ts">
	import Button from './Button.svelte';

	let props = $props<{
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		loading?: boolean;
		disabled?: boolean;
		fullWidth?: boolean;
		href?: string;
		label?: string;
	}>();
</script>

<div class="w-80 max-w-full flex justify-center">
	<Button
		variant={props.variant ?? 'primary'}
		size={props.size ?? 'md'}
		loading={props.loading ?? false}
		disabled={props.disabled ?? false}
		fullWidth={props.fullWidth ?? false}
		href={props.href}
	>
		{props.label ?? 'Button'}
	</Button>
</div>
