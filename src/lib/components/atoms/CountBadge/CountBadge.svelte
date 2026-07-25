<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	type CountBadgeVariant =
		| 'default'
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'error'
		| 'info';

	interface CountBadgeProps {
		count: number;
		/** Hide when count is 0 (default true) */
		hideZero?: boolean;
		/** Cap display, e.g. 99 → "99+" */
		max?: number;
		variant?: CountBadgeVariant;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	const {
		count,
		hideZero = true,
		max = 99,
		variant = 'error',
		size = 'sm',
		class: className = ''
	}: CountBadgeProps = $props();

	const visible = $derived(!hideZero || count > 0);
	const label = $derived(count > max ? `${max}+` : String(count));
</script>

{#if visible}
	<Badge {variant} {size} rounded class={['tabular-nums', className].filter(Boolean).join(' ')}>
		{label}
	</Badge>
{/if}
