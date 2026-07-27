<script lang="ts">
	import SessionPresenceBadge from './SessionPresenceBadge.svelte';
	import type { SessionPresence } from './SessionPresenceBadge.svelte';
	import { pageVisibility } from '$lib/utils/pageVisibility.svelte.js';
	import { network } from '$lib/utils/network.svelte.js';

	let lastPresence = $state<SessionPresence>('active');

	function reset() {
		network.setForced(null);
		pageVisibility.setForced(null);
	}

	function setOffline() {
		network.setForced(false);
		pageVisibility.setForced(null);
	}

	function setAway() {
		network.setForced(true);
		pageVisibility.setForced('hidden');
	}

	function setActive() {
		network.setForced(true);
		pageVisibility.setForced('visible');
	}
</script>

<div class="max-w-sm space-y-4">
	<div class="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated p-4">
		<span class="text-sm font-medium text-primary">Session</span>
		<SessionPresenceBadge onchange={(p) => (lastPresence = p)} />
	</div>

	<p class="text-xs text-muted">
		Live state from page visibility and network. Last reported: <strong>{lastPresence}</strong>
	</p>

	<div class="flex flex-wrap gap-2">
		<button
			type="button"
			class="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface-overlay"
			onclick={setActive}
		>
			Simulate active
		</button>
		<button
			type="button"
			class="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface-overlay"
			onclick={setAway}
		>
			Simulate away
		</button>
		<button
			type="button"
			class="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface-overlay"
			onclick={setOffline}
		>
			Simulate offline
		</button>
		<button
			type="button"
			class="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface-overlay"
			onclick={reset}
		>
			Reset (live)
		</button>
	</div>
</div>
