<script lang="ts">
	export type TrendDirection = 'up' | 'down' | 'flat';
	export type TrendArrowSize = 'sm' | 'md' | 'lg';

	interface TrendArrowProps {
		direction?: TrendDirection;
		size?: TrendArrowSize;
		label?: string;
		class?: string;
	}

	const {
		direction = 'flat',
		size = 'md',
		label,
		class: className = ''
	}: TrendArrowProps = $props();

	const sizes: Record<TrendArrowSize, string> = {
		sm: 'h-3 w-3',
		md: 'h-4 w-4',
		lg: 'h-5 w-5'
	};

	const tones: Record<TrendDirection, string> = {
		up: 'text-green-600 dark:text-green-400',
		down: 'text-red-600 dark:text-red-400',
		flat: 'text-muted'
	};

	const defaultLabels: Record<TrendDirection, string> = {
		up: 'Trending up',
		down: 'Trending down',
		flat: 'No change'
	};

	const resolvedLabel = $derived(label ?? defaultLabels[direction]);
</script>

<span
	class={['inline-flex items-center gap-0.5', tones[direction], className]}
	role="img"
	aria-label={resolvedLabel}
>
	{#if direction === 'up'}
		<svg class={sizes[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
		</svg>
	{:else if direction === 'down'}
		<svg class={sizes[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	{:else}
		<svg class={sizes[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
		</svg>
	{/if}
</span>
