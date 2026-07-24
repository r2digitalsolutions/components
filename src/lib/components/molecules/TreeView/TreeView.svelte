<script lang="ts">
	export interface TreeNode {
		id: string;
		label: string;
		children?: TreeNode[];
		disabled?: boolean;
		icon?: string;
	}

	interface TreeViewProps {
		items?: TreeNode[];
		expanded?: string[];
		selected?: string;
		multiExpand?: boolean;
		class?: string;
		onselect?: (id: string, node: TreeNode) => void;
	}

	let {
		items = [],
		expanded = $bindable([]),
		selected = $bindable(''),
		multiExpand = true,
		class: className = '',
		onselect
	}: TreeViewProps = $props();

	function isExpanded(id: string) {
		return expanded.includes(id);
	}

	function toggle(id: string) {
		if (isExpanded(id)) {
			expanded = expanded.filter((e) => e !== id);
		} else {
			if (multiExpand) {
				expanded = [...expanded, id];
			} else {
				expanded = [id];
			}
		}
	}

	function select(node: TreeNode) {
		if (node.disabled) return;
		selected = node.id;
		onselect?.(node.id, node);
	}

	function handleKeydown(e: KeyboardEvent, node: TreeNode, hasChildren: boolean) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (hasChildren) toggle(node.id);
			else select(node);
		} else if (e.key === 'ArrowRight' && hasChildren && !isExpanded(node.id)) {
			e.preventDefault();
			toggle(node.id);
		} else if (e.key === 'ArrowLeft' && hasChildren && isExpanded(node.id)) {
			e.preventDefault();
			toggle(node.id);
		}
	}
</script>

{#snippet renderTree(nodes: TreeNode[], depth: number)}
	<ul role="group" class={depth === 0 ? 'space-y-0.5' : 'ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2'}>
		{#each nodes as node (node.id)}
			{@const hasChildren = Boolean(node.children?.length)}
			{@const open = isExpanded(node.id)}
			{@const isSelected = selected === node.id}
			<li role="treeitem" aria-expanded={hasChildren ? open : undefined} aria-selected={isSelected} aria-disabled={node.disabled || undefined}>
				<button
					type="button"
					disabled={node.disabled}
					onclick={() => hasChildren ? toggle(node.id) : select(node)}
					onkeydown={(e) => handleKeydown(e, node, hasChildren)}
					class={[
						'group flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-left transition-colors duration-100 outline-none',
						'focus-visible:ring-2 focus-visible:ring-brand-500/30',
						node.disabled && 'cursor-not-allowed opacity-40',
						!node.disabled && isSelected && 'bg-brand-500 text-white font-medium',
						!node.disabled && !isSelected && 'text-primary hover:bg-surface-overlay',
					]}
				>
					<!-- Chevron -->
					{#if hasChildren}
						<svg
							class={[
								'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
								open ? 'rotate-90' : '',
								isSelected ? 'text-white' : 'text-muted'
							]}
							viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					{:else}
						<span class="h-3.5 w-3.5 shrink-0"></span>
					{/if}

					<!-- Icon -->
					{#if node.icon}
						<span class="text-base leading-none" aria-hidden="true">{node.icon}</span>
					{:else if hasChildren}
						<svg class={['h-4 w-4 shrink-0', isSelected ? 'text-white/80' : 'text-muted']} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
							{#if open}
								<path stroke-linecap="round" stroke-linejoin="round" d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
							{:else}
								<path stroke-linecap="round" stroke-linejoin="round" d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
							{/if}
						</svg>
					{:else}
						<svg class={['h-4 w-4 shrink-0', isSelected ? 'text-white/80' : 'text-muted']} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					{/if}

					<span class="min-w-0 flex-1 truncate">{node.label}</span>
				</button>

				{#if hasChildren && open}
					{@render renderTree(node.children!, depth + 1)}
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

<div role="tree" class={['text-sm', className]}>
	{@render renderTree(items, 0)}
</div>
