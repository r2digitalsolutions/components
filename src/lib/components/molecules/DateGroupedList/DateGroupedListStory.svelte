<script lang="ts">
	import DateGroupedList from './DateGroupedList.svelte';
	import type { DateGroupedAccent } from './DateGroupedList.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';

	interface Props {
		accent?: DateGroupedAccent;
		dense?: boolean;
	}

	let { accent = 'brand', dense = false }: Props = $props();
	let last = $state('');

	const groups = [
		{
			date: 'Today',
			items: [
				{ id: '1', title: 'Invoice #1042 paid', subtitle: 'Acme Corp', meta: '$1,200' },
				{ id: '2', title: 'New team member', subtitle: 'Grace Hopper joined Engineering', meta: '2h ago' }
			]
		},
		{
			date: 'Yesterday',
			items: [
				{ id: '3', title: 'Plan upgraded', subtitle: 'Starter → Pro', meta: '$49/mo' },
				{ id: '4', title: 'API key created', subtitle: 'Production environment', meta: '5:42 PM' }
			]
		},
		{
			date: 'Last week',
			items: [{ id: '5', title: 'Refund issued', subtitle: 'Order #8821', meta: '-$24.00' }]
		}
	];
</script>

<div class="mx-auto flex max-w-lg flex-col gap-8 p-4">
	<div>
		<p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">Default</p>
		<DateGroupedList {groups} {accent} {dense} onitemclick={(id) => (last = id)} />
	</div>

	<div>
		<p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">With avatars</p>
		<DateGroupedList {groups} accent="neutral" dense onitemclick={(id) => (last = id)}>
			{#snippet leading(item)}
				<Avatar name={item.title} size="sm" />
			{/snippet}
		</DateGroupedList>
	</div>

	{#if last}
		<p class="text-center text-xs text-muted">Clicked: {last}</p>
	{/if}
</div>
