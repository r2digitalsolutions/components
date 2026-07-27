<script lang="ts">
	export type DragHandleSize = 'sm' | 'md' | 'lg';
	export type DragHandleOrientation = 'vertical' | 'horizontal';

	interface DragHandleProps {
		size?: DragHandleSize;
		orientation?: DragHandleOrientation;
		disabled?: boolean;
		label?: string;
		class?: string;
	}

	const {
		size = 'md',
		orientation = 'vertical',
		disabled = false,
		label = 'Drag to reorder',
		class: className = ''
	}: DragHandleProps = $props();

	const sizes: Record<DragHandleSize, string> = {
		sm: 'h-6 w-6',
		md: 'h-8 w-8',
		lg: 'h-10 w-10'
	};

	const isVertical = $derived(orientation === 'vertical');
</script>

<span
	role="button"
	tabindex={disabled ? -1 : 0}
	aria-label={label}
	aria-disabled={disabled}
	class={[
		'inline-flex shrink-0 touch-none items-center justify-center rounded-md text-muted transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
		disabled
			? 'cursor-not-allowed opacity-40'
			: 'cursor-grab active:cursor-grabbing hover:bg-surface-overlay hover:text-secondary',
		sizes[size],
		className
	]}
>
	<svg
		class={['shrink-0', isVertical ? 'h-4 w-2.5' : 'h-2.5 w-4']}
		viewBox={isVertical ? '0 0 10 16' : '0 0 16 10'}
		fill="currentColor"
		aria-hidden="true"
	>
		{#if isVertical}
			{#each [0, 1, 2] as row (row)}
				{#each [0, 1] as col (col)}
					<circle cx={2 + col * 6} cy={2 + row * 6} r="1.25" />
				{/each}
			{/each}
		{:else}
			{#each [0, 1, 2] as col (col)}
				{#each [0, 1] as row (row)}
					<circle cx={2 + col * 6} cy={2 + row * 6} r="1.25" />
				{/each}
			{/each}
		{/if}
	</svg>
</span>
