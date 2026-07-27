<script lang="ts">
	export type SnapIndicatorSize = 'sm' | 'md' | 'lg';
	export type SnapIndicatorVariant = 'dots' | 'pills' | 'bars';

	interface SnapIndicatorProps {
		count: number;
		active?: number;
		size?: SnapIndicatorSize;
		/** dots = round scale · pills = active elongates · bars = equal segments */
		variant?: SnapIndicatorVariant;
		class?: string;
		onselect?: (index: number) => void;
	}

	const {
		count,
		active = 0,
		size = 'md',
		variant = 'pills',
		class: className = '',
		onselect
	}: SnapIndicatorProps = $props();

	const heights: Record<SnapIndicatorSize, string> = {
		sm: 'h-1.5',
		md: 'h-2',
		lg: 'h-2.5'
	};

	const inactiveWidths: Record<SnapIndicatorSize, string> = {
		sm: 'w-1.5',
		md: 'w-2',
		lg: 'w-2.5'
	};

	const activePillWidths: Record<SnapIndicatorSize, string> = {
		sm: 'w-4',
		md: 'w-5',
		lg: 'w-7'
	};

	const barHeights: Record<SnapIndicatorSize, string> = {
		sm: 'h-1',
		md: 'h-1.5',
		lg: 'h-2'
	};

	const indices = $derived(Array.from({ length: Math.max(0, count) }, (_, i) => i));
	const isBars = $derived(variant === 'bars');
</script>

<div
	class={[
		'inline-flex items-center',
		isBars ? 'w-full max-w-xs gap-1' : 'gap-1.5',
		className
	]}
	role="tablist"
	aria-label="Slide indicators"
>
	{#each indices as index (index)}
		{@const isActive = index === active}
		<button
			type="button"
			role="tab"
			aria-selected={isActive}
			aria-label={`Slide ${index + 1} of ${count}`}
			class={[
				'rounded-full transition-all duration-300 ease-out',
				onselect ? 'cursor-pointer' : 'pointer-events-none',
				isBars && [
					'min-w-0 flex-1',
					barHeights[size],
					isActive ? 'bg-brand-500' : 'bg-border hover:bg-muted/50 dark:bg-border-strong'
				],
				!isBars && heights[size],
				!isBars &&
					isActive &&
					(variant === 'pills'
						? ['bg-brand-500', activePillWidths[size]]
						: ['scale-125 bg-brand-500', inactiveWidths[size]]),
				!isBars &&
					!isActive && [inactiveWidths[size], 'bg-border hover:bg-muted/60 dark:bg-border-strong']
			]}
			onclick={() => onselect?.(index)}
		></button>
	{/each}
</div>
