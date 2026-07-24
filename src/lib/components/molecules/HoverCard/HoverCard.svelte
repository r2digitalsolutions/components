<script lang="ts">
	import type { Snippet } from 'svelte';

	interface HoverCardProps {
		openDelay?: number;
		closeDelay?: number;
		placement?: 'top' | 'bottom' | 'left' | 'right';
		class?: string;
		trigger?: Snippet;
		children?: Snippet;
	}

	let {
		openDelay = 200,
		closeDelay = 150,
		placement = 'bottom',
		class: className = '',
		trigger,
		children
	}: HoverCardProps = $props();

	let open = $state(false);
	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function scheduleOpen() {
		clearTimeout(closeTimer);
		openTimer = setTimeout(() => (open = true), openDelay);
	}

	function scheduleClose() {
		clearTimeout(openTimer);
		closeTimer = setTimeout(() => (open = false), closeDelay);
	}

	const panelPos = {
		top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
		bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
		left: 'right-full top-1/2 mr-2 -translate-y-1/2',
		right: 'left-full top-1/2 ml-2 -translate-y-1/2'
	};
</script>

<div
	class={['relative inline-flex', className]}
	onmouseenter={scheduleOpen}
	onmouseleave={scheduleClose}
	onfocusin={scheduleOpen}
	onfocusout={scheduleClose}
>
	<div class="inline-flex">
		{#if trigger}{@render trigger()}{/if}
	</div>

	{#if open}
		<div
			role="tooltip"
			class={[
				'absolute z-50 w-64 rounded-xl border border-border bg-surface-elevated p-3 shadow-lg',
				panelPos[placement]
			]}
		>
			{#if children}{@render children()}{/if}
		</div>
	{/if}
</div>
