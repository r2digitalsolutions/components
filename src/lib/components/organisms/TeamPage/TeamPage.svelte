<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import UserCard from '$lib/components/molecules/UserCard/UserCard.svelte';
	import type { UserCardStatus } from '$lib/components/molecules/UserCard/UserCard.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export interface TeamMember {
		id: string;
		name: string;
		email?: string;
		role?: string;
		avatar?: string;
		status?: UserCardStatus;
		badge?: string;
	}

	interface TeamPageProps {
		title?: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		members?: TeamMember[];
		query?: string;
		empty?: boolean;
		class?: string;
		actions?: Snippet;
		oninvite?: () => void;
		onmember?: (member: TeamMember) => void;
	}

	let {
		title = 'Team',
		description = 'People with access to this workspace.',
		breadcrumbs = [],
		members = [],
		query = $bindable(''),
		empty = false,
		class: className = '',
		actions,
		oninvite,
		onmember
	}: TeamPageProps = $props();

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return members;
		return members.filter(
			(m) =>
				m.name.toLowerCase().includes(q) ||
				(m.email?.toLowerCase().includes(q) ?? false) ||
				(m.role?.toLowerCase().includes(q) ?? false)
		);
	});
</script>

<div class={['w-full space-y-5', className]}>
	<PageHeader {title} {description} {breadcrumbs}>
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{:else}
				<Button size="sm" onclick={() => oninvite?.()}>Invite</Button>
			{/if}
		{/snippet}
	</PageHeader>

	<SearchBar bind:value={query} placeholder="Search members…" buttonLabel="Search" />

	{#if empty || filtered.length === 0}
		<EmptyState
			title="No teammates found"
			description="Invite people to collaborate in this workspace."
		>
			{#snippet action()}
				<Button size="sm" onclick={() => oninvite?.()}>Invite member</Button>
			{/snippet}
		</EmptyState>
	{:else}
		<Grid cols={1} gap="md" class="sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as member (member.id)}
				<UserCard
					name={member.name}
					email={member.email}
					role={member.role}
					avatar={member.avatar}
					status={member.status}
					badge={member.badge}
					onaction={() => onmember?.(member)}
				/>
			{/each}
		</Grid>
	{/if}
</div>
