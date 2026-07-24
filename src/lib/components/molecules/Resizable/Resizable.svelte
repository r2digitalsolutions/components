<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ResizableProps {
		orientation?: 'horizontal' | 'vertical';
		defaultSize?: number;
		minSize?: number;
		maxSize?: number;
		start?: Snippet;
		end?: Snippet;
		class?: string;
	}

	let {
		orientation = 'horizontal',
		defaultSize = 50,
		minSize = 20,
		maxSize = 80,
		start,
		end,
		class: className = ''
	}: ResizableProps = $props();

	let size = $state(defaultSize);
	let containerEl = $state<HTMLDivElement | null>(null);
	let isDragging = $state(false);

	const isHorizontal = $derived(orientation === 'horizontal');

	function startDrag(e: PointerEvent) {
		e.preventDefault();
		isDragging = true;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging || !containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		let pct: number;
		if (isHorizontal) {
			pct = ((e.clientX - rect.left) / rect.width) * 100;
		} else {
			pct = ((e.clientY - rect.top) / rect.height) * 100;
		}
		size = Math.min(maxSize, Math.max(minSize, pct));
	}

	function stopDrag() {
		isDragging = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={containerEl}
	class={[
		'flex overflow-hidden',
		isHorizontal ? 'flex-row' : 'flex-col',
		isDragging && (isHorizontal ? 'cursor-col-resize' : 'cursor-row-resize'),
		className
	]}
	onpointermove={onPointerMove}
	onpointerup={stopDrag}
	onpointercancel={stopDrag}
>
	<!-- Start pane -->
	<div
		class="min-w-0 min-h-0 overflow-hidden"
		style="{isHorizontal ? 'width' : 'height'}:{size}%;flex:none;"
	>
		{#if start}
			{@render start()}
		{/if}
	</div>

	<!-- Drag handle -->
	<div
		role="separator"
		aria-orientation={orientation}
		aria-valuenow={size}
		aria-valuemin={minSize}
		aria-valuemax={maxSize}
		tabindex={0}
		class={[
			'group relative flex shrink-0 items-center justify-center bg-border transition-colors',
			'hover:bg-brand-500/30 focus-visible:outline-none focus-visible:bg-brand-500/40',
			isHorizontal ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize',
			isDragging && 'bg-brand-500/40'
		]}
		onpointerdown={startDrag}
		onkeydown={(e) => {
			const step = 5;
			if (e.key === (isHorizontal ? 'ArrowLeft' : 'ArrowUp')) {
				e.preventDefault();
				size = Math.max(minSize, size - step);
			} else if (e.key === (isHorizontal ? 'ArrowRight' : 'ArrowDown')) {
				e.preventDefault();
				size = Math.min(maxSize, size + step);
			}
		}}
	>
		<!-- Visual handle grip -->
		<div
			class={[
				'absolute flex items-center justify-center rounded-full bg-surface-elevated border border-border shadow-sm z-10',
				'group-hover:border-brand-500/50 group-hover:bg-surface-overlay transition-colors',
				isHorizontal ? 'h-8 w-3 flex-col gap-0.5' : 'w-8 h-3 flex-row gap-0.5',
				isDragging && 'border-brand-500/70 bg-surface-overlay'
			]}
		>
			{#each [0, 1, 2] as _}
				<span
					class={[
						'rounded-full bg-border-strong',
						isHorizontal ? 'h-0.5 w-1.5' : 'w-0.5 h-1.5'
					]}
				></span>
			{/each}
		</div>
	</div>

	<!-- End pane -->
	<div class="min-w-0 min-h-0 overflow-hidden flex-1">
		{#if end}
			{@render end()}
		{/if}
	</div>
</div>
