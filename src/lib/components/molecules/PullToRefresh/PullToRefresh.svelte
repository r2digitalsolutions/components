<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from '$lib/components/atoms/Spinner/Spinner.svelte';

	interface PullToRefreshProps {
		refreshing?: boolean;
		threshold?: number;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		onrefresh?: () => void;
	}

	let {
		refreshing = false,
		threshold = 64,
		disabled = false,
		class: className = '',
		children,
		onrefresh
	}: PullToRefreshProps = $props();

	let pull = $state(0);
	let startY = 0;
	let pulling = $state(false);
	let scroller = $state<HTMLDivElement | null>(null);

	const progress = $derived(Math.min(1, pull / threshold));

	function onTouchStart(e: TouchEvent) {
		if (disabled || refreshing || !scroller) return;
		if (scroller.scrollTop > 0) return;
		startY = e.touches[0].clientY;
		pulling = true;
	}

	function onTouchMove(e: TouchEvent) {
		if (!pulling || disabled || refreshing) return;
		const dy = e.touches[0].clientY - startY;
		if (dy > 0) {
			pull = Math.min(threshold * 1.4, dy * 0.55);
			if (pull > 8) e.preventDefault();
		}
	}

	function onTouchEnd() {
		if (!pulling) return;
		pulling = false;
		if (pull >= threshold && !refreshing) onrefresh?.();
		pull = 0;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={['relative overflow-hidden', className]}
	ontouchstart={onTouchStart}
	ontouchmove={onTouchMove}
	ontouchend={onTouchEnd}
	ontouchcancel={onTouchEnd}
>
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-2 transition-opacity"
		style:opacity={refreshing || pull > 8 ? 1 : 0}
		style:transform={`translateY(${refreshing ? 8 : Math.max(0, pull - 24)}px)`}
		aria-hidden="true"
	>
		<div
			class={[
				'flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-elevated shadow-sm',
				progress >= 1 && !refreshing && 'border-brand-500/40 text-brand-600'
			]}
		>
			{#if refreshing}
				<Spinner size="sm" />
			{:else}
				<svg
					class="h-4 w-4 text-secondary transition-transform"
					style:transform={`rotate(${progress * 180}deg)`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7-7-7M12 3v17" />
				</svg>
			{/if}
		</div>
	</div>

	<div
		bind:this={scroller}
		class="max-h-full overflow-y-auto overscroll-contain"
		style:transform={pull > 0 ? `translateY(${pull}px)` : undefined}
		style:transition={pulling ? 'none' : 'transform 160ms ease'}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
