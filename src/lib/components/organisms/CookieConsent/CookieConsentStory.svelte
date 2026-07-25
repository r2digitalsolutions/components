<script lang="ts">
	import CookieConsent from './CookieConsent.svelte';

	let props = $props<{
		variant?: 'bar' | 'card';
	}>();

	let accepted = $state<string | null>(null);
</script>

<div class="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border shadow-sm">
	<div class="space-y-2 bg-surface-elevated p-6">
		<p class="text-sm font-medium text-primary">App shell preview</p>
		<p class="text-sm text-muted">
			The consent UI sits at the bottom. Choose Accept / Reject to try it.
			{#if accepted}
				<span class="ml-1 font-medium text-brand-600 dark:text-brand-400">Last action: {accepted}</span>
			{/if}
		</p>
	</div>

	<!-- Tall enough that the full banner is visible -->
	<div class="relative min-h-[28rem] bg-surface-overlay">
		<div class="grid gap-3 p-6 sm:grid-cols-3">
			{#each ['Analytics', 'Projects', 'Billing'] as card (card)}
				<div class="h-24 rounded-xl border border-border bg-surface-elevated p-3 text-sm text-muted">
					{card}
				</div>
			{/each}
		</div>

		<CookieConsent
			placement="absolute"
			variant={props.variant ?? 'bar'}
			position="bottom"
			policyHref="#"
			showCustomize
			onaccept={() => (accepted = 'Accept all')}
			onreject={() => (accepted = 'Reject non-essential')}
			oncustomize={() => (accepted = 'Manage preferences')}
		/>
	</div>
</div>
