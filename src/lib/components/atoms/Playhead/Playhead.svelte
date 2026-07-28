<script lang="ts">
	interface PlayheadProps {
		/** Position in px from left of timeline content */
		x?: number;
		height?: number | string;
		/**
		 * `full` — head + needle (spans ruler+tracks)
		 * `head` — caret on the ruler only
		 * `line` — needle through tracks only
		 */
		variant?: 'full' | 'head' | 'line';
		/** Height of the head area that sits on the ruler (px) */
		headSize?: number;
		dragging?: boolean;
		class?: string;
		ondragstart?: (e: PointerEvent) => void;
		ondrag?: (e: PointerEvent) => void;
		ondragend?: (e: PointerEvent) => void;
	}

	let {
		x = 0,
		height = '100%',
		variant = 'full',
		headSize = 28,
		dragging = false,
		class: className = '',
		ondragstart,
		ondrag,
		ondragend
	}: PlayheadProps = $props();

	const showHead = $derived(variant === 'full' || variant === 'head');
	const showLine = $derived(variant === 'full' || variant === 'line');

	function onPointerDown(e: PointerEvent) {
		e.preventDefault();
		e.stopPropagation();
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
		'absolute top-0 z-40 -translate-x-1/2 touch-none select-none',
		variant === 'line' ? 'w-3' : 'w-4',
		dragging ? 'cursor-grabbing' : 'cursor-ew-resize',
		className
	]}
	style:left={`${x}px`}
	style:height={typeof height === 'number' ? `${height}px` : height}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
>
	{#if showHead}
		<div
			class="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 flex-col items-center justify-center"
			style:height={`${headSize}px`}
		>
			<svg
				viewBox="0 0 14 18"
				class="h-[16px] w-[12px] drop-shadow-sm"
				aria-hidden="true"
			>
				<path
					d="M1 1.5h12v8.2L7 16.5 1 9.7V1.5z"
					fill="#ef4444"
					stroke="#b91c1c"
					stroke-width="1"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	{/if}
	{#if showLine}
		<div
			class="absolute left-1/2 w-0.5 -translate-x-1/2 bg-red-500"
			style:top={variant === 'full' ? `${headSize - 2}px` : '0'}
			style:bottom="0"
		></div>
	{/if}
</div>
