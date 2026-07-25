<script lang="ts">
	import FormSection from './FormSection.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import User from '@lucide/svelte/icons/user';
	import Shield from '@lucide/svelte/icons/shield';
	import Bell from '@lucide/svelte/icons/bell';
	import Building2 from '@lucide/svelte/icons/building-2';

	let {
		variant = 'card',
		example = 'settings'
	}: {
		variant?: 'plain' | 'card' | 'inset';
		example?: 'settings' | 'stack' | 'collapsible' | 'columns';
	} = $props();

	let name = $state('Ada Lovelace');
	let email = $state('ada@example.com');
	let company = $state('Analytical Engines');
	let role = $state('Mathematician');
	let marketing = $state(true);
	let security = $state(true);
	let openSecurity = $state(true);
	let openAdvanced = $state(false);
	let openNotifications = $state(false);
</script>

<div class="w-full max-w-3xl space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Form section</p>
		<p class="text-xs text-secondary">
			Settings split, cards, badges, footer y secciones colapsables.
		</p>
	</div>

	{#if example === 'settings'}
		<div class="space-y-0 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
			<div class="border-b border-border px-5 py-4">
				<p class="text-sm font-semibold text-primary">Settings</p>
				<p class="text-xs text-muted">Manage your workspace profile and preferences.</p>
			</div>

			<div class="divide-y divide-border">
				<FormSection
					variant="plain"
					layout="split"
					class="px-5 py-6"
					eyebrow="Account"
					title="Profile"
					description="Public name and email used across the product."
				>
					{#snippet icon()}
						<User class="h-4 w-4" strokeWidth={2} />
					{/snippet}
					<FormField label="Display name" bind:value={name} />
					<FormField label="Email" type="email" bind:value={email} />
				</FormSection>

				<FormSection
					variant="plain"
					layout="split"
					class="px-5 py-6"
					eyebrow="Company"
					title="Workspace"
					description="Shown on invoices and team invites."
					badge="Required"
					badgeTone="brand"
				>
					{#snippet icon()}
						<Building2 class="h-4 w-4" strokeWidth={2} />
					{/snippet}
					<FormField label="Company" bind:value={company} />
					<FormField label="Role" bind:value={role} />
				</FormSection>

				<FormSection
					variant="plain"
					layout="split"
					class="px-5 py-6"
					eyebrow="Preferences"
					title="Notifications"
					description="Choose what lands in your inbox."
					divided={false}
				>
					{#snippet icon()}
						<Bell class="h-4 w-4" strokeWidth={2} />
					{/snippet}
					<div class="space-y-3 rounded-xl border border-border bg-surface px-3 py-3">
						<div class="flex items-center justify-between gap-3">
							<div>
								<p class="text-sm font-medium text-primary">Product updates</p>
								<p class="text-xs text-muted">New features and tips</p>
							</div>
							<Toggle bind:checked={marketing} />
						</div>
						<div class="flex items-center justify-between gap-3 border-t border-border pt-3">
							<div>
								<p class="text-sm font-medium text-primary">Security alerts</p>
								<p class="text-xs text-muted">Sign-ins and password changes</p>
							</div>
							<Toggle bind:checked={security} />
						</div>
					</div>
				</FormSection>
			</div>

			<FormActions
				variant="bar"
				align="between"
				hint="Changes save to this workspace"
				submitLabel="Save changes"
				class="rounded-none border-0 border-t"
			/>
		</div>
	{:else if example === 'collapsible'}
		<div class="space-y-2">
			<p class="text-[11px] text-muted">Accordion — clic en la fila para abrir/cerrar.</p>
			<div class="space-y-2">
				<FormSection
					{variant}
					title="Security"
					description="Password and session preferences."
					badge="Recommended"
					badgeTone="success"
					collapsible
					bind:open={openSecurity}
				>
					{#snippet icon()}
						<Shield class="h-3.5 w-3.5" strokeWidth={2} />
					{/snippet}
					<FormField label="Current password" type="password" value="" />
					<FormField label="New password" type="password" value="" />
					{#snippet footer()}
						<FormActions
							variant="plain"
							submitLabel="Update password"
							fullWidth={false}
							showCancel={false}
						/>
					{/snippet}
				</FormSection>

				<FormSection
					{variant}
					title="Notifications"
					description="Email and product updates."
					collapsible
					bind:open={openNotifications}
				>
					{#snippet icon()}
						<Bell class="h-3.5 w-3.5" strokeWidth={2} />
					{/snippet}
					<div class="space-y-3 rounded-xl border border-border bg-surface px-3 py-3">
						<div class="flex items-center justify-between gap-3">
							<div>
								<p class="text-sm font-medium text-primary">Product updates</p>
								<p class="text-xs text-muted">New features and tips</p>
							</div>
							<Toggle bind:checked={marketing} />
						</div>
						<div class="flex items-center justify-between gap-3 border-t border-border pt-3">
							<div>
								<p class="text-sm font-medium text-primary">Security alerts</p>
								<p class="text-xs text-muted">Sign-ins and password changes</p>
							</div>
							<Toggle bind:checked={security} />
						</div>
					</div>
				</FormSection>

				<FormSection
					{variant}
					title="Advanced"
					description="Optional power-user settings."
					badge="Optional"
					collapsible
					bind:open={openAdvanced}
				>
					{#snippet icon()}
						<Building2 class="h-3.5 w-3.5" strokeWidth={2} />
					{/snippet}
					<FormField label="API namespace" value="ada-prod" />
					<FormField label="Webhook URL" value="https://example.com/hook" />
				</FormSection>
			</div>
		</div>
	{:else if example === 'columns'}
		<FormSection
			{variant}
			title="Work details"
			description="Two-column fields from the `md` breakpoint."
			columns={2}
			badge="Draft"
			badgeTone="warning"
		>
			{#snippet icon()}
				<Building2 class="h-4 w-4" strokeWidth={2} />
			{/snippet}
			{#snippet actions()}
				<Button size="sm" variant="ghost">Clear</Button>
			{/snippet}
			<FormField label="Company" bind:value={company} />
			<FormField label="Role" bind:value={role} />
			<FormField label="Display name" bind:value={name} class="sm:col-span-2" />
			{#snippet footer()}
				<FormActions variant="plain" submitLabel="Continue" fullWidth={false} />
			{/snippet}
		</FormSection>
	{:else}
		<FormSection
			{variant}
			eyebrow="Account"
			title="Profile"
			description="Public information shown on your profile."
		>
			{#snippet icon()}
				<User class="h-4 w-4" strokeWidth={2} />
			{/snippet}
			{#snippet actions()}
				<Button size="sm" variant="ghost">Reset</Button>
			{/snippet}
			<FormField label="Display name" bind:value={name} />
			<FormField label="Email" type="email" bind:value={email} />
			{#snippet footer()}
				<FormActions variant="plain" submitLabel="Update profile" fullWidth={false} />
			{/snippet}
		</FormSection>
	{/if}
</div>
