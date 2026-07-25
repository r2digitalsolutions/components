<script lang="ts">
	import CookieConsent from './CookieConsent.svelte';

	let props = $props<{
		variant?: 'bar' | 'card';
	}>();

	let key = $state(0);
	let lastAction = $state<string | null>(null);

	function reset() {
		key += 1;
		lastAction = null;
	}
</script>

<div class="w-full max-w-3xl space-y-3">
	<div class="flex items-center justify-between gap-3">
		<p class="text-sm text-muted">
			{#if lastAction}
				Last action: <span class="font-medium text-primary">{lastAction}</span>
			{:else}
				Preview uses <code class="text-xs">placement="static"</code> so it stays fully visible in Storybook.
			{/if}
		</p>
		<button
			type="button"
			class="rounded-lg border border-border bg-surface-elevated px-2.5 py-1 text-xs font-medium text-secondary hover:bg-surface-overlay"
			onclick={reset}
		>
			Reset banner
		</button>
	</div>

	<div class="overflow-hidden rounded-2xl border border-border bg-surface-overlay shadow-sm">
		<div class="border-b border-border bg-surface-elevated px-5 py-4">
			<p class="text-sm font-medium text-primary">Your product</p>
			<p class="text-sm text-muted">Page content sits above the consent banner.</p>
		</div>

		<div class="grid gap-3 p-5 sm:grid-cols-3">
			{#each ['Analytics', 'Projects', 'Billing'] as card (card)}
				<div class="rounded-xl border border-border bg-surface-elevated px-3 py-4 text-sm text-muted">
					{card}
				</div>
			{/each}
		</div>

		{#key key}
			<CookieConsent
				placement="static"
				variant={props.variant ?? 'bar'}
				policyHref="#"
				showCustomize
				onaccept={() => (lastAction = 'Accept all')}
				onreject={() => (lastAction = 'Reject non-essential')}
				oncustomize={() => (lastAction = 'Manage')}
			/>
		{/key}
	</div>
</div>
