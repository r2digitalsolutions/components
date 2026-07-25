<script lang="ts">
	import MobileShell from './MobileShell.svelte';
	import PhoneFrame from '$lib/components/molecules/PhoneFrame/PhoneFrame.svelte';
	import Stories from '$lib/components/molecules/Stories/Stories.svelte';
	import ChipBar from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Star from '@lucide/svelte/icons/star';
	import Bell from '@lucide/svelte/icons/bell';

	interface Props {
		navVariant?: 'default' | 'floating' | 'pill';
	}

	let { navVariant = 'default' }: Props = $props();

	let tab = $state('home');
	let filter = $state('all');

	const places = [
		{
			id: '1',
			title: 'Sunrise bakery',
			meta: '0.4 km · Café',
			rating: '4.8',
			tone: 'from-amber-400/80 to-orange-500/70',
			mark: 'SB'
		},
		{
			id: '2',
			title: 'Harbor walk',
			meta: '1.1 km · Outdoors',
			rating: '4.6',
			tone: 'from-sky-400/80 to-cyan-600/70',
			mark: 'HW'
		},
		{
			id: '3',
			title: 'City market',
			meta: '0.8 km · Food',
			rating: '4.9',
			tone: 'from-emerald-400/80 to-teal-600/70',
			mark: 'CM'
		},
		{
			id: '4',
			title: 'Lantern park',
			meta: '1.6 km · Parks',
			rating: '4.5',
			tone: 'from-violet-400/80 to-fuchsia-600/65',
			mark: 'LP'
		}
	];

	const visible = $derived(
		filter === 'all'
			? places
			: places.filter((p) => {
					if (filter === 'food') return /bakery|market/i.test(p.title);
					if (filter === 'cafes') return /bakery|café|cafe/i.test(p.meta + p.title);
					if (filter === 'parks') return /park|walk|outdoors/i.test(p.meta + p.title);
					return true;
				})
	);
</script>

<div class="relative z-0 flex justify-center py-8">
	<PhoneFrame size="md">
		<MobileShell
			bind:activeNav={tab}
			title="Explore"
			subtitle="Near you"
			fill
			{navVariant}
			appBarVariant="blur"
			appBarElevated={false}
			navItems={[
				{ id: 'home', label: 'Home', icon: 'home' },
				{ id: 'search', label: 'Search', icon: 'search' },
				{ id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 2 },
				{ id: 'user', label: 'Profile', icon: 'user' }
			]}
		>
			{#snippet trailing()}
				<IconButton label="Notifications" size="sm" variant="ghost">
					<Bell class="h-4 w-4" strokeWidth={2} />
				</IconButton>
			{/snippet}

			<div class="space-y-5">
				<section class="space-y-2">
					<p class="px-0.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
						Stories
					</p>
					<Stories
						size="sm"
						items={[
							{ id: '1', name: 'You', seen: true, add: true },
							{ id: '2', name: 'Mia' },
							{ id: '3', name: 'Leo', live: true },
							{ id: '4', name: 'Sam' },
							{ id: '5', name: 'Ava' }
						]}
					/>
				</section>

				<section class="space-y-2.5">
					<p class="px-0.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
						Categories
					</p>
					<ChipBar
						bind:value={filter}
						size="sm"
						variant="soft"
						items={[
							{ id: 'all', label: 'All' },
							{ id: 'food', label: 'Food' },
							{ id: 'cafes', label: 'Cafés' },
							{ id: 'parks', label: 'Parks' }
						]}
					/>
				</section>

				<section class="space-y-2.5">
					<div class="flex items-end justify-between gap-2 px-0.5">
						<div>
							<p class="text-sm font-semibold text-primary">Popular nearby</p>
							<p class="text-[11px] text-muted">{visible.length} places</p>
						</div>
						<button type="button" class="text-[11px] font-medium text-brand-600 dark:text-brand-400">
							See all
						</button>
					</div>

					<ul class="space-y-2.5">
						{#each visible as place (place.id)}
							<li>
								<button
									type="button"
									class="group flex w-full items-center gap-3 rounded-2xl border border-border/80 bg-surface-elevated p-2.5 text-left shadow-sm transition hover:border-brand-500/30 hover:bg-surface-overlay"
								>
									<span
										class={[
											'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold tracking-wide text-white shadow-inner',
											place.tone
										]}
										aria-hidden="true"
									>
										{place.mark}
									</span>
									<span class="min-w-0 flex-1">
										<span class="flex items-center gap-1.5">
											<span class="truncate text-sm font-semibold text-primary">{place.title}</span>
										</span>
										<span class="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
											<MapPin class="h-3 w-3 shrink-0" strokeWidth={2} />
											<span class="truncate">{place.meta}</span>
										</span>
									</span>
									<span class="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
										<Star class="h-3 w-3 fill-current" strokeWidth={0} />
										{place.rating}
									</span>
								</button>
							</li>
						{/each}
					</ul>
				</section>

				{#if tab === 'inbox'}
					<div
						class="rounded-2xl border border-dashed border-border bg-surface-overlay/50 px-4 py-8 text-center"
					>
						<Badge size="sm" variant="info">Inbox</Badge>
						<p class="mt-2 text-sm font-medium text-primary">2 new messages</p>
						<p class="mt-1 text-xs text-muted">Switch tabs to explore the shell chrome.</p>
					</div>
				{/if}
			</div>
		</MobileShell>
	</PhoneFrame>
</div>
