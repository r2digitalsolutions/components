<script lang="ts">
	import type { TreeNode } from '../TreeView/TreeView.svelte';
	import { on } from 'svelte/events';

	interface TreeSelectProps {
		id?: string;
		items?: TreeNode[];
		value?: string;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		onchange?: (value: string, node: TreeNode) => void;
	}

	let {
		id,
		items = [],
		value = $bindable(''),
		label = '',
		placeholder = 'Select...',
		disabled = false,
		class: className = '',
		onchange
	}: TreeSelectProps = $props();

	let isOpen = $state(false);
	let triggerEl = $state<HTMLButtonElement | null>(null);
	let popoverEl = $state<HTMLDivElement | null>(null);
	let expanded = $state<string[]>([]);
	let popoverStyle = $state('');

	const selectId = $derived(id ?? `treeselect-${Math.random().toString(36).slice(2, 9)}`);
	const popoverId = $derived(`${selectId}-popover`);

	function findNode(nodes: TreeNode[], nodeId: string): TreeNode | null {
		for (const node of nodes) {
			if (node.id === nodeId) return node;
			if (node.children) {
				const found = findNode(node.children, nodeId);
				if (found) return found;
			}
		}
		return null;
	}

	function findPath(nodes: TreeNode[], nodeId: string, trail: string[] = []): string[] | null {
		for (const node of nodes) {
			if (node.id === nodeId) return trail;
			if (node.children?.length) {
				const found = findPath(node.children, nodeId, [...trail, node.id]);
				if (found) return found;
			}
		}
		return null;
	}

	const selectedNode = $derived(value ? findNode(items, value) : null);

	function positionPopover() {
		if (!triggerEl || !popoverEl) return;
		if (!popoverEl.matches(':popover-open')) return;

		const rect = triggerEl.getBoundingClientRect();
		const gap = 6;
		const margin = 8;
		const maxH = 280;
		const spaceBelow = window.innerHeight - rect.bottom - gap - margin;
		const spaceAbove = rect.top - gap - margin;
		const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
		const height = Math.min(maxH, Math.max(120, openUp ? spaceAbove : spaceBelow));

		const top = openUp ? undefined : rect.bottom + gap;
		const bottom = openUp ? window.innerHeight - rect.top + gap : undefined;

		popoverStyle = [
			`position:fixed`,
			`left:${Math.max(margin, Math.min(rect.left, window.innerWidth - rect.width - margin))}px`,
			`width:${rect.width}px`,
			top !== undefined ? `top:${top}px` : 'top:auto',
			bottom !== undefined ? `bottom:${bottom}px` : 'bottom:auto',
			`max-height:${height}px`
		].join(';');
	}

	function handleBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open' && disabled) {
			event.preventDefault();
		}
	}

	function handleToggle(event: ToggleEvent) {
		isOpen = event.newState === 'open';
		if (isOpen) {
			const path = value ? findPath(items, value) : null;
			expanded = path ? [...path] : [];
			queueMicrotask(() => {
				positionPopover();
				requestAnimationFrame(() => positionPopover());
			});
		} else {
			expanded = [];
		}
	}

	function selectNode(node: TreeNode) {
		if (node.disabled || node.children?.length) return;
		value = node.id;
		onchange?.(node.id, node);
		popoverEl?.hidePopover();
	}

	function toggleExpand(nodeId: string, event?: MouseEvent) {
		event?.stopPropagation();
		if (expanded.includes(nodeId)) {
			expanded = expanded.filter((e) => e !== nodeId);
		} else {
			expanded = [...expanded, nodeId];
		}
	}

	$effect(() => {
		if (!isOpen) return;

		let frame = 0;
		const reposition = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => positionPopover());
		};

		const offScroll = on(window, 'scroll', reposition, { capture: true, passive: true });
		const offResize = on(window, 'resize', reposition);

		return () => {
			cancelAnimationFrame(frame);
			offScroll();
			offResize();
		};
	});
</script>

{#snippet treeNodes(nodes: TreeNode[], depth: number)}
	{#each nodes as node (node.id)}
		{@const hasChildren = Boolean(node.children?.length)}
		{@const isExpanded = expanded.includes(node.id)}
		{@const isSelected = value === node.id}
		<div style={`padding-left: ${depth * 12}px`}>
			<div
				class={[
					'flex w-full items-center gap-0.5 rounded-lg text-sm transition-colors',
					node.disabled && 'opacity-40',
					!node.disabled && isSelected && !hasChildren && 'bg-brand-500 text-white',
					!node.disabled && (!isSelected || hasChildren) && 'text-primary hover:bg-surface-overlay'
				]}
			>
				{#if hasChildren}
					<button
						type="button"
						tabindex={-1}
						disabled={node.disabled}
						onclick={(e) => toggleExpand(node.id, e)}
						class="flex h-8 w-7 shrink-0 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
						aria-label={isExpanded ? 'Collapse' : 'Expand'}
					>
						<svg
							class={[
								'h-3.5 w-3.5 text-muted transition-transform duration-150',
								isExpanded && 'rotate-90'
							]}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				{:else}
					<span class="flex h-8 w-7 shrink-0 items-center justify-center" aria-hidden="true">
						{#if isSelected}
							<svg
								class="h-3.5 w-3.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						{/if}
					</span>
				{/if}

				<button
					type="button"
					disabled={node.disabled}
					onclick={() => (hasChildren ? toggleExpand(node.id) : selectNode(node))}
					class={[
						'flex min-w-0 flex-1 items-center rounded-md px-1.5 py-1.5 text-left outline-none',
						'focus-visible:ring-2 focus-visible:ring-brand-500/30',
						node.disabled && 'cursor-not-allowed',
						isSelected && !hasChildren && 'font-medium'
					]}
				>
					<span class="truncate">{node.label}</span>
				</button>
			</div>

			{#if hasChildren && isExpanded}
				{@render treeNodes(node.children!, depth + 1)}
			{/if}
		</div>
	{/each}
{/snippet}

<div class={['w-full', className]}>
	{#if label}
		<label for={selectId} class="mb-1.5 block text-sm font-medium text-primary">{label}</label>
	{/if}

	<button
		bind:this={triggerEl}
		id={selectId}
		type="button"
		{disabled}
		popovertarget={popoverId}
		popovertargetaction="toggle"
		class={[
			'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-elevated px-3.5 text-left text-sm outline-none transition-colors',
			'focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20',
			isOpen && 'border-brand-500 ring-2 ring-brand-500/20',
			disabled && 'cursor-not-allowed opacity-50'
		]}
		aria-haspopup="tree"
		aria-expanded={isOpen}
		aria-controls={popoverId}
	>
		<span class={['truncate', selectedNode ? 'font-medium text-primary' : 'text-muted']}>
			{selectedNode?.label ?? placeholder}
		</span>
		<svg
			class={['h-4 w-4 shrink-0 text-muted transition-transform duration-200', isOpen && 'rotate-180']}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	<div
		bind:this={popoverEl}
		id={popoverId}
		popover="auto"
		role="tree"
		onbeforetoggle={handleBeforeToggle}
		ontoggle={handleToggle}
		style={popoverStyle}
		class="treeselect-popover inset-auto m-0 overflow-y-auto rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl outline-none"
	>
		{#if items.length}
			{@render treeNodes(items, 0)}
		{:else}
			<p class="px-3 py-2 text-sm text-muted">No options</p>
		{/if}
	</div>
</div>

<style>
	.treeselect-popover {
		position: fixed;
	}

	.treeselect-popover:popover-open {
		display: block;
	}

	.treeselect-popover:not(:popover-open) {
		display: none;
	}
</style>
