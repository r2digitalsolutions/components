<script lang="ts">
	import SelectCard from './SelectCard.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import FileText from '@lucide/svelte/icons/file-text';
	import ImageIcon from '@lucide/svelte/icons/image';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	interface Props {
		example?: 'media' | 'row' | 'badge' | 'plans';
	}

	let { example = 'media' }: Props = $props();

	let mediaSelected = $state<string[]>(['m2']);
	let rowSelected = $state<string[]>(['r1']);
	let badgeSelected = $state('b2');
	let plan = $state('pro');

	function toggle(list: string[], id: string) {
		return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
	}

	const mediaItems = [
		{
			id: 'm1',
			title: 'hero-banner.png',
			meta: '840 KB',
			image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'
		},
		{
			id: 'm2',
			title: 'product-shot.jpg',
			meta: '1.2 MB',
			image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'
		},
		{
			id: 'm3',
			title: 'brand-guidelines.pdf',
			meta: '2.4 MB'
		}
	];

	const rowItems = [
		{ id: 'r1', title: 'Onboarding deck', description: 'PDF · Shared with design', meta: '2.4 MB' },
		{ id: 'r2', title: 'Q3 metrics', description: 'XLSX · Finance', meta: '180 KB' },
		{ id: 'r3', title: 'Logo pack', description: 'ZIP · Brand', meta: '4.1 MB', disabled: true }
	];
</script>

<div class="mx-auto w-full max-w-2xl space-y-4 p-4">
	{#if example === 'media'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Media grid</p>
		<ul class="grid grid-cols-3 gap-3">
			{#each mediaItems as item (item.id)}
				<li>
					<SelectCard
						layout="media"
						title={item.title}
						meta={item.meta}
						image={item.image}
						selected={mediaSelected.includes(item.id)}
						onchange={() => (mediaSelected = toggle(mediaSelected, item.id))}
					>
						{#snippet leading()}
							{#if !item.image}
								<FileText class="h-8 w-8 text-muted" aria-hidden="true" />
							{/if}
						{/snippet}
					</SelectCard>
				</li>
			{/each}
		</ul>
	{:else if example === 'row'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">List rows</p>
		<ul class="space-y-2">
			{#each rowItems as item (item.id)}
				<li>
					<SelectCard
						layout="row"
						title={item.title}
						description={item.description}
						meta={item.meta}
						disabled={item.disabled}
						selected={rowSelected.includes(item.id)}
						onchange={() => (rowSelected = toggle(rowSelected, item.id))}
					>
						{#snippet leading()}
							<span
								class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-overlay text-secondary"
							>
								<FileText class="h-5 w-5" aria-hidden="true" />
							</span>
						{/snippet}
					</SelectCard>
				</li>
			{/each}
		</ul>
	{:else if example === 'badge'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Check badge (single)</p>
		<ul class="grid grid-cols-3 gap-3">
			{#each [
				{ id: 'b1', title: 'Photos', icon: ImageIcon },
				{ id: 'b2', title: 'Docs', icon: FileText },
				{ id: 'b3', title: 'AI assets', icon: Sparkles }
			] as item (item.id)}
				{@const Icon = item.icon}
				<li>
					<SelectCard
						layout="media"
						check="badge"
						title={item.title}
						selected={badgeSelected === item.id}
						onchange={() => (badgeSelected = item.id)}
					>
						{#snippet leading()}
							<Icon class="h-8 w-8 text-brand-600 dark:text-brand-400" aria-hidden="true" />
						{/snippet}
					</SelectCard>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Plan picker</p>
		<ul class="space-y-2">
			{#each [
				{ id: 'free', title: 'Free', description: 'For trying things out', meta: '$0' },
				{ id: 'pro', title: 'Pro', description: 'For growing teams', meta: '$29' },
				{ id: 'biz', title: 'Business', description: 'SSO, audit logs, SLA', meta: '$99' }
			] as item (item.id)}
				<li>
					<SelectCard
						layout="row"
						check="badge"
						title={item.title}
						description={item.description}
						selected={plan === item.id}
						onchange={() => (plan = item.id)}
					>
						{#snippet trailing()}
							<Badge size="sm" variant={plan === item.id ? 'primary' : 'secondary'} rounded>
								{item.meta}/mo
							</Badge>
						{/snippet}
					</SelectCard>
				</li>
			{/each}
		</ul>
	{/if}
</div>
