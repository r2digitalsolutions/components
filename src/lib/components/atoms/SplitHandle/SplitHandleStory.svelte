<script lang="ts">
	import SplitHandle from './SplitHandle.svelte';

	let {
		orientation = 'horizontal',
		dragging: draggingProp = false,
		example = 'playground'
	}: {
		orientation?: 'horizontal' | 'vertical';
		dragging?: boolean;
		example?: 'playground' | 'both';
	} = $props();

	let containerEl = $state<HTMLDivElement | null>(null);
	let value = $state(40);
	let verticalValue = $state(45);
	let isDragging = $state(false);
	let activePointerId = $state<number | null>(null);
	let verticalContainerEl = $state<HTMLDivElement | null>(null);
	let isDraggingV = $state(false);
	let activePointerIdV = $state<number | null>(null);

	const isHorizontal = $derived(orientation === 'horizontal');
	const showDragging = $derived(draggingProp || isDragging);

	function makeDrag(
		getEl: () => HTMLDivElement | null,
		horizontal: boolean,
		setValue: (n: number) => void,
		setDragging: (v: boolean) => void,
		getPid: () => number | null,
		setPid: (id: number | null) => void
	) {
		function apply(e: PointerEvent) {
			const el = getEl();
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const pct = horizontal
				? ((e.clientX - rect.left) / rect.width) * 100
				: ((e.clientY - rect.top) / rect.height) * 100;
			setValue(Math.min(80, Math.max(20, pct)));
		}
		return {
			start(e: PointerEvent) {
				if (e.button !== 0 && e.pointerType === 'mouse') return;
				e.preventDefault();
				setDragging(true);
				setPid(e.pointerId);
				(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
				apply(e);
			},
			move(e: PointerEvent) {
				if (getPid() !== e.pointerId) return;
				apply(e);
			},
			stop(e: PointerEvent) {
				if (getPid() !== e.pointerId) return;
				const el = e.currentTarget as HTMLElement;
				if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
				setDragging(false);
				setPid(null);
			}
		};
	}

	const hDrag = makeDrag(
		() => containerEl,
		true,
		(n) => (value = n),
		(v) => (isDragging = v),
		() => activePointerId,
		(id) => (activePointerId = id)
	);

	const vDrag = makeDrag(
		() => verticalContainerEl,
		false,
		(n) => (verticalValue = n),
		(v) => (isDraggingV = v),
		() => activePointerIdV,
		(id) => (activePointerIdV = id)
	);

	function applyPointer(e: PointerEvent) {
		if (!containerEl) return;
		const rect = containerEl.getBoundingClientRect();
		const pct = isHorizontal
			? ((e.clientX - rect.left) / rect.width) * 100
			: ((e.clientY - rect.top) / rect.height) * 100;
		value = Math.min(80, Math.max(20, pct));
	}

	function startDrag(e: PointerEvent) {
		if (e.button !== 0 && e.pointerType === 'mouse') return;
		e.preventDefault();
		isDragging = true;
		activePointerId = e.pointerId;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		applyPointer(e);
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging || e.pointerId !== activePointerId) return;
		applyPointer(e);
	}

	function stopDrag(e: PointerEvent) {
		if (e.pointerId !== activePointerId) return;
		const el = e.currentTarget as HTMLElement;
		if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
		isDragging = false;
		activePointerId = null;
	}
</script>

<div class="w-full max-w-2xl space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Split handle</p>
		<p class="text-xs text-secondary">
			Haz clic en el handle (o Tab) para enfocarlo — el anillo brand lo confirma — y usa ← → /
			↑ ↓. Home/End van a min/max. El hover solo no activa el teclado.
		</p>
	</div>

	{#if example === 'both'}
		<div class="space-y-3">
			<div
				bind:this={containerEl}
				class={[
					'flex h-36 w-full overflow-hidden rounded-xl border border-border bg-surface-elevated',
					isDragging && 'select-none'
				]}
			>
				<div
					class="flex items-center justify-center overflow-hidden bg-brand-50/50 text-xs text-brand-800 dark:bg-brand-950/30 dark:text-brand-200"
					style="width:{value}%;flex:none;"
				>
					{Math.round(value)}%
				</div>
				<SplitHandle
					orientation="horizontal"
					{value}
					min={20}
					max={80}
					dragging={isDragging}
					onpointerdown={hDrag.start}
					onpointermove={hDrag.move}
					onpointerup={hDrag.stop}
					onpointercancel={hDrag.stop}
					onadjust={(d) => (value = Math.min(80, Math.max(20, value + d)))}
				/>
				<div class="flex flex-1 items-center justify-center text-xs text-muted">End</div>
			</div>

			<div
				bind:this={verticalContainerEl}
				class={[
					'flex h-52 w-full flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated',
					isDraggingV && 'select-none'
				]}
			>
				<div
					class="flex items-center justify-center overflow-hidden bg-brand-50/50 text-xs text-brand-800 dark:bg-brand-950/30 dark:text-brand-200"
					style="height:{verticalValue}%;flex:none;"
				>
					{Math.round(verticalValue)}%
				</div>
				<SplitHandle
					orientation="vertical"
					value={verticalValue}
					min={20}
					max={80}
					dragging={isDraggingV}
					onpointerdown={vDrag.start}
					onpointermove={vDrag.move}
					onpointerup={vDrag.stop}
					onpointercancel={vDrag.stop}
					onadjust={(d) => (verticalValue = Math.min(80, Math.max(20, verticalValue + d)))}
				/>
				<div class="flex flex-1 items-center justify-center text-xs text-muted">Bottom</div>
			</div>
		</div>
	{:else}
		<div
			bind:this={containerEl}
			class={[
				'flex h-44 w-full overflow-hidden rounded-xl border border-border bg-surface-elevated',
				isHorizontal ? 'flex-row' : 'flex-col',
				isDragging && 'select-none'
			]}
		>
			<div
				class="flex items-center justify-center overflow-hidden bg-brand-50/40 text-xs font-medium text-brand-800 dark:bg-brand-950/30 dark:text-brand-200"
				style="{isHorizontal ? 'width' : 'height'}:{value}%;flex:none;"
			>
				Start · {Math.round(value)}%
			</div>
			<SplitHandle
				{orientation}
				{value}
				min={20}
				max={80}
				dragging={showDragging}
				onpointerdown={startDrag}
				onpointermove={onPointerMove}
				onpointerup={stopDrag}
				onpointercancel={stopDrag}
				onadjust={(d) => (value = Math.min(80, Math.max(20, value + d)))}
			/>
			<div class="flex flex-1 items-center justify-center text-xs text-muted">
				End · focus handle + arrows
			</div>
		</div>
		<p class="text-[11px] text-muted">
			Estado: {showDragging ? 'dragging' : 'idle'} · orientación {orientation}
		</p>
	{/if}
</div>
