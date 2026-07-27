<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tile from '$lib/components/molecules/Tile/Tile.svelte';
	import type { TileAccent } from '$lib/components/molecules/Tile/Tile.svelte';

	export type DateGroupedAccent = Extract<TileAccent, 'brand' | 'neutral' | 'none'>;

	export interface DateGroupedListItem {
		id: string;
		title: string;
		subtitle?: string;
		meta?: string;
	}

	export interface DateGroupedListGroup {
		date: string;
		items: DateGroupedListItem[];
	}

	interface DateGroupedListProps {
		groups: DateGroupedListGroup[];
		/** Left edge accent on each row */
		accent?: DateGroupedAccent;
		dense?: boolean;
		class?: string;
		onitemclick?: (id: string) => void;
		/** Optional leading content per item (avatar, icon…) */
		leading?: Snippet<[DateGroupedListItem]>;
	}

	let {
		groups,
		accent = 'brand',
		dense = false,
		class: className = '',
		onitemclick,
		leading: leadingSnippet
	}: DateGroupedListProps = $props();
</script>

<div class={['w-full space-y-5', className]}>
	{#each groups as group (group.date)}
		<section class="space-y-1.5">
			<h3
				class="sticky top-0 z-10 -mx-1 rounded-md bg-surface/95 px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted backdrop-blur-sm"
			>
				{group.date}
			</h3>

			<ul class={['flex flex-col', dense ? 'gap-1' : 'gap-1.5']} role="list">
				{#each group.items as item (item.id)}
					<li>
						{#if leadingSnippet}
							<Tile
								title={item.title}
								subtitle={item.subtitle}
								meta={item.meta}
								{accent}
								{dense}
								onclick={onitemclick ? () => onitemclick(item.id) : undefined}
							>
								{#snippet leading()}
									{@render leadingSnippet(item)}
								{/snippet}
							</Tile>
						{:else}
							<Tile
								title={item.title}
								subtitle={item.subtitle}
								meta={item.meta}
								{accent}
								{dense}
								onclick={onitemclick ? () => onitemclick(item.id) : undefined}
							/>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
