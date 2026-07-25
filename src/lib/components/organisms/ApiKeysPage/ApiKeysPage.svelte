<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import DangerZone from '$lib/components/molecules/DangerZone/DangerZone.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';
	import CopyButton from '$lib/components/molecules/CopyButton/CopyButton.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import ConfirmDialog from '$lib/components/molecules/ConfirmDialog/ConfirmDialog.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Time from '$lib/components/atoms/Time/Time.svelte';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import Plus from '@lucide/svelte/icons/plus';
	import ShieldAlert from '@lucide/svelte/icons/shield-alert';

	export type ApiKeyStatus = 'active' | 'revoked';
	export type ApiKeyEnv = 'live' | 'test';

	export interface ApiKeyItem {
		id: string;
		name: string;
		/** Masked display prefix, e.g. r2_live_9f3a••••abcd */
		prefix: string;
		/** Value copied to clipboard (defaults to prefix) */
		copyValue?: string;
		env?: ApiKeyEnv;
		scopes?: string[];
		createdAt: Date | string | number;
		lastUsedAt?: Date | string | number;
		status?: ApiKeyStatus;
	}

	interface ApiKeysPageProps {
		title?: string;
		description?: string;
		keys?: ApiKeyItem[];
		/** One-time secret shown after create (parent clears after dismiss) */
		revealedSecret?: string | null;
		filter?: 'all' | 'active' | 'revoked';
		class?: string;
		oncreate?: () => void;
		onrevoke?: (id: string) => void;
		onrotateall?: () => void;
		ondismisssecret?: () => void;
	}

	let {
		title = 'API keys',
		description = 'Authenticate server-side requests. Treat secrets like passwords.',
		keys = $bindable<ApiKeyItem[]>([
			{
				id: '1',
				name: 'Production',
				prefix: 'r2_live_9f3a••••abcd',
				copyValue: 'r2_live_9f3a••••abcd',
				env: 'live',
				scopes: ['read', 'write'],
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
				lastUsedAt: Date.now() - 1000 * 60 * 18,
				status: 'active'
			},
			{
				id: '2',
				name: 'CI',
				prefix: 'r2_test_22bc••••ef01',
				copyValue: 'r2_test_22bc••••ef01',
				env: 'test',
				scopes: ['read'],
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
				lastUsedAt: Date.now() - 1000 * 60 * 60 * 5,
				status: 'active'
			},
			{
				id: '3',
				name: 'Legacy staging',
				prefix: 'r2_test_aa11••••9900',
				env: 'test',
				scopes: ['read'],
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
				status: 'revoked'
			}
		]),
		revealedSecret = $bindable<string | null>(null),
		filter = $bindable<'all' | 'active' | 'revoked'>('active'),
		class: className = '',
		oncreate,
		onrevoke,
		onrotateall,
		ondismisssecret
	}: ApiKeysPageProps = $props();

	let revokeId = $state<string | null>(null);
	let revokeOpen = $state(false);

	const activeCount = $derived(keys.filter((k) => (k.status ?? 'active') === 'active').length);
	const revokedCount = $derived(keys.filter((k) => k.status === 'revoked').length);

	const visible = $derived.by(() => {
		if (filter === 'all') return keys;
		if (filter === 'revoked') return keys.filter((k) => k.status === 'revoked');
		return keys.filter((k) => (k.status ?? 'active') === 'active');
	});

	const revokeTarget = $derived(keys.find((k) => k.id === revokeId) ?? null);

	function askRevoke(id: string) {
		revokeId = id;
		revokeOpen = true;
	}

	function confirmRevoke() {
		if (!revokeId) return;
		const id = revokeId;
		keys = keys.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k));
		onrevoke?.(id);
		revokeId = null;
		revokeOpen = false;
	}

	function rotateAll() {
		keys = keys.map((k) => ({ ...k, status: 'revoked' as const }));
		onrotateall?.();
	}
</script>

<div class={['mx-auto w-full max-w-4xl space-y-6', className]}>
	<PageHeader {title} {description}>
		{#snippet meta()}
			<div class="flex flex-wrap items-center gap-2 text-xs text-muted">
				<span class="font-medium text-secondary">{activeCount} active</span>
				<span aria-hidden="true">·</span>
				<span>{revokedCount} revoked</span>
			</div>
		{/snippet}
		{#snippet actions()}
			<Button size="sm" onclick={() => oncreate?.()}>
				<Plus class="h-3.5 w-3.5" strokeWidth={2} />
				Create key
			</Button>
		{/snippet}
	</PageHeader>

	<Alert
		variant="warning"
		title="Keep keys secret"
		message="Never commit API keys to git or share them in tickets. Prefer scoped, short-lived keys."
	/>

	{#if revealedSecret}
		<div
			class="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4"
			role="status"
		>
			<div class="flex flex-wrap items-start justify-between gap-2">
				<div>
					<p class="text-sm font-semibold text-primary">Copy your new key</p>
					<p class="mt-0.5 text-xs text-muted">This is the only time the full secret is shown.</p>
				</div>
				<Badge size="sm" variant="success">New</Badge>
			</div>
			<div
				class="flex flex-col gap-2 rounded-xl border border-border bg-surface-elevated p-3 sm:flex-row sm:items-center sm:justify-between"
			>
				<code class="truncate font-mono text-xs text-primary sm:text-sm">{revealedSecret}</code>
				<CopyButton value={revealedSecret} size="sm" label="Copy secret" />
			</div>
			<Button
				size="sm"
				variant="ghost"
				onclick={() => {
					revealedSecret = null;
					ondismisssecret?.();
				}}
			>
				I’ve saved it
			</Button>
		</div>
	{/if}

	<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
		<div
			class="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-2">
				<span
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"
				>
					<KeyRound class="h-4 w-4" strokeWidth={2} />
				</span>
				<div>
					<p class="text-sm font-semibold text-primary">Your keys</p>
					<p class="text-[11px] text-muted">{visible.length} shown</p>
				</div>
			</div>
			<SegmentedControl
				items={[
					{ id: 'active', label: 'Active' },
					{ id: 'all', label: 'All' },
					{ id: 'revoked', label: 'Revoked' }
				]}
				bind:value={filter}
				size="sm"
			/>
		</div>

		{#if visible.length === 0}
			<div class="p-6">
				<EmptyState
					title="No API keys"
					description={filter === 'revoked'
						? 'No revoked keys in this workspace.'
						: 'Create a key to authenticate API requests.'}
					class="border-0 bg-transparent shadow-none"
				>
					{#snippet icon()}
						<KeyRound class="h-7 w-7" strokeWidth={1.75} />
					{/snippet}
					{#snippet action()}
						{#if filter !== 'revoked'}
							<Button size="sm" onclick={() => oncreate?.()}>Create key</Button>
						{/if}
					{/snippet}
				</EmptyState>
			</div>
		{:else}
			<ul class="divide-y divide-border">
				{#each visible as key (key.id)}
					{@const status = key.status ?? 'active'}
					<li class="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
						<div class="min-w-0 flex-1 space-y-2">
							<div class="flex flex-wrap items-center gap-2">
								<p class="text-sm font-semibold text-primary">{key.name}</p>
								{#if key.env}
									<Badge size="sm" variant={key.env === 'live' ? 'info' : 'secondary'}>
										{key.env}
									</Badge>
								{/if}
								<Badge size="sm" variant={status === 'revoked' ? 'error' : 'success'}>
									{status}
								</Badge>
							</div>

							<div
								class="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-surface/60 py-1 pl-2.5 pr-1"
							>
								<code class="truncate font-mono text-[11px] text-secondary sm:text-xs">
									{key.prefix}
								</code>
								<CopyButton
									value={key.copyValue ?? key.prefix}
									size="xs"
									variant="ghost"
									label="Copy"
									class="shrink-0"
								/>
							</div>

							{#if key.scopes?.length}
								<div class="flex flex-wrap gap-1">
									{#each key.scopes as scope (scope)}
										<span
											class="rounded-md bg-surface-overlay px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted"
										>
											{scope}
										</span>
									{/each}
								</div>
							{/if}

							<div class="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted">
								<span>
									Created
									<Time date={key.createdAt} format="medium" class="text-[11px] text-muted" />
								</span>
								{#if key.lastUsedAt}
									<span>
										Last used
										<Time date={key.lastUsedAt} format="datetime" class="text-[11px] text-muted" />
									</span>
								{:else if status === 'active'}
									<span>Never used</span>
								{/if}
							</div>
						</div>

						{#if status !== 'revoked'}
							<Button size="sm" variant="ghost" onclick={() => askRevoke(key.id)}>Revoke</Button>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<DangerZone
		title="Rotate all keys"
		description="Immediately invalidate every active key. Deployed services will stop authenticating until you create replacements."
		actionLabel="Rotate all"
		confirmTitle="Rotate all API keys?"
		confirmMessage="This cannot be undone. Apps using these credentials will fail until you ship new keys."
		onconfirm={rotateAll}
	>
		<div class="flex items-center gap-2 text-xs text-muted">
			<ShieldAlert class="h-3.5 w-3.5 text-red-500" strokeWidth={2} />
			{activeCount} active {activeCount === 1 ? 'key' : 'keys'} will be revoked
		</div>
	</DangerZone>
</div>

<ConfirmDialog
	bind:open={revokeOpen}
	title="Revoke API key?"
	description={revokeTarget
		? `“${revokeTarget.name}” will stop working immediately. This cannot be undone.`
		: 'This key will stop working immediately.'}
	confirmLabel="Revoke key"
	onconfirm={confirmRevoke}
	oncancel={() => {
		revokeId = null;
	}}
	onclose={() => {
		revokeId = null;
	}}
/>
