<script lang="ts">
	import Announcement from './Announcement.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		tone?: 'brand' | 'neutral' | 'warning' | 'success';
		badge?: string;
		sticky?: boolean;
	}>();
</script>

<div class="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border shadow-sm">
	<Announcement
		tone={props.tone ?? 'brand'}
		badge={props.badge ?? 'New'}
		sticky={props.sticky ?? false}
		message="Kanban boards are available for all workspaces."
		href="#"
		linkLabel="See what's new"
	/>
	<div class="space-y-4 bg-surface-elevated p-6">
		<p class="text-sm text-muted">Page content below the announcement bar.</p>

		<div class="space-y-3">
			<p class="text-xs font-medium uppercase tracking-wide text-muted">Other tones</p>
			<Announcement
				tone="warning"
				badge="Maintenance"
				message="Scheduled downtime tonight at 23:00 UTC."
				href="#"
				linkLabel="View status"
				class="rounded-xl border"
			/>
			<Announcement
				tone="success"
				badge="Live"
				message="v1.4.2 has been deployed to production."
				dismissible={false}
				class="rounded-xl border"
			>
				{#snippet action()}
					<Button size="xs" variant="secondary">Changelog</Button>
				{/snippet}
			</Announcement>
			<Announcement
				tone="neutral"
				message="Invite your teammates to collaborate on this project."
				href="#"
				linkLabel="Invite"
				class="rounded-xl border"
			/>
		</div>
	</div>
</div>
