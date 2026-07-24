<script lang="ts">
	import type { Snippet } from 'svelte';

	type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

	interface TooltipProps {
		content: string;
		side?: TooltipSide;
		delay?: number;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		content,
		side = 'top',
		delay = 150,
		disabled = false,
		class: className = '',
		children
	}: TooltipProps = $props();

	let open = $state(false);
	let triggerEl = $state<HTMLSpanElement | null>(null);
	let tipEl = $state<HTMLDivElement | null>(null);
	let tipStyle = $state('');
	let timer: ReturnType<typeof setTimeout> | undefined;

	const tipId = `tooltip-${Math.random().toString(36).slice(2, 9)}`;

	function position() {
		if (!triggerEl || !tipEl) return;
		const rect = triggerEl.getBoundingClientRect();
		const tip = tipEl.getBoundingClientRect();
		const gap = 8;
		let top = 0;
		let left = 0;

		if (side === 'top') {
			top = rect.top - tip.height - gap;
			left = rect.left + rect.width / 2 - tip.width / 2;
		} else if (side === 'bottom') {
			top = rect.bottom + gap;
			left = rect.left + rect.width / 2 - tip.width / 2;
		} else if (side === 'left') {
			top = rect.top + rect.height / 2 - tip.height / 2;
			left = rect.left - tip.width - gap;
		} else {
			top = rect.top + rect.height / 2 - tip.height / 2;
			left = rect.right + gap;
		}

		tipStyle = `top:${Math.max(8, top)}px;left:${Math.max(8, left)}px`;
	}

	function show() {
		if (disabled) return;
		clearTimeout(timer);
		timer = setTimeout(() => {
			open = true;
			queueMicrotask(() => {
				tipEl?.showPopover();
				position();
			});
		}, delay);
	}

	function hide() {
		clearTimeout(timer);
		open = false;
		tipEl?.hidePopover();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	bind:this={triggerEl}
	class={['inline-flex', className]}
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
	aria-describedby={open ? tipId : undefined}
>
	{@render children?.()}
</span>

<div
	bind:this={tipEl}
	id={tipId}
	popover="manual"
	role="tooltip"
	style={tipStyle}
	class="tooltip-root m-0 max-w-xs rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
>
	{content}
</div>

<style>
	.tooltip-root {
		position: fixed;
		inset: unset;
	}

	.tooltip-root:not(:popover-open) {
		display: none;
	}
</style>
