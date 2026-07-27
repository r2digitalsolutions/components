<script lang="ts">
	import type { Snippet } from 'svelte';
	import SnapIndicator from '$lib/components/atoms/SnapIndicator/SnapIndicator.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	export interface SegmentedPagerPage {
		id: string;
		label: string;
		content?: Snippet;
	}

	interface SegmentedPagerProps {
		pages?: SegmentedPagerPage[];
		count?: number;
		active?: number;
		class?: string;
		children?: Snippet;
		onchange?: (index: number) => void;
	}

	let {
		pages = [],
		count,
		active = $bindable(0),
		class: className = '',
		children,
		onchange
	}: SegmentedPagerProps = $props();

	const pageCount = $derived(count ?? pages.length);
	const labels = $derived(pages.map((p) => p.label));
	const canPrev = $derived(active > 0);
	const canNext = $derived(active < pageCount - 1);

	function goTo(index: number) {
		if (index < 0 || index >= pageCount) return;
		active = index;
		onchange?.(index);
	}

	function prev() {
		goTo(active - 1);
	}

	function next() {
		goTo(active + 1);
	}
</script>

<div class={['w-full space-y-4', className]}>
	<div class="flex items-center justify-between gap-3">
		<Button size="xs" variant="ghost" disabled={!canPrev} onclick={prev} aria-label="Previous page">
			<ChevronLeft class="h-4 w-4" strokeWidth={2} />
		</Button>

		<div class="flex min-w-0 flex-1 flex-col items-center gap-2">
			{#if labels.length}
				<p class="truncate text-sm font-medium text-primary">{labels[active] ?? ''}</p>
			{/if}
			<SnapIndicator count={pageCount} {active} onselect={goTo} />
		</div>

		<Button size="xs" variant="ghost" disabled={!canNext} onclick={next} aria-label="Next page">
			<ChevronRight class="h-4 w-4" strokeWidth={2} />
		</Button>
	</div>

	<div class="rounded-xl border border-border bg-surface-elevated p-4">
		{#if pages[active]?.content}
			{@render pages[active].content!()}
		{:else if children}
			{@render children()}
		{:else}
			<p class="text-center text-sm text-muted">Page {active + 1} of {pageCount}</p>
		{/if}
	</div>
</div>
