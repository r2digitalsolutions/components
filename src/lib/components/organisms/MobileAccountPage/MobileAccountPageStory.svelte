<script lang="ts">
	import MobileAccountPage from './MobileAccountPage.svelte';
	import type { AccountToggleItem, AccountSection } from './MobileAccountPage.svelte';
	import PhoneFrame from '$lib/components/molecules/PhoneFrame/PhoneFrame.svelte';
	import type { QuickAction } from '$lib/components/molecules/QuickActionGrid/QuickActionGrid.svelte';

	interface Props {
		example?: 'default' | 'minimal' | 'toggles';
	}

	let { example = 'default' }: Props = $props();

	const actions: QuickAction[] = [
		{ id: 'invite', label: 'Invite', icon: 'users', tone: 'brand' },
		{ id: 'upload', label: 'Upload', icon: 'upload', tone: 'info' },
		{ id: 'share', label: 'Share', icon: 'share', tone: 'success' }
	];

	const sections: AccountSection[] = [
		{
			id: 'account',
			title: 'Account',
			items: [
				{ id: 'profile', label: 'Profile', description: 'Name, photo, and bio' },
				{ id: 'notifications', label: 'Notifications', description: 'Email, push, and in-app' },
				{ id: 'security', label: 'Security', description: 'Password and 2FA', badge: '2FA' }
			]
		},
		{
			id: 'workspace',
			title: 'Workspace',
			items: [
				{ id: 'billing', label: 'Billing', description: 'Plan and payment method', badge: 'Pro' },
				{ id: 'appearance', label: 'Appearance', description: 'Theme and density' },
				{ id: 'language', label: 'Language', description: 'English (US)' },
				{ id: 'help', label: 'Help & support', description: 'Docs, contact, and status' }
			]
		}
	];

	let toggles = $state<AccountToggleItem[]>([
		{
			id: 'faceid',
			title: 'Face ID unlock',
			description: 'Use biometrics to open the app',
			checked: true
		},
		{
			id: 'marketing',
			title: 'Product tips',
			description: 'Occasional emails about new features',
			checked: false
		}
	]);

	let last = $state('');
</script>

<div class="flex flex-col items-center gap-3 py-6">
	<PhoneFrame size="md" scrollable>
		<div class="bg-surface px-3 py-3 pb-8">
			{#if example === 'minimal'}
				<MobileAccountPage
					name="Ada Lovelace"
					email="ada@example.com"
					actions={[]}
					settings={[
						{ id: 'profile', label: 'Profile', description: 'Name and photo' },
						{ id: 'security', label: 'Security', description: 'Password' },
						{ id: 'help', label: 'Help', description: 'Support center' }
					]}
					showEdit={false}
					onaction={(id) => (last = id)}
					onsignout={() => (last = 'sign-out')}
				/>
			{:else if example === 'toggles'}
				<MobileAccountPage
					name="Ada Lovelace"
					email="ada@r2digisolutions.com"
					role="Owner"
					plan="Pro"
					{actions}
					{sections}
					bind:toggles
					onaction={(id) => (last = id)}
					ontoggle={(id, checked) => (last = `toggle:${id}:${checked}`)}
					onedit={() => (last = 'edit')}
					onsignout={() => (last = 'sign-out')}
				/>
			{:else}
				<MobileAccountPage
					name="Ada Lovelace"
					email="ada@r2digisolutions.com"
					role="Staff Engineer"
					plan="Pro"
					status="online"
					{actions}
					{sections}
					onaction={(id) => (last = id)}
					onedit={() => (last = 'edit')}
					onsignout={() => (last = 'sign-out')}
				/>
			{/if}
		</div>
	</PhoneFrame>

	{#if last}
		<p class="text-center text-xs text-muted">
			Last action: <span class="font-medium text-primary">{last}</span>
		</p>
	{/if}
</div>
