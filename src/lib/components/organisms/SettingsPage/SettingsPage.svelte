<script lang="ts">
	import type { Snippet } from 'svelte';
	import SettingsLayout from '$lib/components/organisms/SettingsLayout/SettingsLayout.svelte';
	import type { SettingsNavItem } from '$lib/components/organisms/SettingsLayout/SettingsLayout.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';
	import ActionBar from '$lib/components/molecules/ActionBar/ActionBar.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';

	interface SettingsPageProps {
		items?: SettingsNavItem[];
		value?: string;
		dirty?: boolean;
		loading?: boolean;
		class?: string;
		children?: Snippet;
		onsubmit?: () => void;
		oncancel?: () => void;
		onchange?: (id: string) => void;
	}

	let {
		items = [
			{ id: 'general', label: 'General', description: 'Workspace defaults' },
			{ id: 'notifications', label: 'Notifications', description: 'Email and in-app' },
			{ id: 'security', label: 'Security', description: 'Access and sessions' }
		],
		value = $bindable('general'),
		dirty = $bindable(false),
		loading = false,
		class: className = '',
		children,
		onsubmit,
		oncancel,
		onchange
	}: SettingsPageProps = $props();

	let emailNotifs = $state(true);
	let productTips = $state(false);
	let twoFactor = $state(true);

	function markDirty() {
		dirty = true;
	}
</script>

<div class={['relative w-full space-y-4 pb-20', className]}>
	<SettingsLayout {items} bind:value {onchange}>
		{#if children}
			{@render children()}
		{:else if value === 'notifications'}
			<Card padding="lg" chrome={false}>
				<FormSection title="Notifications" description="Choose what we send you.">
					<Stack gap="sm">
						<SettingsRow
							title="Email notifications"
							description="Mentions, comments, and reviews."
							bind:checked={emailNotifs}
							onchange={markDirty}
						/>
						<SettingsRow
							title="Product tips"
							description="Occasional product updates."
							bind:checked={productTips}
							onchange={markDirty}
						/>
					</Stack>
				</FormSection>
			</Card>
		{:else if value === 'security'}
			<Card padding="lg" chrome={false}>
				<FormSection title="Security" description="Protect your account.">
					<SettingsRow
						title="Two-factor authentication"
						description="Require a second factor at sign-in."
						bind:checked={twoFactor}
						onchange={markDirty}
						hint="Recommended for owners"
					/>
				</FormSection>
			</Card>
		{:else}
			<Card padding="lg" chrome={false}>
				<FormSection title="General" description="Basic workspace preferences.">
					<p class="text-sm text-muted">
						Use this section for name, locale, and default visibility settings.
					</p>
					<button
						type="button"
						class="text-xs font-medium text-brand-600 hover:underline"
						onclick={markDirty}
					>
						Simulate a change
					</button>
				</FormSection>
			</Card>
		{/if}
	</SettingsLayout>

	<ActionBar
		{dirty}
		{loading}
		onsubmit={() => {
			dirty = false;
			onsubmit?.();
		}}
		oncancel={() => {
			dirty = false;
			oncancel?.();
		}}
	/>
</div>
