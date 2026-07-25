<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';
	import Time from '$lib/components/atoms/Time/Time.svelte';
	import CopyButton from '$lib/components/molecules/CopyButton/CopyButton.svelte';
	import Webhook from '@lucide/svelte/icons/webhook';

	export type WebhookStatus = 'active' | 'disabled' | 'failing';

	export interface WebhookEndpoint {
		id: string;
		url: string;
		description?: string;
		events?: string[];
		status?: WebhookStatus;
		secretHint?: string;
		lastDeliveryAt?: Date | string | number;
		successRate?: number;
	}

	interface WebhookCardProps {
		webhook: WebhookEndpoint;
		class?: string;
		ontest?: (id: string) => void;
		onedit?: (id: string) => void;
		ontoggle?: (id: string, enabled: boolean) => void;
	}

	const STATUS: Record<
		WebhookStatus,
		{ label: string; variant: 'success' | 'secondary' | 'error'; dot: 'online' | 'offline' | 'busy' }
	> = {
		active: { label: 'Active', variant: 'success', dot: 'online' },
		disabled: { label: 'Disabled', variant: 'secondary', dot: 'offline' },
		failing: { label: 'Failing', variant: 'error', dot: 'busy' }
	};

	let { webhook, class: className = '', ontest, onedit, ontoggle }: WebhookCardProps = $props();

	const meta = $derived(STATUS[webhook.status ?? 'active']);
	const previewEvents = $derived((webhook.events ?? []).slice(0, 3));
</script>

<article
	class={[
		'w-full rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm',
		className
	]}
>
	<div class="flex items-start gap-3">
		<span
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"
		>
			<Webhook class="h-5 w-5" strokeWidth={2} />
		</span>
		<div class="min-w-0 flex-1 space-y-2">
			<div class="flex flex-wrap items-center gap-2">
				<p class="truncate font-mono text-sm font-semibold text-primary">{webhook.url}</p>
				<span class="inline-flex items-center gap-1.5">
					<StatusDot status={meta.dot} size="sm" />
					<Badge size="sm" variant={meta.variant}>{meta.label}</Badge>
				</span>
			</div>
			{#if webhook.description}
				<p class="text-xs text-muted">{webhook.description}</p>
			{/if}
			{#if previewEvents.length}
				<div class="flex flex-wrap gap-1">
					{#each previewEvents as ev (ev)}
						<Badge size="sm" variant="secondary">{ev}</Badge>
					{/each}
					{#if (webhook.events?.length ?? 0) > previewEvents.length}
						<span class="text-[11px] text-muted"
							>+{(webhook.events?.length ?? 0) - previewEvents.length}</span
						>
					{/if}
				</div>
			{/if}
			<p class="text-[11px] text-muted">
				{#if webhook.lastDeliveryAt}
					Last delivery
					<Time date={webhook.lastDeliveryAt} format="datetime" class="text-[11px] text-muted" />
				{:else}
					No deliveries yet
				{/if}
				{#if webhook.successRate !== undefined}
					· {Math.round(webhook.successRate * 100)}% ok
				{/if}
				{#if webhook.secretHint}
					· secret {webhook.secretHint}
				{/if}
			</p>
		</div>
	</div>

	<div class="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
		<CopyButton value={webhook.url} label="Copy URL" size="xs" variant="ghost" />
		{#if ontest}
			<Button size="xs" variant="ghost" onclick={() => ontest?.(webhook.id)}>Send test</Button>
		{/if}
		{#if onedit}
			<Button size="xs" variant="ghost" onclick={() => onedit?.(webhook.id)}>Edit</Button>
		{/if}
		{#if ontoggle}
			<Button
				size="xs"
				variant="outline"
				onclick={() => ontoggle?.(webhook.id, (webhook.status ?? 'active') === 'disabled')}
			>
				{(webhook.status ?? 'active') === 'disabled' ? 'Enable' : 'Disable'}
			</Button>
		{/if}
	</div>
</article>
