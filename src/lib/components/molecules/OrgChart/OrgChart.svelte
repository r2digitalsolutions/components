<script lang="ts">
	export interface OrgNode {
		id: string;
		name: string;
		role?: string;
		avatarUrl?: string;
		assignees?: { id: string; name: string; avatarUrl?: string | null }[];
		children?: OrgNode[];
	}

	interface OrgChartProps {
		root?: OrgNode | null;
		class?: string;
		onselect?: (node: OrgNode) => void;
	}

	let { root = null, class: className = '', onselect }: OrgChartProps = $props();

	let selected = $state<string | null>(null);

	const CARD_W = 176;

	function initials(name: string) {
		return name
			.split(/\s+/)
			.slice(0, 2)
			.map((p) => p[0]?.toUpperCase() ?? '')
			.join('');
	}

	function primaryAvatar(node: OrgNode) {
		return node.avatarUrl ?? node.assignees?.[0]?.avatarUrl ?? null;
	}

	function primaryLabel(node: OrgNode) {
		if (node.assignees?.length === 1) return node.assignees[0].name;
		return null;
	}
</script>

{#snippet nodeCard(node: OrgNode)}
	<button
		type="button"
		class={[
			'flex w-full flex-col items-center gap-1.5 rounded-xl border bg-surface-elevated px-3 py-2.5 text-center shadow-sm transition-all',
			selected === node.id
				? 'border-brand-500 ring-2 ring-brand-500/30'
				: 'border-border hover:border-brand-400'
		]}
		onclick={() => {
			selected = node.id;
			onselect?.(node);
		}}
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
{/snippet}

{#snippet childForest(node: OrgNode)}
	{#if node.children?.length}
		{#if node.children.length === 1}
			<div class="flex flex-col items-center">
				<div class="h-6 w-px shrink-0 bg-border" aria-hidden="true"></div>
				{@render branch(node.children[0])}
			</div>
		{:else}
			<div class="flex flex-col items-center">
				<div class="h-6 w-px shrink-0 bg-border" aria-hidden="true"></div>
				<div
					class="relative inline-flex items-start justify-center gap-4 pt-4"
					style:--siblings={node.children.length}
				>
					<div
						class="pointer-events-none absolute top-0 h-px bg-border"
						style:left="calc(50% / var(--siblings))"
						style:right="calc(50% / var(--siblings))"
						aria-hidden="true"
					></div>
					{#each node.children as child (child.id)}
						<div class="flex shrink-0 flex-col items-center" style:width="{CARD_W}px">
							<div class="h-4 w-px shrink-0 bg-border" aria-hidden="true"></div>
							<div class="w-full">
								{@render nodeCard(child)}
							</div>
						</div>
					{/each}
				</div>
				<div class="inline-flex items-start justify-center gap-4">
					{#each node.children as child (child.id)}
						<div
							class="flex flex-col items-center pt-2"
							style:min-width="{CARD_W}px"
						>
							{#if child.children?.length}
								{@render childForest(child)}
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
{/snippet}

{#snippet branch(node: OrgNode)}
	<div class="flex flex-col items-center">
		<div class="w-full" style:width="{CARD_W}px">
			{@render nodeCard(node)}
		</div>
		{@render childForest(node)}
	</div>
{/snippet}

<div class={['overflow-x-auto py-4', className]} role="tree" aria-label="Organization chart">
	{#if root}
		<div class="flex justify-center px-4 pb-2">
			{@render branch(root)}
		</div>
	{:else}
		<p class="py-8 text-center text-sm text-muted">No organization data</p>
	{/if}
</div>
