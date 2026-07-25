<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import SessionRow from '$lib/components/molecules/SessionRow/SessionRow.svelte';
	import type { SessionInfo } from '$lib/components/molecules/SessionRow/SessionRow.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import ConfirmDialog from '$lib/components/molecules/ConfirmDialog/ConfirmDialog.svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Shield from '@lucide/svelte/icons/shield';

	interface SessionsPageProps {
		title?: string;
		description?: string;
		sessions?: SessionInfo[];
		class?: string;
		onrevoke?: (id: string) => void;
		onrevokeothers?: () => void;
	}

	let {
		title = 'Active sessions',
		description = 'Devices currently signed in to your account. Revoke any you don’t recognize.',
		sessions = $bindable<SessionInfo[]>([
			{
				id: '1',
				device: 'desktop',
				browser: 'Chrome 126',
				os: 'macOS',
				location: 'Madrid, ES',
				ip: '85.12.••.41',
				lastActiveAt: Date.now(),
				current: true
			},
			{
				id: '2',
				device: 'mobile',
				browser: 'Safari',
				os: 'iOS 18',
				location: 'Barcelona, ES',
				ip: '79.44.••.19',
				lastActiveAt: Date.now() - 1000 * 60 * 60 * 5
			},
			{
				id: '3',
				device: 'tablet',
				browser: 'Edge',
				os: 'Windows',
				location: 'Lisbon, PT',
				ip: '91.200.••.8',
				lastActiveAt: Date.now() - 1000 * 60 * 60 * 24 * 2
			}
		]),
		class: className = '',
		onrevoke,
		onrevokeothers
	}: SessionsPageProps = $props();

	let revokeId = $state<string | null>(null);
	let revokeOpen = $state(false);
	let revokeOthersOpen = $state(false);

	const others = $derived(sessions.filter((s) => !s.current));

	function askRevoke(id: string) {
		revokeId = id;
		revokeOpen = true;
	}

	function confirmRevoke() {
		if (!revokeId) return;
		const id = revokeId;
		sessions = sessions.filter((s) => s.id !== id);
		onrevoke?.(id);
		revokeId = null;
		revokeOpen = false;
	}

	function confirmRevokeOthers() {
		sessions = sessions.filter((s) => s.current);
		onrevokeothers?.();
		revokeOthersOpen = false;
	}
</script>

<div class={['mx-auto w-full max-w-2xl space-y-5', className]}>
	<PageHeader {title} {description}>
		{#snippet actions()}
			{#if others.length}
				<Button size="sm" variant="outline" onclick={() => (revokeOthersOpen = true)}>
					Revoke others
				</Button>
			{/if}
		{/snippet}
	</PageHeader>

	<Alert
		variant="info"
		title="Security tip"
		message="If you see an unfamiliar location or device, revoke it and change your password."
	/>

	{#if sessions.length === 0}
		<EmptyState title="No active sessions" description="You’re signed out everywhere.">
			{#snippet icon()}
				<Shield class="h-7 w-7" strokeWidth={1.75} />
			{/snippet}
		</EmptyState>
	{:else}
		<ul class="space-y-2">
			{#each sessions as session (session.id)}
				<li>
					<SessionRow {session} onrevoke={askRevoke} />
				</li>
			{/each}
		</ul>
	{/if}
</div>

<ConfirmDialog
	bind:open={revokeOpen}
	title="Revoke session?"
	description="That device will need to sign in again."
	confirmLabel="Revoke"
	onconfirm={confirmRevoke}
/>

<ConfirmDialog
	bind:open={revokeOthersOpen}
	title="Revoke all other sessions?"
	description="You’ll stay signed in on this device. Everyone else will be signed out."
	confirmLabel="Revoke others"
	onconfirm={confirmRevokeOthers}
/>
