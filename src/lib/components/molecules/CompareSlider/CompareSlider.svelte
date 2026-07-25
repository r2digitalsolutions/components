<script lang="ts">
	import type { Snippet } from 'svelte';

	type Orientation = 'horizontal' | 'vertical';

	interface CompareSliderProps {
		beforeSrc?: string;
		afterSrc?: string;
		beforeAlt?: string;
		afterAlt?: string;
		beforeLabel?: string;
		afterLabel?: string;
		value?: number;
		orientation?: Orientation;
		before?: Snippet;
		after?: Snippet;
		class?: string;
	}

	let {
		beforeSrc,
		afterSrc,
		beforeAlt = 'Before',
		afterAlt = 'After',
		beforeLabel = 'Before',
		afterLabel = 'After',
		value = $bindable(50),
		orientation = 'horizontal',
		before,
		after,
		class: className = ''
	}: CompareSliderProps = $props();

	let rootEl: HTMLDivElement | undefined = $state();
	let dragging = $state(false);

	const isVertical = $derived(orientation === 'vertical');
	const clamped = $derived(Math.min(100, Math.max(0, value)));

	const clipPath = $derived(
		isVertical ? `inset(0 0 ${100 - clamped}% 0)` : `inset(0 ${100 - clamped}% 0 0)`
	);

	function setFromPointer(clientX: number, clientY: number) {
		if (!rootEl) return;
		const rect = rootEl.getBoundingClientRect();
		const next = isVertical
			? ((clientY - rect.top) / rect.height) * 100
			: ((clientX - rect.left) / rect.width) * 100;
		value = Math.min(100, Math.max(0, next));
	}

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		setFromPointer(e.clientX, e.clientY);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		setFromPointer(e.clientX, e.clientY);
	}

	function onPointerUp() {
		dragging = false;
	}

	function onKeydown(e: KeyboardEvent) {
		const step = e.shiftKey ? 10 : 2;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			value = Math.max(0, clamped - step);
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			value = Math.min(100, clamped + step);
		} else if (e.key === 'Home') {
			e.preventDefault();
			value = 0;
		} else if (e.key === 'End') {
			e.preventDefault();
			value = 100;
		}
	}
</script>

{#snippet media(src: string | undefined, alt: string, snippet: Snippet | undefined, tone: 'before' | 'after')}
	{#if snippet}
		{@render snippet()}
	{:else if src}
		<img {src} {alt} class="h-full w-full object-cover select-none" draggable="false" loading="eager" />
	{:else}
		<div
			class={[
				'flex h-full w-full items-center justify-center',
				tone === 'before'
					? 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800'
					: 'bg-gradient-to-br from-sky-500 via-cyan-400 to-teal-500'
			]}
		>
			<span class="text-3xl font-bold tracking-tight text-white/90 sm:text-4xl">
				{tone === 'before' ? beforeLabel : afterLabel}
			</span>
		</div>
	{/if}
{/snippet}

<div
	bind:this={rootEl}
	class={[
		'relative aspect-[16/10] w-full touch-none overflow-hidden rounded-2xl border border-border bg-surface select-none',
		dragging ? 'cursor-grabbing' : 'cursor-ew-resize',
		isVertical && 'cursor-ns-resize',
		className
	]}
	role="slider"
	tabindex="0"
	aria-label="Compare before and after"
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={Math.round(clamped)}
	aria-orientation={orientation}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
	onkeydown={onKeydown}
>
	<!-- After (base layer) -->
	<div class="absolute inset-0">
		{@render media(afterSrc, afterAlt, after, 'after')}
	</div>

	<!-- Before (clipped reveal) -->
	<div class="pointer-events-none absolute inset-0" style:clip-path={clipPath}>
		{@render media(beforeSrc, beforeAlt, before, 'before')}
	</div>

	<!-- Divider -->
	{#if isVertical}
		<div
			class="pointer-events-none absolute inset-x-0 z-10 h-0.5 -translate-y-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
			style:top={`${clamped}%`}
			aria-hidden="true"
		>
			<span
				class="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-surface-elevated text-primary shadow-lg"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v4m0 8v4M8 9l4-4 4 4m-8 6l4 4 4-4" />
				</svg>
			</span>
		</div>
	{:else}
		<div
			class="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
			style:left={`${clamped}%`}
			aria-hidden="true"
		>
			<span
				class="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-surface-elevated text-primary shadow-lg"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8 12H4m16 0h-4M9 8l-4 4 4 4m6-8l4 4-4 4"
					/>
				</svg>
			</span>
		</div>
	{/if}

	{#if beforeLabel}
		<span
			class="pointer-events-none absolute left-3 top-3 z-20 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm"
		>
			{beforeLabel}
		</span>
	{/if}
	{#if afterLabel}
		<span
			class="pointer-events-none absolute right-3 top-3 z-20 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm"
		>
			{afterLabel}
		</span>
	{/if}

	<span
		class="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm"
	>
		{Math.round(clamped)}%
	</span>
</div>
