<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';

	export interface StoryItem {
		id: string;
		name: string;
		avatar?: string;
		seen?: boolean;
		live?: boolean;
	}

	interface StoriesProps {
		items?: StoryItem[];
		class?: string;
		onselect?: (id: string) => void;
	}

	let {
		items = [],
		class: className = '',
		onselect
	}: StoriesProps = $props();
</script>

<div
	class={[
		'flex gap-3 overflow-x-auto px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
		className
	]}
>
	{#each items as item (item.id)}
		<button
			type="button"
			class="flex w-16 shrink-0 flex-col items-center gap-1.5"
			onclick={() => onselect?.(item.id)}
		>
			<span
				class={[
					'rounded-full p-[2px]',
					item.seen
						? 'bg-border'
						: item.live
							? 'bg-gradient-to-tr from-red-500 via-rose-500 to-orange-400'
							: 'bg-gradient-to-tr from-amber-400 via-rose-500 to-violet-500'
				]}
			>
				<span class="block rounded-full bg-surface p-[2px]">
					<Avatar src={item.avatar} name={item.name} size="lg" ringed={false} />
				</span>
			</span>
			<span class="w-full truncate text-center text-[11px] text-secondary">
				{item.live ? 'Live' : item.name}
			</span>
		</button>
	{/each}
</div>
