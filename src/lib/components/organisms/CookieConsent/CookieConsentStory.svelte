<script lang="ts">
	import CookieConsent from './CookieConsent.svelte';

	let {
		variant = 'bar',
		placement = 'static',
		position = 'bottom-center',
		title = 'Cookies & privacy',
		description = 'We use cookies to keep the product running and understand how it’s used. You can accept all, reject non-essential ones, or manage preferences.',
		acceptLabel = 'Accept all',
		rejectLabel = 'Reject non-essential',
		customizeLabel = 'Manage',
		policyLabel = 'Privacy policy',
		policyHref = '/privacy',
		showCustomize = true
	}: {
		variant?: 'bar' | 'card';
		placement?: 'fixed' | 'absolute' | 'static';
		position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
		title?: string;
		description?: string;
		acceptLabel?: string;
		rejectLabel?: string;
		customizeLabel?: string;
		policyLabel?: string;
		policyHref?: string;
		showCustomize?: boolean;
	} = $props();

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
				Controls → Show code. Canvas forces <code class="text-xs">static</code>; snippet uses
				<code class="text-xs">placement="{placement}"</code>.
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
			<!-- Canvas always uses static so the banner stays visible; Show code uses Controls `placement`. -->
			<CookieConsent
				{variant}
				placement="static"
				{position}
				{title}
				{description}
				{acceptLabel}
				{rejectLabel}
				{customizeLabel}
				{policyLabel}
				{policyHref}
				{showCustomize}
				onaccept={() => (lastAction = 'Accept all')}
				onreject={() => (lastAction = 'Reject non-essential')}
				oncustomize={() => (lastAction = 'Manage')}
			/>
		{/key}
	</div>
</div>
