<script lang="ts">
	export type SplitOrientation = 'horizontal' | 'vertical';

	interface SplitHandleProps {
		orientation?: SplitOrientation;
		value?: number;
		min?: number;
		max?: number;
		dragging?: boolean;
		/** Step used for keyboard adjustments (percentage points) */
		step?: number;
		class?: string;
		onpointerdown?: (e: PointerEvent) => void;
		onpointermove?: (e: PointerEvent) => void;
		onpointerup?: (e: PointerEvent) => void;
		onpointercancel?: (e: PointerEvent) => void;
		/** Called with signed delta when arrow keys adjust the split */
		onadjust?: (delta: number) => void;
	}

	const {
		orientation = 'horizontal',
		value = 50,
		min = 0,
		max = 100,
		dragging = false,
		step = 5,
		class: className = '',
		onpointerdown,
		onpointermove,
		onpointerup,
		onpointercancel,
		onadjust
	}: SplitHandleProps = $props();

	const isHorizontal = $derived(orientation === 'horizontal');
	let focused = $state(false);

	function handlePointerDown(e: PointerEvent) {
		// Consumers often call preventDefault() (to avoid text selection), which
		// also blocks the browser's default focus — focus explicitly so arrows work.
		const el = e.currentTarget as HTMLElement;
		el.focus({ preventScroll: true });
		onpointerdown?.(e);
	}

	function onKeydown(e: KeyboardEvent) {
		let delta = 0;
		// Primary axes by orientation, plus the other pair as aliases
		if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			delta = -step;
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			delta = step;
		} else if (e.key === 'Home') {
			delta = min - value;
		} else if (e.key === 'End') {
			delta = max - value;
		} else {
			return;
		}
		e.preventDefault();
		e.stopPropagation();
		onadjust?.(delta);
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	role="separator"
	aria-orientation={orientation}
	aria-valuenow={Math.round(value)}
	aria-valuemin={min}
	aria-valuemax={max}
	aria-label="Resize panes"
	tabindex={0}
	class={[
		'group relative z-20 flex shrink-0 touch-none items-center justify-center select-none',
		"before:absolute before:bg-border before:content-[''] before:transition-colors",
		'hover:before:bg-brand-500/30 focus:outline-none',
		(focused || dragging) && 'before:bg-brand-500/40',
		isHorizontal
			? 'w-3 cursor-col-resize before:inset-y-0 before:left-1/2 before:w-1.5 before:-translate-x-1/2'
			: 'h-3 cursor-row-resize before:inset-x-0 before:top-1/2 before:h-1.5 before:-translate-y-1/2',
		className
	]}
	onpointerdown={handlePointerDown}
	onpointermove={onpointermove}
	onpointerup={onpointerup}
	onpointercancel={onpointercancel}
	onkeydown={onKeydown}
	onfocus={() => (focused = true)}
	onblur={() => (focused = false)}
>
	<div
		class={[
			'pointer-events-none absolute z-10 flex items-center justify-center rounded-full border border-border bg-surface-elevated shadow-sm',
			'transition-colors group-hover:border-brand-500/50 group-hover:bg-surface-overlay',
			isHorizontal ? 'h-8 w-3 flex-col gap-0.5' : 'h-3 w-8 flex-row gap-0.5',
			(focused || dragging) && 'border-brand-500/70 bg-surface-overlay ring-2 ring-brand-500/25'
		]}
		aria-hidden="true"
	>
		{#each [0, 1, 2] as _}
			<span
				class={[
					'rounded-full bg-border-strong',
					isHorizontal ? 'h-0.5 w-1.5' : 'h-1.5 w-0.5'
				]}
			></span>
		{/each}
	</div>
</div>
