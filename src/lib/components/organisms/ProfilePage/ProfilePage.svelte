<script lang="ts">
	import type { Snippet } from 'svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Tabs from '$lib/components/molecules/Tabs/Tabs.svelte';
	import type { TabItem } from '$lib/components/molecules/Tabs/Tabs.svelte';
	import Descriptions from '$lib/components/molecules/Descriptions/Descriptions.svelte';
	import type { DescriptionItem } from '$lib/components/molecules/Descriptions/Descriptions.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import ProfileHeaderUploader from '$lib/components/organisms/ProfileHeaderUploader/ProfileHeaderUploader.svelte';
	import StatCard from '$lib/components/molecules/StatCard/StatCard.svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';

	interface ProfilePageProps {
		name?: string;
		email?: string;
		role?: string;
		tabs?: TabItem[];
		tab?: string;
		details?: DescriptionItem[];
		class?: string;
		children?: Snippet;
		onsubmit?: () => void;
		oncancel?: () => void;
	}

	let {
		name = 'Ada Lovelace',
		email = 'ada@example.com',
		role = 'Staff Engineer',
		tabs = [
			{ id: 'overview', label: 'Overview' },
			{ id: 'settings', label: 'Settings' },
			{ id: 'activity', label: 'Activity' }
		],
		tab = $bindable('overview'),
		details = [
			{ label: 'Name', value: name },
			{ label: 'Email', value: email },
			{ label: 'Role', value: role },
			{ label: 'Timezone', value: 'Europe/Madrid' }
		],
		class: className = '',
		children,
		onsubmit,
		oncancel
	}: ProfilePageProps = $props();
</script>

<div class={['w-full space-y-6', className]}>
	<ProfileHeaderUploader label={`${name} · profile media`} />

	<Tabs items={tabs} bind:value={tab} />

	{#if children}
		{@render children()}
	{:else if tab === 'overview'}
		<Stack gap="lg">
			<Grid cols={1} gap="md" class="sm:grid-cols-3">
				<StatCard label="Projects" value="18" delta="+2" trend="up" />
				<StatCard label="Commits" value="1.2k" delta="+8%" trend="up" />
				<StatCard label="Reviews" value="64" delta="-3%" trend="down" />
			</Grid>
			<Descriptions title="About" items={details} columns={2} />
		</Stack>
	{:else if tab === 'settings'}
		<Card padding="lg" chrome={false}>
			<FormSection
				title="Account"
				description="Update how you appear across the product."
			>
				<div class="grid gap-3 sm:grid-cols-2">
					<div class="rounded-xl border border-border bg-surface px-3 py-2">
						<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Name</p>
						<p class="text-sm text-primary">{name}</p>
					</div>
					<div class="rounded-xl border border-border bg-surface px-3 py-2">
						<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Email</p>
						<p class="text-sm text-primary">{email}</p>
					</div>
				</div>
				<FormActions
					submitLabel="Save profile"
					onsubmit={() => onsubmit?.()}
					oncancel={() => oncancel?.()}
				/>
			</FormSection>
		</Card>
	{:else}
		<Card padding="lg" chrome={false}>
			<p class="text-sm text-muted">Recent activity will appear here.</p>
		</Card>
	{/if}
</div>
