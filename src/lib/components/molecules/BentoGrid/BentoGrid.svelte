<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface BentoItem {
		id: string;
		colSpan?: number;
		rowSpan?: number;
		class?: string;
	}

	export type BentoGridCols = 2 | 3 | 4 | 6 | 12;
	export type BentoGridGap = 'sm' | 'md' | 'lg';

	interface BentoGridProps {
		items?: BentoItem[];
		cols?: BentoGridCols;
		gap?: BentoGridGap;
		class?: string;
		render?: Snippet<[BentoItem]>;
		children?: Snippet;
	}

	const {
		items = [],
		cols = 4,
		gap = 'md',
		class: className = '',
		render,
		children
	}: BentoGridProps = $props();

	const colClasses: Record<BentoGridCols, string> = {
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
		6: 'grid-cols-6',
		12: 'grid-cols-12'
	};

	const gapClasses: Record<BentoGridGap, string> = {
		sm: 'gap-2',
		md: 'gap-4',
		lg: 'gap-6'
	};

	function clampSpan(value: number | undefined, fallback: number): number {
		const span = value ?? fallback;
		return Math.min(12, Math.max(1, span));
	}
</script>

<div class={['grid auto-rows-fr', colClasses[cols], gapClasses[gap], className]}>
	{#if items.length > 0}
		{#each items as item (item.id)}
			<div
				class={[
					'min-h-0 min-w-0 overflow-hidden rounded-xl border border-border bg-surface-elevated',
					item.class
				]}
				style={[
					`grid-column: span ${clampSpan(item.colSpan, 1)}`,
					`grid-row: span ${clampSpan(item.rowSpan, 1)}`
				].join('; ')}
			>
				{#if render}
					{@render render(item)}
				{/if}
			</div>
		{/each}
	{:else if children}
		<div class="col-span-full row-span-full min-h-0 min-w-0 overflow-hidden">
			{@render children()}
		</div>
	{/if}
</div>
