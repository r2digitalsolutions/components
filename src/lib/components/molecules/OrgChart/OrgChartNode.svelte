<script lang="ts">
	import OrgChartNode from './OrgChartNode.svelte';
	import { getPanZoomContext } from '../PanZoomViewport/panZoomContext.js';
	import type { OrgNode } from './OrgChart.svelte';

	interface OrgChartNodeProps {
		node: OrgNode;
		onselect?: (node: OrgNode) => void;
		selectedId?: string | null;
	}

	let { node, onselect, selectedId = $bindable(null) }: OrgChartNodeProps = $props();

	const panZoom = getPanZoomContext();
	const CARD_W = 176;

	let rowEl = $state<HTMLDivElement | null>(null);
	let line = $state<{ left: number; width: number } | null>(null);

	function initials(name: string) {
		return name
			.split(/\s+/)
			.slice(0, 2)
			.map((p) => p[0]?.toUpperCase() ?? '')
			.join('');
	}

	function primaryAvatar(n: OrgNode) {
		return n.avatarUrl ?? n.assignees?.[0]?.avatarUrl ?? null;
	}

	function primaryLabel(n: OrgNode) {
		if (n.assignees?.length === 1) return n.assignees[0].name;
		return null;
	}

	function selectNode(n: OrgNode) {
		if (panZoom?.consumeClick()) return;
		selectedId = n.id;
		onselect?.(n);
	}

	function measureLine() {
		const children = node.children ?? [];
		if (!rowEl || children.length < 2) {
			line = null;
			return;
		}
		const cols = [...rowEl.querySelectorAll<HTMLElement>('[data-org-col]')];
		if (cols.length < 2) {
			line = null;
			return;
		}
		const rowRect = rowEl.getBoundingClientRect();
		const first = cols[0].getBoundingClientRect();
		const last = cols[cols.length - 1].getBoundingClientRect();
		const left = first.left + first.width / 2 - rowRect.left;
		const right = last.left + last.width / 2 - rowRect.left;
		line = { left, width: Math.max(0, right - left) };
	}

	$effect(() => {
		node.children?.length;
		if (!rowEl) return;
		measureLine();
		const ro = new ResizeObserver(() => measureLine());
		ro.observe(rowEl);
		for (const col of rowEl.querySelectorAll('[data-org-col]')) ro.observe(col);
		return () => ro.disconnect();
	});
</script>

<div class="flex flex-col items-center">
	<div class="shrink-0" style:width="{CARD_W}px">
		<button
			type="button"
			class={[
				'flex w-full flex-col items-center gap-1.5 rounded-xl border bg-surface-elevated px-3 py-2.5 text-center shadow-sm transition-all',
				selectedId === node.id
					? 'border-brand-500 ring-2 ring-brand-500/30'
					: 'border-border hover:border-brand-400'
			]}
			onclick={() => selectNode(node)}
		>
			{#if primaryAvatar(node)}
				<img src={primaryAvatar(node)!} alt="" class="h-9 w-9 rounded-full object-cover" />
			{:else}
				<span
					class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-600 dark:text-brand-300"
				>
					{initials(node.name)}
				</span>
			{/if}
			<span class="line-clamp-2 text-sm leading-snug font-semibold text-primary">{node.name}</span>
			{#if primaryLabel(node)}
				<span class="truncate text-xs text-secondary">{primaryLabel(node)}</span>
			{/if}
			{#if node.role}
				<span class="truncate text-[11px] text-muted">{node.role}</span>
			{/if}
			{#if node.assignees && node.assignees.length > 1}
				<span class="text-[10px] text-muted">+{node.assignees.length - 1} más</span>
			{/if}
		</button>
	</div>

	{#if node.children?.length}
		<div class="h-6 w-0.5 shrink-0 bg-border-strong" aria-hidden="true"></div>
		{#if node.children.length === 1}
			<OrgChartNode node={node.children[0]} {onselect} bind:selectedId />
		{:else}
			<div bind:this={rowEl} class="relative inline-flex items-start justify-center gap-4">
				{#if line}
					<div
						class="pointer-events-none absolute top-0 h-0.5 bg-border-strong"
						style:left="{line.left}px"
						style:width="{line.width}px"
						aria-hidden="true"
					></div>
				{/if}
				{#each node.children as child (child.id)}
					<div data-org-col class="flex shrink-0 flex-col items-center" style:min-width="{CARD_W}px">
						<div class="h-4 w-0.5 shrink-0 bg-border-strong" aria-hidden="true"></div>
						<OrgChartNode node={child} {onselect} bind:selectedId />
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
