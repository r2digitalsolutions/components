<script lang="ts">
	import type { Snippet } from 'svelte';
	import SettingsLayout from '$lib/components/organisms/SettingsLayout/SettingsLayout.svelte';
	import type {
		SettingsNavGroup,
		SettingsNavItem
	} from '$lib/components/organisms/SettingsLayout/SettingsLayout.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';
	import ActionBar from '$lib/components/molecules/ActionBar/ActionBar.svelte';
	import DangerZone from '$lib/components/molecules/DangerZone/DangerZone.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { SelectOption } from '$lib/components/molecules/Select/Select.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import TimezoneSelect from '$lib/components/molecules/TimezoneSelect/TimezoneSelect.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	export interface SettingsFormValues {
		workspaceName: string;
		workspaceSlug: string;
		workspaceAbout: string;
		timezone: string;
		language: string;
		visibility: string;
		theme: string;
		density: string;
		emailNotifs: boolean;
		mentionNotifs: boolean;
		digestNotifs: boolean;
		productTips: boolean;
		twoFactor: boolean;
		loginAlerts: boolean;
		sessionTimeout: string;
	}

	interface SettingsPageProps {
		title?: string;
		description?: string;
		items?: SettingsNavItem[];
		groups?: SettingsNavGroup[];
		value?: string;
		dirty?: boolean;
		loading?: boolean;
		values?: Partial<SettingsFormValues>;
		languageOptions?: SelectOption[];
		visibilityOptions?: SelectOption[];
		sessionOptions?: SelectOption[];
		class?: string;
		children?: Snippet;
		footer?: Snippet;
		onsubmit?: (values: SettingsFormValues) => void;
		oncancel?: () => void;
		onchange?: (id: string) => void;
		ondelete?: () => void;
		onpassword?: () => void;
		onsessions?: () => void;
	}

	const DEFAULT_GROUPS: SettingsNavGroup[] = [
		{
			id: 'workspace',
			label: 'Workspace',
			items: [
				{ id: 'general', label: 'General', description: 'Name, locale, visibility' },
				{ id: 'appearance', label: 'Appearance', description: 'Theme and density' },
				{ id: 'notifications', label: 'Notifications', description: 'Email and in-app' }
			]
		},
		{
			id: 'account',
			label: 'Account',
			items: [
				{ id: 'security', label: 'Security', description: 'Access and sessions' },
				{ id: 'danger', label: 'Danger zone', description: 'Irreversible actions' }
			]
		}
	];

	const DEFAULT_LANGUAGE: SelectOption[] = [
		{ value: 'en', label: 'English' },
		{ value: 'es', label: 'Español' },
		{ value: 'fr', label: 'Français' },
		{ value: 'de', label: 'Deutsch' },
		{ value: 'pt', label: 'Português' }
	];

	const DEFAULT_VISIBILITY: SelectOption[] = [
		{ value: 'private', label: 'Private — invite only' },
		{ value: 'internal', label: 'Internal — anyone in org' },
		{ value: 'public', label: 'Public — anyone with the link' }
	];

	const DEFAULT_SESSION: SelectOption[] = [
		{ value: '1h', label: '1 hour' },
		{ value: '8h', label: '8 hours' },
		{ value: '24h', label: '24 hours' },
		{ value: '7d', label: '7 days' },
		{ value: '30d', label: '30 days' }
	];

	let {
		title = 'Settings',
		description = 'Manage workspace preferences and account security.',
		items = [],
		groups = DEFAULT_GROUPS,
		value = $bindable('general'),
		dirty = $bindable(false),
		loading = false,
		values = {},
		languageOptions = DEFAULT_LANGUAGE,
		visibilityOptions = DEFAULT_VISIBILITY,
		sessionOptions = DEFAULT_SESSION,
		class: className = '',
		children,
		footer,
		onsubmit,
		oncancel,
		onchange,
		ondelete,
		onpassword,
		onsessions
	}: SettingsPageProps = $props();

	let workspaceName = $state(values.workspaceName ?? 'Acme Workspace');
	let workspaceSlug = $state(values.workspaceSlug ?? 'acme');
	let workspaceAbout = $state(
		values.workspaceAbout ?? 'Product and engineering workspace for the Acme team.'
	);
	let timezone = $state(values.timezone ?? 'Europe/Madrid');
	let language = $state(values.language ?? 'en');
	let visibility = $state(values.visibility ?? 'private');
	let theme = $state(values.theme ?? 'system');
	let density = $state(values.density ?? 'comfortable');
	let emailNotifs = $state(values.emailNotifs ?? true);
	let mentionNotifs = $state(values.mentionNotifs ?? true);
	let digestNotifs = $state(values.digestNotifs ?? false);
	let productTips = $state(values.productTips ?? false);
	let twoFactor = $state(values.twoFactor ?? true);
	let loginAlerts = $state(values.loginAlerts ?? true);
	let sessionTimeout = $state(values.sessionTimeout ?? '8h');

	function snapshot(): SettingsFormValues {
		return {
			workspaceName,
			workspaceSlug,
			workspaceAbout,
			timezone,
			language,
			visibility,
			theme,
			density,
			emailNotifs,
			mentionNotifs,
			digestNotifs,
			productTips,
			twoFactor,
			loginAlerts,
			sessionTimeout
		};
	}

	let baseline = $state(snapshot());

	function markDirty() {
		dirty = true;
	}

	function resetToBaseline() {
		workspaceName = baseline.workspaceName;
		workspaceSlug = baseline.workspaceSlug;
		workspaceAbout = baseline.workspaceAbout;
		timezone = baseline.timezone;
		language = baseline.language;
		visibility = baseline.visibility;
		theme = baseline.theme;
		density = baseline.density;
		emailNotifs = baseline.emailNotifs;
		mentionNotifs = baseline.mentionNotifs;
		digestNotifs = baseline.digestNotifs;
		productTips = baseline.productTips;
		twoFactor = baseline.twoFactor;
		loginAlerts = baseline.loginAlerts;
		sessionTimeout = baseline.sessionTimeout;
		dirty = false;
	}

	function save() {
		baseline = snapshot();
		dirty = false;
		onsubmit?.(baseline);
	}

	function cancel() {
		resetToBaseline();
		oncancel?.();
	}

	const themeItems = [
		{ id: 'system', label: 'System' },
		{ id: 'light', label: 'Light' },
		{ id: 'dark', label: 'Dark' }
	];

	const densityItems = [
		{ id: 'comfortable', label: 'Comfortable' },
		{ id: 'compact', label: 'Compact' }
	];
</script>

<div class={['relative w-full space-y-4 pb-20', className]}>
	<SettingsLayout
		{title}
		{description}
		{items}
		{groups}
		bind:value
		{onchange}
		showHeader={false}
		{footer}
	>
		{#if children}
			{@render children()}
		{:else if value === 'appearance'}
			<Stack gap="lg">
				<FormSection
					title="Theme"
					description="Match your OS or force a light/dark surface."
					layout="split"
					variant="plain"
				>
					<div class="space-y-2">
						<p class="text-xs font-medium text-secondary">Color mode</p>
						<SegmentedControl
							items={themeItems}
							bind:value={theme}
							size="sm"
							onchange={() => markDirty()}
						/>
					</div>
				</FormSection>

				<FormSection
					title="Density"
					description="Control spacing across lists and forms."
					layout="split"
					variant="plain"
				>
					<div class="space-y-2">
						<p class="text-xs font-medium text-secondary">Layout density</p>
						<SegmentedControl
							items={densityItems}
							bind:value={density}
							size="sm"
							onchange={() => markDirty()}
						/>
					</div>
				</FormSection>
			</Stack>
		{:else if value === 'notifications'}
			<FormSection
				title="Notifications"
				description="Choose what we send you by email and in-app."
				layout="split"
				variant="plain"
			>
				<Stack gap="sm">
					<SettingsRow
						title="Email notifications"
						description="Mentions, comments, and review requests."
						bind:checked={emailNotifs}
						onchange={markDirty}
					/>
					<SettingsRow
						title="Mentions"
						description="Notify me when someone @mentions me."
						bind:checked={mentionNotifs}
						onchange={markDirty}
						disabled={!emailNotifs}
						hint={!emailNotifs ? 'Enable email notifications first' : undefined}
					/>
					<SettingsRow
						title="Weekly digest"
						description="A summary of activity every Monday morning."
						bind:checked={digestNotifs}
						onchange={markDirty}
					/>
					<SettingsRow
						title="Product tips"
						description="Occasional product updates and tips."
						bind:checked={productTips}
						onchange={markDirty}
					/>
				</Stack>
			</FormSection>
		{:else if value === 'security'}
			<Stack gap="lg">
				<FormSection
					title="Authentication"
					description="Protect sign-in and keep sessions under control."
					layout="split"
					variant="plain"
				>
					<Stack gap="sm">
						<SettingsRow
							title="Two-factor authentication"
							description="Require a second factor at sign-in."
							bind:checked={twoFactor}
							onchange={markDirty}
							hint={twoFactor ? 'Enabled — recommended for owners' : 'Recommended for owners'}
						/>
						<SettingsRow
							title="Login alerts"
							description="Email me when a new device signs in."
							bind:checked={loginAlerts}
							onchange={markDirty}
						/>
						<Select
							label="Session timeout"
							options={sessionOptions}
							bind:value={sessionTimeout}
							size="sm"
							onchange={() => markDirty()}
						/>
					</Stack>
				</FormSection>

				<FormSection
					title="Credentials"
					description="Password and active sessions."
					layout="split"
					variant="plain"
				>
					<div class="flex flex-wrap gap-2">
						<Button size="sm" variant="secondary" onclick={() => onpassword?.()}>
							Change password
						</Button>
						<Button size="sm" variant="ghost" onclick={() => onsessions?.()}>
							View active sessions
						</Button>
					</div>
				</FormSection>
			</Stack>
		{:else if value === 'danger'}
			<Stack gap="lg">
				<FormSection
					title="Transfer ownership"
					description="Hand this workspace to another owner before leaving."
					layout="split"
					variant="plain"
				>
					<Text size="sm" tone="muted">
						Ownership transfer is handled from Team settings once another owner is
						invited.
					</Text>
				</FormSection>

				<DangerZone
					title="Delete workspace"
					description="Permanently remove this workspace, projects, and members. This cannot be undone."
					actionLabel="Delete workspace"
					confirmTitle="Delete this workspace?"
					confirmMessage="All projects, files, and member access will be removed immediately."
					onconfirm={() => ondelete?.()}
				/>
			</Stack>
		{:else}
			<!-- general (default) -->
			<Stack gap="lg">
				<FormSection
					title="Workspace"
					description="Public identity and how people find this workspace."
					layout="split"
					variant="plain"
				>
					<FormField
						label="Workspace name"
						bind:value={workspaceName}
						required
						oninput={markDirty}
					/>
					<FormField
						label="URL slug"
						bind:value={workspaceSlug}
						helperText={`app.example.com/${workspaceSlug || '…'}`}
						oninput={markDirty}
					/>
					<Textarea
						label="About"
						bind:value={workspaceAbout}
						rows={3}
						maxLength={240}
						showCount
						oninput={markDirty}
					/>
				</FormSection>

				<FormSection
					title="Locale & defaults"
					description="Language, timezone, and default visibility for new projects."
					layout="split"
					variant="plain"
					columns={1}
				>
					<div class="grid gap-4 sm:grid-cols-2">
						<Select
							label="Language"
							options={languageOptions}
							bind:value={language}
							size="sm"
							onchange={() => markDirty()}
						/>
						<TimezoneSelect bind:value={timezone} onchange={() => markDirty()} />
					</div>
					<Select
						label="Default project visibility"
						options={visibilityOptions}
						bind:value={visibility}
						size="sm"
						onchange={() => markDirty()}
					/>
				</FormSection>
			</Stack>
		{/if}
	</SettingsLayout>

	{#if value !== 'danger'}
		<ActionBar
			{dirty}
			{loading}
			onsubmit={save}
			oncancel={cancel}
		/>
	{/if}
</div>
