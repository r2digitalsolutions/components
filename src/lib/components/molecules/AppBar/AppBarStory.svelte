<script lang="ts">
	import AppBar from './AppBar.svelte';
	import type { AppBarVariant } from './AppBar.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import CountBadge from '$lib/components/atoms/CountBadge/CountBadge.svelte';
	import PhoneFrame from '$lib/components/molecules/PhoneFrame/PhoneFrame.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';

	interface Props {
		example?:
			| 'inbox'
			| 'back'
			| 'blur'
			| 'transparent'
			| 'search'
			| 'profile'
			| 'commerce'
			| 'webDashboard'
			| 'webDocs'
			| 'webProject';
		layout?: 'mobile' | 'web';
	}

	let { example = 'inbox', layout }: Props = $props();

	let menuOpen = $state(false);
	let query = $state('');

	const titles: Record<
		NonNullable<Props['example']>,
		{ title: string; subtitle?: string }
	> = {
		inbox: { title: 'Inbox', subtitle: '12 unread' },
		back: { title: 'Thread', subtitle: 'with Ana Ruiz' },
		blur: { title: 'Explore', subtitle: 'Trending near you' },
		transparent: { title: 'Album', subtitle: 'Summer 2026' },
		search: { title: 'Catalog' },
		profile: { title: 'Profile', subtitle: '@rafael' },
		commerce: { title: 'Cart', subtitle: '3 items' },
		webDashboard: { title: 'Analytics', subtitle: 'Last 30 days' },
		webDocs: { title: 'Documentation', subtitle: 'Components · AppBar' },
		webProject: { title: 'Acme redesign', subtitle: 'In progress · due Fri' }
	};

	const variantMap: Record<NonNullable<Props['example']>, AppBarVariant> = {
		inbox: 'solid',
		back: 'solid',
		blur: 'blur',
		transparent: 'transparent',
		search: 'solid',
		profile: 'solid',
		commerce: 'blur',
		webDashboard: 'solid',
		webDocs: 'blur',
		webProject: 'solid'
	};

	const resolvedLayout = $derived(
		layout ??
			(example === 'webDashboard' || example === 'webDocs' || example === 'webProject'
				? 'web'
				: 'mobile')
	);

	const body = $derived(titles[example]);
	const barVariant = $derived(variantMap[example]);
	const useMenu = $derived(
		example === 'inbox' ||
			example === 'blur' ||
			example === 'search' ||
			example === 'webDashboard' ||
			example === 'webDocs'
	);
	const useBack = $derived(
		example === 'back' || example === 'transparent' || example === 'commerce' || example === 'webProject'
	);

	$effect(() => {
		example;
		menuOpen = false;
	});

	const rows = $derived(
		example === 'commerce'
			? ['Ceramic mug', 'Notebook set', 'Desk lamp']
			: example === 'profile'
				? ['Posts', 'Saved', 'Activity']
				: example.startsWith('web')
					? ['Overview', 'Reports', 'Integrations', 'Team activity']
					: ['Design review', 'Shipment update', 'Weekly digest', 'Invoice ready']
	);
</script>

{#snippet searchIcon()}
	<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
	</svg>
{/snippet}

{#snippet bellIcon()}
	<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"
		/>
	</svg>
{/snippet}

{#snippet moreIcon()}
	<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.5h.01M12 12h.01M12 17.5h.01" />
	</svg>
{/snippet}

{#snippet cartIcon()}
	<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 6h14M10 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z"
		/>
	</svg>
{/snippet}

{#snippet trailingActions()}
	{#if example === 'inbox' || example === 'webDashboard'}
		{#if example === 'webDashboard'}
			<div class="mr-1 hidden min-w-[14rem] sm:block">
				<SearchInput bind:value={query} placeholder="Search…" size="sm" />
			</div>
			<Button size="xs" variant="secondary">Export</Button>
			<Button size="xs">New report</Button>
		{:else}
			<IconButton label="Search" size="sm">{@render searchIcon()}</IconButton>
		{/if}
		<div class="relative">
			<IconButton label="Notifications" size="sm">{@render bellIcon()}</IconButton>
			<span class="absolute -right-0.5 -top-0.5">
				<CountBadge count={3} size="sm" />
			</span>
		</div>
		{#if example === 'webDashboard'}
			<Avatar name="Rafael" size="sm" />
		{/if}
	{:else if example === 'back' || example === 'webProject'}
		{#if example === 'webProject'}
			<Badge variant="warning" size="sm" rounded>Review</Badge>
			<Button size="xs" variant="secondary">Share</Button>
			<Button size="xs">Publish</Button>
		{:else}
			<IconButton label="More" size="sm">{@render moreIcon()}</IconButton>
		{/if}
	{:else if example === 'blur' || example === 'webDocs'}
		{#if example === 'webDocs'}
			<Button size="xs" variant="ghost">API</Button>
			<Button size="xs" variant="secondary">Feedback</Button>
		{:else}
			<Badge variant="primary" size="sm" rounded>Live</Badge>
		{/if}
		<IconButton label="Search" size="sm">{@render searchIcon()}</IconButton>
	{:else if example === 'transparent'}
		<IconButton label="Share" size="sm" class="bg-surface-elevated/70 backdrop-blur">
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13"
				/>
			</svg>
		</IconButton>
	{:else if example === 'search'}
		<IconButton label="Filter" size="sm">
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M7 12h10M10 18h4" />
			</svg>
		</IconButton>
	{:else if example === 'profile'}
		<IconButton label="Settings" size="sm">
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
				/>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		</IconButton>
	{:else if example === 'commerce'}
		<div class="relative">
			<IconButton label="Cart" size="sm">{@render cartIcon()}</IconButton>
			<span class="absolute -right-0.5 -top-0.5">
				<CountBadge count={3} size="sm" />
			</span>
		</div>
	{/if}
{/snippet}

{#snippet appBar()}
	{#if example === 'profile'}
		<AppBar
			title={body.title}
			subtitle={body.subtitle}
			variant={barVariant}
			sticky={false}
			elevated
			safeTop={resolvedLayout === 'mobile'}
			class={resolvedLayout === 'web' ? 'px-1' : ''}
		>
			{#snippet leading()}
				<Avatar name="Rafael" size="sm" />
			{/snippet}
			{#snippet trailing()}
				{@render trailingActions()}
			{/snippet}
		</AppBar>
	{:else}
		<AppBar
			title={body.title}
			subtitle={body.subtitle}
			variant={barVariant}
			sticky={false}
			showMenu={useMenu}
			showBack={useBack}
			bind:menuOpen
			elevated={example !== 'transparent'}
			safeTop={resolvedLayout === 'mobile'}
			class={resolvedLayout === 'web' ? 'px-1' : ''}
			onback={() => (menuOpen = false)}
		>
			{#snippet trailing()}
				{@render trailingActions()}
			{/snippet}
		</AppBar>
	{/if}
{/snippet}

{#snippet content()}
	<div class="min-h-0 flex-1 space-y-2 overflow-auto p-3 sm:p-4">
		{#if example === 'search'}
			<SearchInput bind:value={query} placeholder="Search products…" size="sm" />
		{/if}

		{#if example === 'transparent'}
			<div
				class="mb-2 aspect-[4/3] max-h-40 rounded-2xl bg-gradient-to-br from-brand-400/40 to-brand-700/30 sm:max-h-52"
			></div>
		{/if}

		<div class={resolvedLayout === 'web' ? 'grid gap-2 sm:grid-cols-2' : 'space-y-2'}>
			{#each rows as row (row)}
				<div
					class="rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-sm text-primary"
				>
					{row}
				</div>
			{/each}
		</div>

		{#if menuOpen}
			<p class="pt-2 text-center text-[11px] text-muted">Menu open · hamburger toggled</p>
		{/if}
	</div>
{/snippet}

{#if resolvedLayout === 'web'}
	<div
		class={[
			'mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border shadow-sm',
			example === 'transparent'
				? 'bg-gradient-to-b from-brand-500/25 via-surface to-surface'
				: 'bg-surface'
		]}
	>
		{@render appBar()}
		{@render content()}
	</div>
{:else}
	<PhoneFrame size="sm" class="mx-auto">
		<div
			class={[
				'flex h-full flex-col',
				example === 'transparent'
					? 'bg-gradient-to-b from-brand-500/30 via-surface to-surface'
					: 'bg-surface'
			]}
		>
			{@render appBar()}
			{@render content()}
		</div>
	</PhoneFrame>
{/if}
