<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SwipeActionProps {
		/** Threshold in px to reveal actions */
		threshold?: number;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		actions?: Snippet;
		onopen?: () => void;
		onclose?: () => void;
	}

	let {
		threshold = 64,
		disabled = false,
		class: className = '',
		children,
		actions,
		onopen,
		onclose
	}: SwipeActionProps = $props();

	let offset = $state(0);
	let startX = 0;
	let open = $state(false);
	const maxReveal = 96;

	function onPointerDown(e: PointerEvent) {
		if (disabled) return;
		startX = e.clientX;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (disabled || !e.currentTarget) return;
		const dx = startX - e.clientX;
		if (dx > 0) offset = Math.min(maxReveal, dx);
		else if (open) offset = Math.max(0, maxReveal + dx);
	}

	function onPointerUp() {
		if (offset >= threshold) {
			offset = maxReveal;
			if (!open) {
				open = true;
				onopen?.();
			}
		} else {
			offset = 0;
			if (open) {
				open = false;
				onclose?.();
			}
		}
	}

	function close() {
		offset = 0;
		open = false;
		onclose?.();
	}
</script>

<div class={['relative overflow-hidden rounded-lg border border-border bg-surface-elevated', className]}>
	<div
		class="absolute inset-y-0 right-0 flex w-24 items-stretch justify-end bg-red-500/10"
		aria-hidden={!open}
	>
		{#if actions}
			{@render actions()}
		{/if}
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative touch-pan-y bg-surface-elevated transition-transform duration-150"
		style:transform={`translateX(-${offset}px)`}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={close}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
