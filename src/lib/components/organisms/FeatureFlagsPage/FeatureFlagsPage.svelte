<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import FeatureFlagRow from '$lib/components/molecules/FeatureFlagRow/FeatureFlagRow.svelte';
	import type {
		FeatureFlag,
		FlagEnvironment
	} from '$lib/components/molecules/FeatureFlagRow/FeatureFlagRow.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Flag from '@lucide/svelte/icons/flag';

	interface FeatureFlagsPageProps {
		title?: string;
		description?: string;
		flags?: FeatureFlag[];
		query?: string;
		environment?: FlagEnvironment;
		class?: string;
		oncreate?: () => void;
		onchange?: (id: string, enabled: boolean) => void;
		onedit?: (id: string) => void;
	}

	let {
		title = 'Feature flags',
		description = 'Ship dark features safely with rollouts and environment targeting.',
		flags = $bindable<FeatureFlag[]>([
			{
				id: '1',
				key: 'billing.v2',
				name: 'Billing V2',
				description: 'New invoices UI and prorated upgrades.',
				enabled: true,
				environment: 'staging',
				rollout: 25,
				tags: ['billing', 'beta']
			},
			{
				id: '2',
				key: 'search.semantic',
				name: 'Semantic search',
				description: 'Vector ranking in catalog search.',
				enabled: false,
				environment: 'development',
				tags: ['search']
			},
			{
				id: '3',
				key: 'auth.passkeys',
				name: 'Passkeys',
				description: 'Allow WebAuthn as a primary factor.',
				enabled: true,
				environment: 'production',
				rollout: 100,
				tags: ['auth', 'security']
			},
			{
				id: '4',
				key: 'ui.density.compact',
				name: 'Compact density',
				description: 'Tighter spacing for power users.',
				enabled: false,
				environment: 'all',
				tags: ['ui']
			}
		]),
		query = $bindable(''),
		environment = $bindable<FlagEnvironment>('all'),
		class: className = '',
		oncreate,
		onchange,
		onedit
	}: FeatureFlagsPageProps = $props();

	const envItems = [
		{ id: 'all', label: 'All' },
		{ id: 'production', label: 'Prod' },
		{ id: 'staging', label: 'Staging' },
		{ id: 'development', label: 'Dev' }
	];

	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return flags.filter((f) => {
			const envOk =
				environment === 'all' ||
				f.environment === 'all' ||
				f.environment === environment;
			if (!envOk) return false;
			if (!q) return true;
			return (
				f.name.toLowerCase().includes(q) ||
				f.key.toLowerCase().includes(q) ||
				(f.description?.toLowerCase().includes(q) ?? false) ||
				(f.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
			);
		});
	});

	function setEnabled(id: string, enabled: boolean) {
		flags = flags.map((f) => (f.id === id ? { ...f, enabled } : f));
		onchange?.(id, enabled);
	}
</script>

<div class={['mx-auto w-full max-w-3xl space-y-5', className]}>
	<PageHeader {title} {description}>
		{#snippet actions()}
			{#if oncreate}
				<Button size="sm" onclick={() => oncreate?.()}>
					<Plus class="h-3.5 w-3.5" strokeWidth={2} />
					New flag
				</Button>
			{/if}
		{/snippet}
	</PageHeader>

	<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
		<div class="min-w-0 flex-1">
			<SearchInput bind:value={query} placeholder="Search flags…" />
		</div>
		<SegmentedControl items={envItems} bind:value={environment} size="sm" />
	</div>

	{#if visible.length === 0}
		<EmptyState title="No flags found" description="Try another search or create a new flag.">
			{#snippet icon()}
				<Flag class="h-7 w-7" strokeWidth={1.75} />
			{/snippet}
			{#snippet action()}
				{#if oncreate}
					<Button size="sm" onclick={() => oncreate?.()}>New flag</Button>
				{/if}
			{/snippet}
		</EmptyState>
	{:else}
		<ul class="space-y-2">
			{#each visible as flag (flag.id)}
				<li>
					<FeatureFlagRow {flag} onchange={setEnabled} {onedit} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
