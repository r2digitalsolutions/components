<script lang="ts">
	import type { Snippet } from 'svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { SelectOption } from '$lib/components/molecules/Select/Select.svelte';
	import TimezoneSelect from '$lib/components/molecules/TimezoneSelect/TimezoneSelect.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import User from '@lucide/svelte/icons/user';
	import Globe from '@lucide/svelte/icons/globe';
	import Bell from '@lucide/svelte/icons/bell';
	import Shield from '@lucide/svelte/icons/shield';
	import Palette from '@lucide/svelte/icons/palette';
	import Camera from '@lucide/svelte/icons/camera';

	export interface AccountSettingsValues {
		name: string;
		username: string;
		email: string;
		bio: string;
		avatar?: string;
		language: string;
		timezone: string;
		theme: string;
		newsletter: boolean;
		mentions: boolean;
		digest: boolean;
		marketing: boolean;
		profilePublic: boolean;
		showEmail: boolean;
	}

	interface SettingsFormProps {
		title?: string;
		description?: string;
		values?: Partial<AccountSettingsValues>;
		languageOptions?: SelectOption[];
		saving?: boolean;
		dirty?: boolean;
		savedHint?: string;
		showAppearance?: boolean;
		showPrivacy?: boolean;
		showNotifications?: boolean;
		class?: string;
		extra?: Snippet;
		footer?: Snippet;
		onsave?: (data: AccountSettingsValues) => void;
		oncancel?: () => void;
		onavatar?: () => void;
		onchange?: (data: AccountSettingsValues) => void;
	}

	const DEFAULTS: AccountSettingsValues = {
		name: '',
		username: '',
		email: '',
		bio: '',
		avatar: undefined,
		language: 'en',
		timezone: 'Europe/Madrid',
		theme: 'system',
		newsletter: true,
		mentions: true,
		digest: false,
		marketing: false,
		profilePublic: true,
		showEmail: false
	};

	const DEFAULT_LANG: SelectOption[] = [
		{ value: 'en', label: 'English' },
		{ value: 'es', label: 'Español' },
		{ value: 'fr', label: 'Français' },
		{ value: 'de', label: 'Deutsch' },
		{ value: 'pt', label: 'Português' }
	];

	let {
		title = 'Account settings',
		description = 'Manage how you appear and how we reach you.',
		values = {},
		languageOptions = DEFAULT_LANG,
		saving = false,
		dirty = $bindable(false),
		savedHint = '',
		showAppearance = true,
		showPrivacy = true,
		showNotifications = true,
		class: className = '',
		extra,
		footer,
		onsave,
		oncancel,
		onavatar,
		onchange
	}: SettingsFormProps = $props();

	let name = $state(values.name ?? DEFAULTS.name);
	let username = $state(values.username ?? DEFAULTS.username);
	let email = $state(values.email ?? DEFAULTS.email);
	let bio = $state(values.bio ?? DEFAULTS.bio);
	let avatar = $state(values.avatar ?? DEFAULTS.avatar);
	let language = $state(values.language ?? DEFAULTS.language);
	let timezone = $state(values.timezone ?? DEFAULTS.timezone);
	let theme = $state(values.theme ?? DEFAULTS.theme);
	let newsletter = $state(values.newsletter ?? DEFAULTS.newsletter);
	let mentions = $state(values.mentions ?? DEFAULTS.mentions);
	let digest = $state(values.digest ?? DEFAULTS.digest);
	let marketing = $state(values.marketing ?? DEFAULTS.marketing);
	let profilePublic = $state(values.profilePublic ?? DEFAULTS.profilePublic);
	let showEmail = $state(values.showEmail ?? DEFAULTS.showEmail);

	let baseline = $state(snapshot());

	function snapshot(): AccountSettingsValues {
		return {
			name,
			username,
			email,
			bio,
			avatar,
			language,
			timezone,
			theme,
			newsletter,
			mentions,
			digest,
			marketing,
			profilePublic,
			showEmail
		};
	}

	const current = $derived(snapshot());

	$effect(() => {
		const next = JSON.stringify(current);
		const base = JSON.stringify(baseline);
		dirty = next !== base;
		onchange?.(current);
	});

	function save() {
		onsave?.(current);
		baseline = snapshot();
		dirty = false;
	}

	function cancel() {
		const b = baseline;
		name = b.name;
		username = b.username;
		email = b.email;
		bio = b.bio;
		avatar = b.avatar;
		language = b.language;
		timezone = b.timezone;
		theme = b.theme;
		newsletter = b.newsletter;
		mentions = b.mentions;
		digest = b.digest;
		marketing = b.marketing;
		profilePublic = b.profilePublic;
		showEmail = b.showEmail;
		dirty = false;
		oncancel?.();
	}
</script>

<form
	class={['mx-auto flex w-full max-w-3xl flex-col gap-8', className]}
	onsubmit={(e) => {
		e.preventDefault();
		save();
	}}
>
	<header class="flex flex-wrap items-start justify-between gap-4">
		<div class="min-w-0 space-y-1">
			<h1 class="text-xl font-semibold tracking-tight text-primary sm:text-2xl">{title}</h1>
			{#if description}
				<p class="max-w-xl text-sm text-secondary">{description}</p>
			{/if}
		</div>
		{#if dirty}
			<Badge size="sm" variant="warning">Unsaved changes</Badge>
		{:else if savedHint}
			<Badge size="sm" variant="success">{savedHint}</Badge>
		{/if}
	</header>

	<!-- Identity strip -->
	<div
		class="flex flex-col gap-4 rounded-2xl border border-border bg-surface-elevated p-4 sm:flex-row sm:items-center sm:p-5"
	>
		<div class="relative shrink-0">
			<Avatar src={avatar} name={name || 'User'} size="2xl" />
			<button
				type="button"
				class="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-elevated text-secondary shadow-sm transition-colors hover:bg-surface-overlay hover:text-primary"
				aria-label="Change avatar"
				onclick={() => onavatar?.()}
			>
				<Camera class="h-3.5 w-3.5" aria-hidden="true" />
			</button>
		</div>
		<div class="min-w-0 flex-1 space-y-1">
			<p class="truncate text-base font-semibold text-primary">
				{name || 'Your name'}
			</p>
			<p class="truncate text-sm text-muted">
				{#if username}@{username}{/if}
				{#if username && email}
					<span class="text-border-strong"> · </span>
				{/if}
				{#if email}{email}{/if}
			</p>
			<Text size="xs" tone="muted" as="p">JPG or PNG · max 2MB. Square crops look best.</Text>
		</div>
		<Button type="button" size="sm" variant="secondary" onclick={() => onavatar?.()}>
			Upload photo
		</Button>
	</div>

	<FormSection
		title="Profile"
		description="This information may be visible to other people in your workspace."
		variant="card"
		layout="split"
		columns={2}
	>
		{#snippet icon()}
			<User class="h-4 w-4" />
		{/snippet}
		<FormField label="Display name" bind:value={name} required placeholder="Ada Lovelace" />
		<FormField label="Username" bind:value={username} placeholder="ada" helperText="Unique handle" />
		<div class="sm:col-span-2">
			<FormField
				label="Email"
				type="email"
				bind:value={email}
				required
				placeholder="you@company.com"
			/>
		</div>
		<div class="sm:col-span-2">
			<Textarea
				label="Bio"
				bind:value={bio}
				placeholder="A short intro about you…"
				rows={3}
				maxLength={160}
				showCount
			/>
		</div>
	</FormSection>

	<FormSection
		title="Locale"
		description="Language and time used across notifications and dates."
		variant="card"
		layout="split"
		columns={2}
	>
		{#snippet icon()}
			<Globe class="h-4 w-4" />
		{/snippet}
		<Select label="Language" bind:value={language} options={languageOptions} />
		<TimezoneSelect label="Timezone" bind:value={timezone} />
	</FormSection>

	{#if showAppearance}
		<FormSection
			title="Appearance"
			description="Choose how the interface looks on this device."
			variant="card"
			layout="split"
		>
			{#snippet icon()}
				<Palette class="h-4 w-4" />
			{/snippet}
			<div class="space-y-2">
				<p class="text-sm font-medium text-primary">Theme</p>
				<SegmentedControl
					bind:value={theme}
					items={[
						{ id: 'light', label: 'Light' },
						{ id: 'system', label: 'System' },
						{ id: 'dark', label: 'Dark' }
					]}
				/>
			</div>
		</FormSection>
	{/if}

	{#if showNotifications}
		<FormSection
			title="Notifications"
			description="Email and product updates. You can change these anytime."
			variant="card"
			layout="split"
		>
			{#snippet icon()}
				<Bell class="h-4 w-4" />
			{/snippet}
			<div class="-mx-4 divide-y divide-border sm:-mx-5">
				<SettingsRow
					variant="flush"
					title="Product updates"
					description="Release notes, tips, and new features"
					bind:checked={newsletter}
				/>
				<SettingsRow
					variant="flush"
					title="Mentions"
					description="When someone @mentions you in a thread"
					bind:checked={mentions}
				/>
				<SettingsRow
					variant="flush"
					title="Weekly digest"
					description="A summary of activity every Monday"
					bind:checked={digest}
				/>
				<SettingsRow
					variant="flush"
					title="Marketing emails"
					description="Occasional offers and partner news"
					bind:checked={marketing}
				/>
			</div>
		</FormSection>
	{/if}

	{#if showPrivacy}
		<FormSection
			title="Privacy"
			description="Control what others can see on your profile."
			variant="card"
			layout="split"
		>
			{#snippet icon()}
				<Shield class="h-4 w-4" />
			{/snippet}
			<div class="-mx-4 divide-y divide-border sm:-mx-5">
				<SettingsRow
					variant="flush"
					title="Public profile"
					description="Anyone in the workspace can view your profile"
					bind:checked={profilePublic}
				/>
				<SettingsRow
					variant="flush"
					title="Show email"
					description="Display your email on your public profile"
					bind:checked={showEmail}
					disabled={!profilePublic}
					hint={!profilePublic ? 'Enable public profile first' : undefined}
				/>
			</div>
		</FormSection>
	{/if}

	{#if extra}
		{@render extra()}
	{/if}

	<FormActions
		variant="sticky"
		align="between"
		submitLabel="Save changes"
		cancelLabel="Discard"
		loading={saving}
		submitDisabled={!dirty}
		hint={dirty ? 'You have unsaved changes' : savedHint || 'All changes saved'}
		onsubmit={save}
		oncancel={cancel}
	/>

	{#if footer}
		{@render footer()}
	{/if}
</form>
