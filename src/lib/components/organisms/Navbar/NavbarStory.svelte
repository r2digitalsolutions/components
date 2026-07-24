<script lang="ts">
	import Navbar, { type NavbarLink } from './Navbar.svelte';
	import AvatarGroup from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	let props = $props<{
		size?: 'sm' | 'md' | 'lg';
		sticky?: boolean;
		variant?: 'underline' | 'pills' | 'plain';
		example?: 'marketing' | 'app' | 'centered' | 'docs' | 'compact';
		bordered?: boolean;
		blur?: boolean;
		maxWidth?: 'full' | '5xl' | '6xl' | '7xl';
		centerLinks?: boolean;
	}>();

	const marketingLinks: NavbarLink[] = [
		{ id: 'product', label: 'Product' },
		{ id: 'solutions', label: 'Solutions', badge: 'New' },
		{ id: 'pricing', label: 'Pricing' },
		{ id: 'docs', label: 'Docs' },
		{ id: 'blog', label: 'Blog', disabled: true }
	];

	const appLinks: NavbarLink[] = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'projects', label: 'Projects', badge: 4 },
		{ id: 'inbox', label: 'Inbox', badge: 12 },
		{ id: 'settings', label: 'Settings' }
	];

	const docsLinks: NavbarLink[] = [
		{ id: 'guide', label: 'Guide' },
		{ id: 'api', label: 'API' },
		{ id: 'examples', label: 'Examples' },
		{ id: 'changelog', label: 'Changelog' }
	];

	const example = $derived(props.example ?? 'marketing');
	const links = $derived(
		example === 'app' || example === 'compact'
			? appLinks
			: example === 'docs' || example === 'centered'
				? docsLinks
				: marketingLinks
	);

	let value = $state('');
	let search = $state('');

	$effect(() => {
		value = links[0]?.id ?? '';
	});
</script>

<div class="min-h-[40vh] w-full bg-surface">
	{#if example === 'marketing'}
		<Navbar
			brand="R2 Digi"
			{links}
			bind:value
			size={props.size ?? 'md'}
			variant={props.variant ?? 'underline'}
			sticky={props.sticky ?? false}
			blur={props.blur ?? true}
			bordered={props.bordered ?? true}
			maxWidth={props.maxWidth ?? '7xl'}
			centerLinks={props.centerLinks ?? false}
		>
			{#snippet actions()}
				<Button size="sm" variant="ghost">Sign in</Button>
				<Button size="sm">Get started</Button>
			{/snippet}
		</Navbar>
	{:else if example === 'app'}
		<Navbar
			brand="R2 Digi"
			{links}
			bind:value
			size={props.size ?? 'md'}
			variant={props.variant ?? 'pills'}
			sticky={props.sticky ?? true}
			blur={props.blur ?? true}
			bordered={props.bordered ?? true}
			maxWidth={props.maxWidth ?? 'full'}
		>
			{#snippet actions()}
				<div class="hidden w-52 lg:block">
					<SearchInput bind:value={search} placeholder="Search…" size="sm" />
				</div>
				<AvatarGroup
					size="sm"
					max={3}
					items={[
						{ id: '1', name: 'Ana' },
						{ id: '2', name: 'Luis' },
						{ id: '3', name: 'Sofia' },
						{ id: '4', name: 'Diego' }
					]}
				/>
				<Button size="sm">Invite</Button>
				<Avatar name="Rafa G" size="sm" />
			{/snippet}
		</Navbar>
	{:else if example === 'centered'}
		<Navbar
			brand="R2 Digi"
			{links}
			bind:value
			size={props.size ?? 'md'}
			variant={props.variant ?? 'plain'}
			sticky={props.sticky ?? false}
			blur={props.blur ?? false}
			bordered={props.bordered ?? true}
			maxWidth={props.maxWidth ?? '6xl'}
			centerLinks={props.centerLinks ?? true}
		>
			{#snippet actions()}
				<Badge variant="primary" size="sm">v0.4</Badge>
				<Button size="sm" variant="secondary">GitHub</Button>
			{/snippet}
		</Navbar>
	{:else if example === 'docs'}
		<Navbar
			brand="Docs"
			{links}
			bind:value
			size={props.size ?? 'sm'}
			variant={props.variant ?? 'underline'}
			sticky={props.sticky ?? true}
			blur={props.blur ?? true}
			bordered={props.bordered ?? true}
			maxWidth={props.maxWidth ?? '7xl'}
		>
			{#snippet actions()}
				<div class="w-44 sm:w-56">
					<SearchInput bind:value={search} placeholder="Search docs…" size="sm" />
				</div>
			{/snippet}
		</Navbar>
	{:else}
		<Navbar
			brand="R2"
			{links}
			bind:value
			size={props.size ?? 'sm'}
			variant={props.variant ?? 'pills'}
			sticky={props.sticky ?? false}
			blur={props.blur ?? false}
			bordered={props.bordered ?? false}
			maxWidth={props.maxWidth ?? 'full'}
			class="bg-surface-overlay/60"
		>
			{#snippet actions()}
				<Avatar name="Rafa G" size="sm" status="online" />
			{/snippet}
		</Navbar>
	{/if}

	<main class="mx-auto w-full max-w-5xl px-6 py-10">
		<h1 class="text-2xl font-semibold capitalize text-primary">{value || 'Home'}</h1>
		<p class="mt-2 max-w-xl text-sm text-secondary">
			Example: <span class="font-medium text-primary">{example}</span>
			· variant mirrors marketing, app shell, centered docs, and compact toolbars.
		</p>
	</main>
</div>
