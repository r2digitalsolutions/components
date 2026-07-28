<script lang="ts">
	interface PlayheadProps {
		/** Position in px from left of timeline content */
		x?: number;
		height?: number | string;
		dragging?: boolean;
		class?: string;
		ondragstart?: (e: PointerEvent) => void;
		ondrag?: (e: PointerEvent) => void;
		ondragend?: (e: PointerEvent) => void;
	}

	let {
		x = 0,
		height = '100%',
		dragging = false,
		class: className = '',
		ondragstart,
		ondrag,
		ondragend
	}: PlayheadProps = $props();

	function onPointerDown(e: PointerEvent) {
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		ondragstart?.(e);
	}

	function onPointerMove(e: PointerEvent) {
		if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
		ondrag?.(e);
	}

	function onPointerUp(e: PointerEvent) {
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		ondragend?.(e);
	}
</script>

<div
	role="slider"
	aria-label="Playhead"
	aria-valuenow={Math.round(x)}
	tabindex="0"
	class={[
		'absolute top-0 z-20 w-0 touch-none select-none',
		dragging ? 'cursor-grabbing' : 'cursor-ew-resize',
		className
	]}
	style:left={`${x}px`}
	style:height={typeof height === 'number' ? `${height}px` : height}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
>
	<div
		class="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-sm bg-red-500 shadow-sm"
	></div>
	<div class="absolute left-1/2 top-2 h-[calc(100%-0.5rem)] w-px -translate-x-1/2 bg-red-500"></div>
</div>
