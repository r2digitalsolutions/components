<script lang="ts">
	import ExploreFeedPage from './ExploreFeedPage.svelte';
	import type {
		ExploreFeedGroup,
		ExploreSuggestion,
		ExploreFeaturedItem
	} from './ExploreFeedPage.svelte';
	import type { ChipBarItem } from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface Props {
		example?: 'default' | 'filtered' | 'empty' | 'loading' | 'no-sidebar';
	}

	let { example = 'default' }: Props = $props();

	let query = $state('');
	let activeFilter = $state('all');
	let activeSection = $state(0);
	let recent = $state(['design system tokens', 'onboarding checklist', 'Q3 roadmap']);
	let last = $state('');

	const filters: ChipBarItem[] = [
		{ id: 'all', label: 'All' },
		{ id: 'Person', label: 'People', count: 2 },
		{ id: 'Team', label: 'Teams', count: 2 },
		{ id: 'Project', label: 'Projects', count: 3 },
		{ id: 'Doc', label: 'Docs', count: 1 }
	];

	const trending = ['design tokens', 'billing export', 'mobile checkout', 'API v3'];

	const suggestions: ExploreSuggestion[] = [
		{
			id: 's1',
			title: 'Continue where you left off',
			body: 'You were reviewing the API migration doc yesterday.',
			actionLabel: 'Open doc'
		},
		{
			id: 's2',
			title: 'New in your workspace',
			body: '3 projects updated since your last visit.',
			actionLabel: 'See updates'
		}
	];

	const featured: ExploreFeaturedItem[] = [
		{
			id: 'f1',
			title: 'Checkout redesign',
			description: 'Customer journey overhaul for Q3',
			meta: '72%',
			badge: 'Hot'
		},
		{
			id: 'f2',
			title: 'Design system 2.0',
			description: 'Tokens, themes, and components',
			meta: 'Updated',
			badge: 'Docs'
		},
		{
			id: 'f3',
			title: 'Mobile beta',
			description: 'Invite-only iOS & Android builds',
			meta: 'Aug 1',
			badge: 'Launch'
		}
	];

	const groups: ExploreFeedGroup[] = [
		{
			id: 'activity',
			label: 'Recent activity',
			mode: 'list',
			dateGroups: [
				{
					date: 'Today',
					items: [
						{
							id: 'a1',
							title: 'Design review scheduled',
							subtitle: 'Mobile checkout flow',
							meta: '2h ago'
						},
						{
							id: 'a2',
							title: 'New comment on PR #842',
							subtitle: 'Alan Turing · auth middleware',
							meta: '4h ago'
						},
						{
							id: 'a5',
							title: 'Docs published: Token migration',
							subtitle: 'Design system · Engineering',
							meta: '6h ago'
						}
					]
				},
				{
					date: 'Yesterday',
					items: [
						{
							id: 'a3',
							title: 'Sprint planning notes published',
							subtitle: 'Engineering · Week 30',
							meta: 'Jul 26'
						},
						{
							id: 'a4',
							title: 'Billing export completed',
							subtitle: 'Finance workspace',
							meta: 'Jul 26'
						}
					]
				}
			]
		},
		{
			id: 'people',
			label: 'People & teams',
			mode: 'cards',
			items: [
				{
					id: 'p1',
					title: 'Ada Lovelace',
					subtitle: 'Staff Engineer · Platform',
					kind: 'Person',
					topics: ['Person'],
					image: 'https://i.pravatar.cc/120?img=5'
				},
				{
					id: 'p2',
					title: 'Growth squad',
					subtitle: '6 members · 3 active projects',
					kind: 'Team',
					topics: ['Team']
				},
				{
					id: 'p3',
					title: 'Grace Hopper',
					subtitle: 'Engineering Lead · Core',
					kind: 'Person',
					topics: ['Person'],
					image: 'https://i.pravatar.cc/120?img=32'
				},
				{
					id: 'p4',
					title: 'Design guild',
					subtitle: '12 members · Weekly sync',
					kind: 'Team',
					topics: ['Team']
				}
			]
		},
		{
			id: 'projects',
			label: 'Projects',
			mode: 'cards',
			items: [
				{
					id: 'pr1',
					title: 'Checkout redesign',
					subtitle: 'In progress · Due Aug 15',
					kind: 'Project',
					topics: ['Project'],
					meta: '72%'
				},
				{
					id: 'pr2',
					title: 'API v3 migration',
					subtitle: 'Planning · 4 open tasks',
					kind: 'Project',
					topics: ['Project'],
					meta: '18%'
				},
				{
					id: 'pr3',
					title: 'Mobile app launch',
					subtitle: 'Review · 2 blockers',
					kind: 'Project',
					topics: ['Project'],
					meta: '91%'
				},
				{
					id: 'd1',
					title: 'Onboarding checklist',
					subtitle: 'Playbook · Last edited Jul 20',
					kind: 'Doc',
					topics: ['Doc'],
					meta: '12 pages'
				}
			]
		}
	];

	$effect(() => {
		const ex = example;
		query = '';
		activeFilter = ex === 'filtered' ? 'Project' : 'all';
		activeSection = ex === 'filtered' ? 2 : 0;
		recent =
			ex === 'empty'
				? []
				: ['design system tokens', 'onboarding checklist', 'Q3 roadmap'];
	});
</script>

<div class="space-y-3 p-4 sm:p-6">
	{#if example === 'empty'}
		<ExploreFeedPage
			title="Explore"
			description="Nothing indexed yet — try uploading docs or inviting teammates."
			query=""
			recent={[]}
			trending={[]}
			filters={[]}
			suggestions={[]}
			featured={[]}
			groups={[]}
			emptyTitle="Workspace is quiet"
			emptyDescription="Create a project or publish a doc to start discovering content."
		>
			{#snippet emptyAction()}
				<Button size="sm" variant="secondary" onclick={() => (last = 'create')}>
					Create project
				</Button>
			{/snippet}
		</ExploreFeedPage>
	{:else if example === 'loading'}
		<ExploreFeedPage {groups} {filters} {trending} {recent} loading />
	{:else if example === 'no-sidebar'}
		<ExploreFeedPage
			bind:query
			bind:activeFilter
			bind:activeSection
			{groups}
			{suggestions}
			{featured}
			{filters}
			showRecent={false}
			showTrending={false}
			onselect={(id) => (last = `select:${id}`)}
			onsearch={(q) => (last = `search:${q}`)}
		/>
	{:else}
		<ExploreFeedPage
			bind:query
			bind:activeFilter
			bind:activeSection
			bind:recent
			{trending}
			{filters}
			{suggestions}
			{featured}
			{groups}
			breadcrumbs={[
				{ id: 'home', label: 'Home', href: '#' },
				{ id: 'explore', label: 'Explore' }
			]}
			onselect={(id) => (last = `select:${id}`)}
			onsearch={(q) => (last = `search:${q}`)}
			onfilterchange={(id) => (last = `filter:${id}`)}
			onsectionchange={(i) => (last = `section:${i}`)}
			onsuggestion={(id) => (last = `suggestion:${id}`)}
			onclearrrecent={() => {
				recent = [];
				last = 'clear-recent';
			}}
			onremoverecent={(q) => {
				recent = recent.filter((r) => r !== q);
				last = `remove-recent:${q}`;
			}}
		>
			{#snippet actions()}
				<Button size="sm" variant="ghost" onclick={() => (last = 'saved')}>Saved</Button>
				<Button size="sm" variant="secondary" onclick={() => (last = 'new')}>New</Button>
			{/snippet}
		</ExploreFeedPage>
	{/if}

	{#if last}
		<p class="text-center text-xs text-muted">
			Last action: <span class="font-medium text-primary">{last}</span>
		</p>
	{/if}
</div>
