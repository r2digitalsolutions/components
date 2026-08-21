<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import IconBox from '$lib/components/atoms/IconBox/IconBox.svelte';

	export interface TreePanelNode {
		id: string;
		label: string;
		/** Emoji or short glyph shown instead of the default folder / branch icon. */
		icon?: string | null;
		/** Extra column value (sort order, count, …). */
		meta?: string | number | null;
		children?: TreePanelNode[];
	}

	interface TreePanelProps {
		items?: TreePanelNode[];
		collapsedIds?: string[];
		emptyMessage?: string;
		hierarchyLabel?: string;
		metaLabel?: string;
		actionsLabel?: string;
		showMeta?: boolean;
		addChildLabel?: string;
		editLabel?: string;
		deleteLabel?: string;
		expandLabel?: string;
		collapseLabel?: string;
		onAddChild?: (node: TreePanelNode) => void;
		onEdit?: (node: TreePanelNode) => void;
		onDelete?: (node: TreePanelNode) => void;
		/** Extra content after the label (badges, counts). */
		meta?: Snippet<[TreePanelNode, number]>;
		/** Replaces the default add / edit / delete buttons. */
		trailing?: Snippet<[TreePanelNode, number]>;
		leading?: Snippet<[TreePanelNode, number]>;
		empty?: Snippet;
		class?: string;
	}

	let {
		items = [],
		collapsedIds = $bindable([]),
		emptyMessage = '',
		hierarchyLabel = 'Hierarchy',
		metaLabel = 'Order',
		actionsLabel = 'Actions',
		showMeta = false,
		addChildLabel = 'Add child',
		editLabel = 'Edit',
		deleteLabel = 'Delete',
		expandLabel = 'Expand',
		collapseLabel = 'Collapse',
		onAddChild,
		onEdit,
		onDelete,
		meta,
		trailing,
		leading,
		empty,
		class: className = ''
	}: TreePanelProps = $props();

	const collapsed = $derived(new Set(collapsedIds));
	const showActions = $derived(!!trailing || !!onAddChild || !!onEdit || !!onDelete);

	function toggleCollapse(id: string) {
		collapsedIds = collapsed.has(id)
			? collapsedIds.filter((item) => item !== id)
			: [...collapsedIds, id];
	}
</script>

<Card variant="default" padding="none" class={`rounded-3xl ${className}`.trim()}>
	{#snippet header()}
		<div
			class="px-6 py-4 text-xs font-semibold tracking-wider text-secondary flex items-center uppercase"
		>
			<div class="min-w-0 flex-1">{hierarchyLabel}</div>
			{#if showMeta}
				<div class="mr-2 w-14 text-center">{metaLabel}</div>
			{/if}
			{#if showActions}
				<div class="w-28 text-right">{actionsLabel}</div>
			{/if}
		</div>
	{/snippet}

	<div class="p-2">
		{#if items.length === 0}
			{#if empty}
				{@render empty()}
			{:else}
				<p class="px-4 py-8 text-sm text-secondary text-center">{emptyMessage}</p>
			{/if}
		{/if}

		{#snippet treeItem(node: TreePanelNode, level: number)}
			{@const children = node.children ?? []}
			{@const hasChildren = children.length > 0}
			{@const isCollapsed = collapsed.has(node.id)}
			<div
				class="group rounded-xl p-2 hover:bg-surface-overlay flex items-center transition-colors"
			>
				<div class="min-w-0 flex flex-1 items-center" style:padding-left={`${level * 1.5}rem`}>
					{#if hasChildren}
						<IconButton
							size="xs"
							variant="ghost"
							label={isCollapsed ? expandLabel : collapseLabel}
							class={!isCollapsed ? 'mr-1 [&_svg]:rotate-90' : 'mr-1'}
							onclick={() => toggleCollapse(node.id)}
						>
							<svg
								class="transition-transform"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="m9 18 6-6-6-6" />
							</svg>
						</IconButton>
					{:else}
						<span class="mr-1 h-7 w-7 flex shrink-0 items-center justify-center" aria-hidden="true">
							<span class="h-1 w-1 bg-border-strong rounded-full"></span>
						</span>
					{/if}

					{#if leading}
						{@render leading(node, level)}
					{:else if node.icon}
						<span class="mr-2 text-lg shrink-0" aria-hidden="true">{node.icon}</span>
					{:else if level === 0}
						<IconBox tone="brand" size="sm" rounded="lg" class="mr-2">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
								/>
								<path d="M2 10h20" />
							</svg>
						</IconBox>
					{:else}
						<svg
							class="mr-2 h-4 w-4 text-secondary shrink-0"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<polyline points="15 10 20 15 15 20" />
							<path d="M4 4v7a4 4 0 0 0 4 4h12" />
						</svg>
					{/if}

					<span
						class={[
							'font-medium truncate',
							level === 0 ? 'text-base font-semibold text-primary' : 'text-sm text-secondary'
						]}
					>
						{node.label}
					</span>
					{#if meta}
						<div class="ml-2 shrink-0">
							{@render meta(node, level)}
						</div>
					{/if}
				</div>

				{#if showMeta}
					<span class="mr-2 w-14 font-mono text-xs text-secondary text-center">
						{node.meta ?? ''}
					</span>
				{/if}

				{#if showActions}
					<div
						class="w-28 gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-end opacity-100 transition-opacity"
					>
						{#if trailing}
							{@render trailing(node, level)}
						{:else}
							{#if onAddChild}
								<IconButton
									size="xs"
									variant="ghost"
									label={addChildLabel}
									class="text-secondary hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
									onclick={() => onAddChild(node)}
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M5 12h14" />
										<path d="M12 5v14" />
									</svg>
								</IconButton>
							{/if}
							{#if onEdit}
								<IconButton
									size="xs"
									variant="ghost"
									label={editLabel}
									class="text-secondary hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
									onclick={() => onEdit(node)}
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
										<path d="m15 5 4 4" />
									</svg>
								</IconButton>
							{/if}
							{#if onDelete}
								<IconButton
									size="xs"
									variant="ghost"
									label={deleteLabel}
									class="text-secondary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
									onclick={() => onDelete(node)}
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M3 6h18" />
										<path d="M8 6V4h8v2" />
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
									</svg>
								</IconButton>
							{/if}
						{/if}
					</div>
				{/if}
			</div>
			{#if hasChildren && !isCollapsed}
				{#each children as child (child.id)}
					{@render treeItem(child, level + 1)}
				{/each}
			{/if}
		{/snippet}

		<div class="space-y-0.5">
			{#each items as node (node.id)}
				{@render treeItem(node, 0)}
			{/each}
		</div>
	</div>
</Card>
