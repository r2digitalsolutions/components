<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tooltip from '$lib/components/atoms/Tooltip/Tooltip.svelte';

	interface TruncateProps {
		lines?: 1 | 2 | 3 | 4;
		/** Full text for tooltip / native title */
		title?: string;
		tooltip?: boolean;
		/** Only show tooltip when content actually overflows */
		tooltipWhenTruncated?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		lines = 1,
		title = '',
		tooltip = true,
		tooltipWhenTruncated = true,
		class: className = '',
		children
	}: TruncateProps = $props();

	let el = $state<HTMLElement | null>(null);
	let truncated = $state(false);

	const clamp: Record<1 | 2 | 3 | 4, string> = {
		1: 'block truncate whitespace-nowrap',
		2: 'line-clamp-2',
		3: 'line-clamp-3',
		4: 'line-clamp-4'
	};

	function measure() {
		if (!el) {
			truncated = false;
			return;
		}
		truncated =
			lines === 1
				? el.scrollWidth > el.clientWidth + 1
				: el.scrollHeight > el.clientHeight + 1;
	}

	$effect(() => {
		lines;
		title;
		queueMicrotask(measure);
		if (typeof ResizeObserver === 'undefined' || !el) return;
		const ro = new ResizeObserver(() => measure());
		ro.observe(el);
		return () => ro.disconnect();
	});

	const tipDisabled = $derived(
		!tooltip ||
			!title ||
			(tooltipWhenTruncated && !truncated)
	);
</script>

<div class={['min-w-0 max-w-full', className]}>
	{#if title && tooltip}
		<Tooltip
			content={title}
			side="top"
			disabled={tipDisabled}
			class="flex w-full min-w-0 max-w-full"
		>
			<span
				bind:this={el}
				class={['w-full min-w-0 overflow-hidden text-sm text-primary', clamp[lines]]}
			>
				{#if children}{@render children()}{/if}
			</span>
		</Tooltip>
	{:else}
		<span
			bind:this={el}
			class={['w-full min-w-0 overflow-hidden text-sm text-primary', clamp[lines]]}
			title={title && truncated ? title : undefined}
		>
			{#if children}{@render children()}{/if}
		</span>
	{/if}
</div>
