<script lang="ts">
	export interface OrgNode {
		id: string;
		name: string;
		role?: string;
		avatarUrl?: string;
		children?: OrgNode[];
	}

	interface OrgChartProps {
		root?: OrgNode | null;
		class?: string;
		onselect?: (node: OrgNode) => void;
	}

	let { root = null, class: className = '', onselect }: OrgChartProps = $props();

	let selected = $state<string | null>(null);

	function initials(name: string) {
		return name
			.split(/\s+/)
			.slice(0, 2)
			.map((p) => p[0]?.toUpperCase() ?? '')
			.join('');
	}
</script>

{#snippet nodeCard(node: OrgNode)}
	<button
		type="button"
		class={[
			'flex min-w-[140px] max-w-[180px] flex-col items-center gap-1.5 rounded-xl border bg-surface-elevated px-3 py-2.5 text-center shadow-sm transition-all',
			selected === node.id
				? 'border-brand-500 ring-2 ring-brand-500/30'
				: 'border-border hover:border-brand-400'
		]}
		onclick={() => {
			selected = node.id;
			onselect?.(node);
		}}
	>
		{#if node.avatarUrl}
			<img src={node.avatarUrl} alt="" class="h-9 w-9 rounded-full object-cover" />
		{:else}
			<span
				class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-600 dark:text-brand-300"
			>
				{initials(node.name)}
			</span>
		{/if}
		<span class="truncate text-sm font-medium text-primary">{node.name}</span>
		{#if node.role}
			<span class="truncate text-[11px] text-muted">{node.role}</span>
		{/if}
	</button>
{/snippet}

{#snippet tree(node: OrgNode)}
	<div class="relative flex flex-col items-center">
		{@render nodeCard(node)}

		{#if node.children && node.children.length > 0}
			<div class="h-5 w-px bg-border" aria-hidden="true"></div>
			<div class="relative flex flex-wrap justify-center gap-x-8 gap-y-4">
				{#if node.children.length > 1}
					<div
						class="pointer-events-none absolute left-[12%] right-[12%] top-0 h-px bg-border"
						aria-hidden="true"
					></div>
				{/if}
				{#each node.children as child (child.id)}
					<div class="relative flex flex-col items-center pt-0">
						<div class="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-border" aria-hidden="true"></div>
						<div class="pt-3">
							{@render tree(child)}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<div class={['overflow-x-auto py-2', className]} role="tree" aria-label="Organization chart">
	{#if root}
		<div class="inline-flex min-w-full justify-center px-4">
			{@render tree(root)}
		</div>
	{:else}
		<p class="py-8 text-center text-sm text-muted">No organization data</p>
	{/if}
</div>
