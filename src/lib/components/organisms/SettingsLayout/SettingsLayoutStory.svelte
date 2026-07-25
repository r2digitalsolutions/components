<script lang="ts">
	import SettingsLayout, {
		type SettingsNavGroup,
		type SettingsNavItem
	} from './SettingsLayout.svelte';
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let props = $props<{
		example?: 'default' | 'groups' | 'customHeader' | 'disabled';
		showHeader?: boolean;
		stickyHeader?: boolean;
	}>();

	const flatItems: SettingsNavItem[] = [
		{ id: 'profile', label: 'Profile', description: 'Name and avatar' },
		{ id: 'security', label: 'Security', description: 'Password and MFA' },
		{ id: 'billing', label: 'Billing', description: 'Plans and invoices' },
		{ id: 'team', label: 'Team', description: 'Members and roles', disabled: true }
	];

	const groups: SettingsNavGroup[] = [
		{
			id: 'account',
			label: 'Account',
			items: [
				{ id: 'profile', label: 'Profile', description: 'Name and avatar' },
				{ id: 'security', label: 'Security', description: 'Password and MFA' }
			]
		},
		{
			id: 'workspace',
			label: 'Workspace',
			items: [
				{ id: 'billing', label: 'Billing', description: 'Plans and invoices' },
				{ id: 'team', label: 'Team', description: 'Members and roles' },
				{ id: 'integrations', label: 'Integrations', description: 'Connected apps' }
			]
		}
	];

	const example = $derived(props.example ?? 'default');
	const useGroups = $derived(example === 'groups');
	const navItems = $derived(
		example === 'disabled' ? flatItems : flatItems.filter((i) => !i.disabled)
	);

	let value = $state('profile');
	let displayName = $state('Alex Rivera');
	let email = $state('alex@acme.dev');
	let marketing = $state(false);
	let twoFactor = $state(true);
</script>

{#snippet panel()}
	{#if value === 'security'}
		<Stack gap="lg">
			<SettingsRow
				title="Two-factor authentication"
				description="Require a second factor at sign-in."
				bind:checked={twoFactor}
				hint="Recommended"
			/>
		</Stack>
	{:else if value === 'billing'}
		<Stack gap="md">
			<Text size="sm">Pro · billed monthly</Text>
			<div>
				<Button size="sm" variant="secondary">Manage billing</Button>
			</div>
		</Stack>
	{:else if value === 'team' || value === 'integrations'}
		<Text size="sm" tone="muted">
			{value === 'team'
				? 'Invite teammates and manage roles.'
				: 'Connect Slack, GitHub, and more.'}
		</Text>
	{:else}
		<Stack gap="md">
			<FormField label="Display name" bind:value={displayName} />
			<FormField label="Email" type="email" bind:value={email} />
			<SettingsRow
				title="Product tips"
				description="Occasional emails about new features."
				bind:checked={marketing}
			/>
		</Stack>
	{/if}
{/snippet}

<div class="w-208 max-w-full p-2">
	{#if example === 'customHeader'}
		<SettingsLayout
			bind:value
			items={navItems}
			title="Settings"
			description="Manage your account and workspace."
			showHeader={false}
			stickyHeader={props.stickyHeader ?? false}
		>
			{#snippet header()}
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h2 class="text-lg font-semibold text-primary">Workspace preferences</h2>
						<Text size="sm" tone="muted">Custom header via snippet</Text>
					</div>
					<Button size="sm">Invite member</Button>
				</div>
			{/snippet}
			{@render panel()}
		</SettingsLayout>
	{:else}
		<SettingsLayout
			bind:value
			items={useGroups ? [] : navItems}
			groups={useGroups ? groups : []}
			title="Settings"
			description="Manage your account and workspace."
			showHeader={props.showHeader ?? true}
			stickyHeader={props.stickyHeader ?? false}
		>
			{#snippet actions()}
				<Button size="sm" variant="secondary">Reset</Button>
				<Button size="sm">Save</Button>
			{/snippet}
			{#snippet footer()}
				<Text size="xs" tone="muted">v0.0.1 · Acme workspace</Text>
			{/snippet}
			{@render panel()}
		</SettingsLayout>
	{/if}
</div>
