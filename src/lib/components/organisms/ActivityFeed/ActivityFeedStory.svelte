<script lang="ts">
	import ActivityFeed, { type ActivityItem } from './ActivityFeed.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		size?: 'sm' | 'md';
		showConnectors?: boolean;
		loading?: boolean;
		example?: 'default' | 'empty' | 'links' | 'scroll';
	}>();

	const baseItems: ActivityItem[] = [
		{
			id: '1',
			actor: 'Alex Rivera',
			avatar: 'https://i.pravatar.cc/64?u=alex',
			action: 'published',
			target: 'Footer',
			href: '#footer',
			date: Date.now() - 1000 * 60 * 5,
			meta: 'organisms',
			type: 'success',
			tags: ['release']
		},
		{
			id: '2',
			actor: 'Sam Chen',
			avatar: 'https://i.pravatar.cc/64?u=sam',
			action: 'commented on',
			target: 'Wizard',
			href: '#wizard',
			date: Date.now() - 1000 * 60 * 40,
			type: 'info',
			tags: ['review']
		},
		{
			id: '3',
			actor: 'Jordan Lee',
			avatar: 'https://i.pravatar.cc/64?u=jordan',
			action: 'merged',
			target: 'PR #482',
			href: '#pr-482',
			date: Date.now() - 1000 * 60 * 120,
			meta: 'feature/catalog',
			type: 'success'
		},
		{
			id: '4',
			actor: 'Casey Ng',
			action: 'flagged',
			target: 'Tour positioning',
			date: Date.now() - 1000 * 60 * 60 * 5,
			meta: 'Needs viewport clamp',
			type: 'warning',
			tags: ['bug']
		},
		{
			id: '5',
			actor: 'Riley Fox',
			avatar: 'https://i.pravatar.cc/64?u=riley',
			action: 'removed',
			target: 'legacy ThemeToggle',
			date: Date.now() - 1000 * 60 * 60 * 26,
			type: 'error',
			tags: ['cleanup']
		},
		{
			id: '6',
			actor: 'Morgan Blake',
			avatar: 'https://i.pravatar.cc/64?u=morgan',
			action: 'updated',
			target: 'design tokens',
			date: Date.now() - 1000 * 60 * 60 * 48,
			meta: 'brand-500 contrast'
		}
	];

	const scrollItems: ActivityItem[] = Array.from({ length: 12 }, (_, i) => ({
		...baseItems[i % baseItems.length],
		id: `scroll-${i}`,
		date: Date.now() - 1000 * 60 * (i + 1) * 18
	}));

	const example = $derived(props.example ?? 'default');
	const items = $derived(
		example === 'empty' ? [] : example === 'scroll' ? scrollItems : baseItems
	);

	let lastClick = $state('');
</script>

<div class="w-[26rem] max-w-full space-y-3 p-2">
	<ActivityFeed
		{items}
		size={props.size ?? 'md'}
		showConnectors={props.showConnectors ?? true}
		loading={props.loading ?? false}
		maxHeight={example === 'scroll' ? '20rem' : undefined}
		onitemclick={
			example === 'links'
				? (item) => (lastClick = `${item.actor} → ${item.target ?? item.action}`)
				: undefined
		}
	>
		{#snippet footer()}
			{#if example === 'default' || example === 'links'}
				<div class="flex justify-center">
					<Button size="sm" variant="ghost">Load more</Button>
				</div>
			{/if}
		{/snippet}
	</ActivityFeed>

	{#if lastClick}
		<p class="text-center text-xs text-muted">Clicked: {lastClick}</p>
	{/if}
</div>
