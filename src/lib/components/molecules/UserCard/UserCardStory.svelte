<script lang="ts">
	import UserCard from './UserCard.svelte';
	import type { UserCardVariant } from './UserCard.svelte';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';

	let {
		example = 'gallery',
		variant = 'profile'
	}: {
		example?: 'gallery' | 'single' | 'team';
		variant?: UserCardVariant;
	} = $props();

	const actionBtn =
		'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-overlay hover:text-primary';

	const people = [
		{
			name: 'Ada Lovelace',
			role: 'Staff Engineer',
			email: 'ada@analytical.engines',
			avatar: 'https://i.pravatar.cc/120?img=5',
			status: 'online' as const,
			badge: 'Admin',
			bio: 'Mathematician and the first computer programmer. Working on analytical engines.',
			location: 'London, UK',
			stats: [
				{ label: 'Projects', value: 24 },
				{ label: 'Followers', value: '1.2k' },
				{ label: 'Following', value: 180 }
			]
		},
		{
			name: 'Grace Hopper',
			role: 'Principal Engineer',
			email: 'grace@navy.dev',
			avatar: 'https://i.pravatar.cc/120?img=9',
			status: 'away' as const,
			badge: 'Core',
			location: 'New York, US'
		},
		{
			name: 'Alan Turing',
			role: 'Research Lead',
			email: 'alan@bletchley.io',
			avatar: 'https://i.pravatar.cc/120?img=12',
			status: 'busy' as const,
			badge: 'Guest'
		}
	];
</script>

<div class="w-full max-w-3xl space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">User card</p>
		<p class="text-xs text-secondary">
			Perfil, compacto y cover con bio, stats, ubicación y acciones.
		</p>
	</div>

	{#if example === 'single'}
		<div class="max-w-sm">
			<UserCard
				{...people[0]}
				{variant}
				primaryAction="Message"
				secondaryAction="Follow"
			>
				{#snippet actions()}
					<button type="button" class={actionBtn} aria-label="More">
						<MoreHorizontal class="h-4 w-4" strokeWidth={2} />
					</button>
				{/snippet}
			</UserCard>
		</div>
	{:else if example === 'team'}
		<div class="grid gap-3 sm:grid-cols-2">
			{#each people as person}
				<UserCard
					{...person}
					variant="compact"
					primaryAction="Invite"
					badgeTone={person.badge === 'Admin' ? 'primary' : 'secondary'}
				/>
			{/each}
		</div>
	{:else}
		<div class="grid gap-4 lg:grid-cols-2">
			<div class="space-y-2">
				<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">Profile</p>
				<UserCard
					{...people[0]}
					variant="profile"
					primaryAction="View profile"
					secondaryAction="Message"
				/>
			</div>
			<div class="space-y-2">
				<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">Cover</p>
				<UserCard
					{...people[0]}
					variant="cover"
					primaryAction="Follow"
					secondaryAction="Message"
				/>
			</div>
			<div class="space-y-2 lg:col-span-2">
				<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">Compact</p>
				<div class="grid gap-2 sm:grid-cols-2">
					{#each people.slice(0, 2) as person}
						<UserCard {...person} variant="compact" primaryAction="Add" />
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
