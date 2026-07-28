<script lang="ts">
	export type TrimHandleSide = 'start' | 'end';

	interface TrimHandleProps {
		side?: TrimHandleSide;
		disabled?: boolean;
		class?: string;
		ondragstart?: (e: PointerEvent) => void;
		ondrag?: (e: PointerEvent) => void;
		ondragend?: (e: PointerEvent) => void;
	}

	let {
		side = 'start',
		disabled = false,
		class: className = '',
		ondragstart,
		ondrag,
		ondragend
	}: TrimHandleProps = $props();

	function onPointerDown(e: PointerEvent) {
		if (disabled) return;
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		ondragstart?.(e);
	}

	function onPointerMove(e: PointerEvent) {
		if (disabled) return;
		if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
		ondrag?.(e);
	}

	function onPointerUp(e: PointerEvent) {
		if (disabled) return;
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		ondragend?.(e);
	}
</script>

<button
	type="button"
	aria-label={side === 'start' ? 'Trim start' : 'Trim end'}
	disabled={disabled}
	class={[
		'absolute top-0 z-10 h-full w-2 touch-none border-0 bg-transparent p-0',
		'cursor-ew-resize hover:bg-white/30',
		side === 'start' ? 'left-0' : 'right-0',
		disabled && 'pointer-events-none opacity-40',
		className
	]}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
>
	<span
		class="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-white/90"
		style:left={side === 'start' ? '3px' : 'auto'}
		style:right={side === 'end' ? '3px' : 'auto'}
		aria-hidden="true"
	></span>
</button>
