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

{#snippet tree(node: OrgNode)}
	<div class="flex flex-col items-center">
		<div class="shrink-0" style:width="{CARD_W}px">
			{@render nodeCard(node)}
		</div>
		{#if node.children?.length}
			<div class="h-6 w-0.5 shrink-0 bg-border-strong" aria-hidden="true"></div>
			{#if node.children.length === 1}
				{@render tree(node.children[0])}
			{:else}
				<div
					class="relative inline-flex items-start justify-center gap-4"
					style:--siblings={node.children.length}
				>
					<div
						class="pointer-events-none absolute top-0 h-0.5 bg-border-strong"
						style:left="calc(50% / var(--siblings))"
						style:right="calc(50% / var(--siblings))"
						aria-hidden="true"
					></div>
					{#each node.children as child (child.id)}
						<div class="flex shrink-0 flex-col items-center" style:min-width="{CARD_W}px">
							<div class="h-4 w-0.5 shrink-0 bg-border-strong" aria-hidden="true"></div>
							{@render tree(child)}
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
{/snippet}

<div class={['overflow-x-auto py-4', className]} role="tree" aria-label="Organization chart">
	{#if root}
		<div class="flex min-w-max justify-center px-4 pb-2">
			{@render tree(root)}
		</div>
	{:else}
		<p class="py-8 text-center text-sm text-muted">No organization data</p>
	{/if}
</div>
