<script lang="ts">
	import UserMenu from './UserMenu.svelte';
	import Navbar from '$lib/components/organisms/Navbar/Navbar.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	let props = $props<{
		name?: string;
		email?: string;
		role?: string;
		plan?: string;
		status?: 'online' | 'offline' | 'busy' | 'away' | null;
		size?: 'sm' | 'md' | 'lg';
		showMeta?: boolean;
	}>();

	let last = $state('');
	let nav = $state('overview');

	const links = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'team', label: 'Team' }
	];
</script>

<div class="w-full max-w-3xl space-y-8">
	<div class="rounded-2xl border border-border bg-surface shadow-sm">
		<Navbar
			brand="R2 Digi"
			{links}
			bind:value={nav}
			variant="plain"
			bordered
			blur={false}
			maxWidth="full"
			size="md"
			class="rounded-t-2xl"
		>
			{#snippet actions()}
				<div class="flex items-center gap-1">
					<IconButton label="Search" variant="ghost" size="sm">
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<circle cx="11" cy="11" r="7" /><path stroke-linecap="round" d="M21 21l-3.5-3.5" />
						</svg>
					</IconButton>
					<IconButton label="Notifications" variant="ghost" size="sm">
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L3 17h5m7 0a3 3 0 11-6 0"
							/>
						</svg>
					</IconButton>
					<div class="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true"></div>
					<UserMenu
						name={props.name ?? 'Alex Rivera'}
						email={props.email ?? 'alex@r2digisolutions.com'}
						role={props.role ?? 'Admin'}
						plan={props.plan ?? 'Pro'}
						status={props.status ?? 'online'}
						size={props.size ?? 'sm'}
						showMeta={props.showMeta ?? true}
						showSubtitle={false}
						variant="ghost"
						onselect={(id) => (last = id)}
					/>
				</div>
			{/snippet}
		</Navbar>

		<div class="min-h-[28rem] space-y-2 px-6 py-10">
			<p class="text-sm font-medium text-primary">Projects</p>
			<p class="max-w-md text-xs leading-relaxed text-muted">
				Example app shell. User menu uses the ghost variant so it aligns with navbar icon buttons.
			</p>
			{#if last}
				<p class="pt-2 text-xs text-secondary">
					Last action: <span class="font-mono">{last}</span>
				</p>
			{/if}
		</div>
	</div>

	<div>
		<p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Standalone variants</p>
		<div class="flex flex-wrap items-start gap-6">
			<div class="space-y-1.5">
				<p class="text-[11px] text-muted">Outline · full meta</p>
				<UserMenu
					name="Sam Chen"
					email="sam@r2digi.com"
					role="Member"
					plan="Free"
					status="away"
					size="md"
					variant="outline"
				/>
			</div>
			<div class="space-y-1.5">
				<p class="text-[11px] text-muted">Ghost · avatar only</p>
				<UserMenu
					name="Jordan Lee"
					email="jordan@r2digi.com"
					status="busy"
					variant="ghost"
					showMeta={false}
					showChevron={false}
					size="md"
				/>
			</div>
		</div>
	</div>
</div>
