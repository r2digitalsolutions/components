<script lang="ts">
	import StatusPage from '$lib/components/organisms/StatusPage/StatusPage.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import type { Snippet } from 'svelte';

	interface MaintenancePageProps {
		title?: string;
		description?: string;
		eta?: string;
		primaryLabel?: string;
		secondaryLabel?: string;
		statusLabel?: string;
		class?: string;
		extra?: Snippet;
		onprimary?: () => void;
		onsecondary?: () => void;
	}

	const {
		title = 'Under maintenance',
		description = 'We are performing scheduled upgrades. The service will be back shortly.',
		eta,
		primaryLabel = 'Check status',
		secondaryLabel = 'Contact support',
		statusLabel = 'Maintenance',
		class: className = '',
		extra,
		onprimary,
		onsecondary
	}: MaintenancePageProps = $props();
</script>

<StatusPage
	status="warning"
	{title}
	{description}
	{primaryLabel}
	{secondaryLabel}
	class={className}
	{onprimary}
	{onsecondary}
>
	{#snippet extra()}
		<div class="mx-auto mt-3 flex w-full max-w-sm flex-col items-center gap-3">
			<Badge variant="warning" rounded dot>{statusLabel}</Badge>
			{#if eta}
				<p class="text-center text-xs text-secondary">
					Expected back: <span class="font-medium text-primary">{eta}</span>
				</p>
			{/if}
			{#if extra}{@render extra()}{/if}
		</div>
	{/snippet}
</StatusPage>
