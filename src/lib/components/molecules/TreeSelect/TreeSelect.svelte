<script lang="ts">
	import type { TreeNode } from '../TreeView/TreeView.svelte';

	interface TreeSelectProps {
		items?: TreeNode[];
		value?: string;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		onchange?: (value: string, node: TreeNode) => void;
	}

	let {
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

	function findNode(nodes: TreeNode[], id: string): TreeNode | null {
		for (const node of nodes) {
			if (node.id === id) return node;
			if (node.children) {
				const found = findNode(node.children, id);
				if (found) return found;
			}
		}
		return null;
	}

	const selectedNode = $derived(value ? findNode(items, value) : null);

	function positionPopover() {
		if (!triggerEl) return;
		const rect = triggerEl.getBoundingClientRect();
		const gap = 6;
		const spaceBelow = window.innerHeight - rect.bottom - gap;
		const maxH = 280;
		const openUp = spaceBelow < Math.min(maxH, 160) && rect.top > spaceBelow;
		popoverStyle = [
			`left: ${rect.left}px`,
			`width: ${rect.width}px`,
			`top: ${openUp ? 'auto' : `${rect.bottom + gap}px`}`,
			`bottom: ${openUp ? `${window.innerHeight - rect.top + gap}px` : 'auto'}`,
			`max-height: ${Math.min(maxH, openUp ? rect.top - gap : spaceBelow)}px`
		].join('; ');
	}

	function open() {
		if (disabled) return;
		positionPopover();
		if (popoverEl && !popoverEl.matches(':popover-open')) popoverEl.showPopover();
	}

	function close() {
		if (popoverEl?.matches(':popover-open')) popoverEl.hidePopover();
	}

	function toggle() {
		if (isOpen) close();
		else open();
	}

	function handleToggle(e: ToggleEvent) {
		isOpen = e.newState === 'open';
		if (!isOpen) expanded = [];
	}

	function selectNode(node: TreeNode) {
		if (node.disabled || node.children?.length) return;
		value = node.id;
		onchange?.(node.id, node);
		close();
	}

	function toggleExpand(id: string) {
		if (expanded.includes(id)) {
			expanded = expanded.filter((e) => e !== id);
		} else {
			expanded = [...expanded, id];
		}
	}
</script>

{#snippet treeNodes(nodes: TreeNode[], depth: number)}
	{#each nodes as node (node.id)}
		{@const hasChildren = Boolean(node.children?.length)}
		{@const isExpanded = expanded.includes(node.id)}
		{@const isSelected = value === node.id}
		<div style={`padding-left: ${depth * 16}px`}>
			<button
				type="button"
				disabled={node.disabled}
				onclick={() => hasChildren ? toggleExpand(node.id) : selectNode(node)}
				class={[
					'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-75 outline-none',
					node.disabled && 'cursor-not-allowed opacity-40',
					!node.disabled && isSelected && !hasChildren && 'bg-brand-500 text-white font-medium',
					!node.disabled && (!isSelected || hasChildren) && 'text-primary hover:bg-surface-overlay',
				]}
			>
				{#if hasChildren}
					<svg
						class={['h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-muted', isExpanded ? 'rotate-90' : '']}
						viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				{:else}
					<span class="h-3.5 w-3.5 shrink-0 flex items-center justify-center">
						{#if isSelected}
							<svg class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						{/if}
					</span>
				{/if}
				<span class="min-w-0 flex-1 truncate">{node.label}</span>
			</button>
			{#if hasChildren && isExpanded}
				{@render treeNodes(node.children!, depth + 1)}
			{/if}
		</div>
	{/each}
{/snippet}

<div class={['w-full', className]}>
	{#if label}
		<label class="mb-1.5 block text-sm font-medium text-primary">{label}</label>
	{/if}

	<button
		bind:this={triggerEl}
		type="button"
		{disabled}
		onclick={toggle}
		popovertarget="treeselect-popover"
		class={[
			'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-elevated px-3.5 text-sm text-left transition-colors outline-none',
			isOpen && 'border-brand-500 ring-2 ring-brand-500/20',
			disabled && 'cursor-not-allowed opacity-50'
		]}
		aria-haspopup="tree"
		aria-expanded={isOpen}
	>
		<span class={selectedNode ? 'text-primary font-medium' : 'text-muted'}>
			{selectedNode?.label ?? placeholder}
		</span>
		<svg
			class={['h-4 w-4 text-muted shrink-0 transition-transform duration-200', isOpen && 'rotate-180']}
			viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	<div
		bind:this={popoverEl}
		id="treeselect-popover"
		popover="auto"
		ontoggle={handleToggle}
		style={popoverStyle}
		class="treeselect-popover m-0 overflow-y-auto rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl outline-none"
	>
		{@render treeNodes(items, 0)}
	</div>
</div>

<style>
	.treeselect-popover {
		position: fixed;
	}
	.treeselect-popover:not(:popover-open) {
		display: none;
	}
</style>
