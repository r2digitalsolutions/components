<script lang="ts">
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import {
		DEFAULT_BLUEPRINT_NODE_TYPES,
		groupNodeTypesByCategory,
		type GraphNodeTypeDef
	} from '$lib/utils/nodeGraph.js';

	interface NodePaletteProps {
		nodeTypes?: GraphNodeTypeDef[];
		query?: string;
		title?: string;
		class?: string;
		onselect?: (type: GraphNodeTypeDef) => void;
	}

	let {
		nodeTypes = DEFAULT_BLUEPRINT_NODE_TYPES,
		query = $bindable(''),
		title = 'Palette',
		class: className = '',
		onselect
	}: NodePaletteProps = $props();

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return nodeTypes;
		return nodeTypes.filter(
			(t) =>
				t.label.toLowerCase().includes(q) ||
				t.type.toLowerCase().includes(q) ||
				t.category?.toLowerCase().includes(q) ||
				t.description?.toLowerCase().includes(q)
		);
	});

	const groups = $derived(groupNodeTypesByCategory(filtered));
</script>

<div class={['flex h-full min-h-0 flex-col', className]} data-node-palette>
	<div class="border-b border-border px-2 py-2">
		{#if title}
			<p class="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</p>
		{/if}
		<SearchInput bind:value={query} placeholder="Search nodes…" size="sm" />
	</div>
	<div class="min-h-0 flex-1 overflow-auto p-1">
		{#each groups as group (group.category)}
			<div class="mb-2">
				<p class="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
					{group.category}
				</p>
				<ul class="flex flex-col gap-0.5">
					{#each group.types as nt (nt.type)}
						<li>
							<button
								type="button"
								class="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-surface-overlay"
								onclick={() => onselect?.(nt)}
								draggable="true"
								ondragstart={(e) => {
									e.dataTransfer?.setData('application/x-node-type', nt.type);
									e.dataTransfer?.setData('text/plain', nt.type);
								}}
							>
								<span
									class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
									style={`background:${nt.color ?? '#64748b'}`}
								></span>
								<span class="min-w-0">
									<span class="block truncate text-sm font-medium text-primary">{nt.label}</span>
									{#if nt.description}
										<span class="block truncate text-[11px] text-muted">{nt.description}</span>
									{/if}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
		{#if !filtered.length}
			<p class="px-3 py-8 text-center text-xs text-muted">No nodes match</p>
		{/if}
	</div>
</div>
