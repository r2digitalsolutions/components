<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import PropertyRow from '$lib/components/molecules/PropertyRow/PropertyRow.svelte';
	import DangerZone from '$lib/components/molecules/DangerZone/DangerZone.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Time from '$lib/components/atoms/Time/Time.svelte';

	export interface ApiKeyItem {
		id: string;
		name: string;
		prefix: string;
		createdAt: Date | string | number;
		lastUsedAt?: Date | string | number;
		status?: 'active' | 'revoked';
	}

	interface ApiKeysPageProps {
		keys?: ApiKeyItem[];
		class?: string;
		oncreate?: () => void;
		onrevoke?: (id: string) => void;
	}

	let {
		keys = $bindable<ApiKeyItem[]>([
			{
				id: '1',
				name: 'Production',
				prefix: 'r2_live_9f3a••••abcd',
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
				lastUsedAt: Date.now() - 1000 * 60 * 18,
				status: 'active'
			},
			{
				id: '2',
				name: 'CI',
				prefix: 'r2_test_22bc••••ef01',
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
				lastUsedAt: Date.now() - 1000 * 60 * 60 * 5,
				status: 'active'
			}
		]),
		class: className = '',
		oncreate,
		onrevoke
	}: ApiKeysPageProps = $props();
</script>

<div class={['w-full space-y-5', className]}>
	<PageHeader
		title="API keys"
		description="Authenticate server-side requests. Treat secrets like passwords."
	>
		{#snippet actions()}
			<Button size="sm" onclick={() => oncreate?.()}>Create key</Button>
		{/snippet}
	</PageHeader>

	<Card padding="lg" chrome={false}>
		<Stack gap="md">
			{#each keys as key (key.id)}
				<div class="space-y-2 rounded-xl border border-border p-3">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<p class="text-sm font-semibold text-primary">{key.name}</p>
							<Badge size="sm" variant={key.status === 'revoked' ? 'error' : 'success'}>
								{key.status ?? 'active'}
							</Badge>
						</div>
						{#if key.status !== 'revoked'}
							<Button size="xs" variant="ghost" onclick={() => onrevoke?.(key.id)}>Revoke</Button>
						{/if}
					</div>
					<PropertyRow label="Key" value={key.prefix} copyable mono />
					<div class="flex flex-wrap gap-4 text-xs text-muted">
						<span>Created <Time date={key.createdAt} format="medium" class="text-xs text-muted" /></span>
						{#if key.lastUsedAt}
							<span>Last used <Time date={key.lastUsedAt} format="datetime" class="text-xs text-muted" /></span>
						{/if}
					</div>
				</div>
			{:else}
				<Text size="sm" tone="muted">No API keys yet.</Text>
			{/each}
		</Stack>
	</Card>

	<DangerZone
		title="Rotate all keys"
		description="Immediately invalidate every active key. Apps will stop authenticating until you create replacements."
		actionLabel="Rotate all"
		confirmTitle="Rotate all API keys?"
		confirmMessage="This cannot be undone. Deployed services will need new credentials."
		onconfirm={() => {
			keys = keys.map((k) => ({ ...k, status: 'revoked' as const }));
		}}
	/>
</div>
