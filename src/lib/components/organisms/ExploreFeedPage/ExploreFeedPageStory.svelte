<script lang="ts">
	import ExploreFeedPage from './ExploreFeedPage.svelte';
	import type { ExploreFeedGroup, ExploreSuggestion } from './ExploreFeedPage.svelte';

	let query = $state('');

	const recent = ['design system tokens', 'onboarding checklist', 'Q3 roadmap'];

	const suggestions: ExploreSuggestion[] = [
		{
			id: 's1',
			title: 'Continue where you left off',
			body: 'You were reviewing the API migration doc yesterday.',
			actionLabel: 'Open doc'
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
					image: 'https://i.pravatar.cc/120?img=5'
				},
				{
					id: 'p2',
					title: 'Growth squad',
					subtitle: '6 members · 3 active projects',
					kind: 'Team'
				},
				{
					id: 'p3',
					title: 'Grace Hopper',
					subtitle: 'Engineering Lead · Core',
					kind: 'Person',
					image: 'https://i.pravatar.cc/120?img=32'
				},
				{
					id: 'p4',
					title: 'Design guild',
					subtitle: '12 members · Weekly sync',
					kind: 'Team'
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
					meta: '72%'
				},
				{
					id: 'pr2',
					title: 'API v3 migration',
					subtitle: 'Planning · 4 open tasks',
					kind: 'Project',
					meta: '18%'
				},
				{
					id: 'pr3',
					title: 'Mobile app launch',
					subtitle: 'Review · 2 blockers',
					kind: 'Project',
					meta: '91%'
				}
			]
		}
	];
</script>

<div class="p-4 sm:p-6">
	<ExploreFeedPage bind:query {recent} {suggestions} {groups} />
</div>
