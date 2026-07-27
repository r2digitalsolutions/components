<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';
	import SessionRow from '$lib/components/molecules/SessionRow/SessionRow.svelte';
	import type { SessionInfo } from '$lib/components/molecules/SessionRow/SessionRow.svelte';
	import DangerZone from '$lib/components/molecules/DangerZone/DangerZone.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import KeyRound from '@lucide/svelte/icons/key-round';

	interface SecuritySettingsPageProps {
		title?: string;
		description?: string;
		twoFactorEnabled?: boolean;
		sessions?: SessionInfo[];
		class?: string;
		onchangePassword?: () => void;
		ontoggle2fa?: (enabled: boolean) => void;
		onrevokeSession?: (id: string) => void;
		ondeleteAccount?: () => void;
	}

	let {
		title = 'Security',
		description = 'Manage your password, two-factor authentication, and active sessions.',
		twoFactorEnabled = $bindable(false),
		sessions = [],
		class: className = '',
		onchangePassword,
		ontoggle2fa,
		onrevokeSession,
		ondeleteAccount
	}: SecuritySettingsPageProps = $props();

	function handle2faChange(enabled: boolean) {
		twoFactorEnabled = enabled;
		ontoggle2fa?.(enabled);
	}
</script>

<div class={['mx-auto w-full max-w-2xl space-y-6', className]}>
	<PageHeader {title} {description} />

	<Stack gap="lg">
		<FormSection
			title="Password"
			description="Use a strong password you do not reuse elsewhere."
			layout="split"
			variant="plain"
		>
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-3">
					<span
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-secondary"
					>
						<KeyRound class="h-5 w-5" strokeWidth={2} />
					</span>
					<div>
						<p class="text-sm font-medium text-primary">Password</p>
						<p class="text-xs text-muted">Last changed 3 months ago</p>
					</div>
				</div>
				<Button
					size="sm"
					variant="secondary"
					class="shrink-0 whitespace-nowrap"
					onclick={() => onchangePassword?.()}
				>
					Change password
				</Button>
			</div>
		</FormSection>

		<FormSection
			title="Two-factor authentication"
			description="Add an extra layer of security to your account."
			layout="split"
			variant="plain"
		>
			<SettingsRow
				title="Authenticator app"
				description="Require a code from your authenticator app at sign-in."
				bind:checked={twoFactorEnabled}
				onchange={handle2faChange}
				hint={twoFactorEnabled ? 'Enabled — recommended' : 'Not enabled'}
			/>
		</FormSection>

		<FormSection
			title="Active sessions"
			description="Devices currently signed in to your account."
			layout="split"
			variant="plain"
		>
			{#if sessions.length === 0}
				<p class="text-sm text-muted">No other active sessions.</p>
			{:else}
				<ul class="space-y-2">
					{#each sessions as session (session.id)}
						<li>
							<SessionRow {session} onrevoke={onrevokeSession} />
						</li>
					{/each}
				</ul>
			{/if}
		</FormSection>

		<DangerZone
			title="Delete account"
			description="Permanently remove your account and all associated data. This cannot be undone."
			actionLabel="Delete account"
			confirmTitle="Delete your account?"
			confirmMessage="All projects, files, and personal data will be removed immediately."
			onconfirm={() => ondeleteAccount?.()}
		/>
	</Stack>
</div>
