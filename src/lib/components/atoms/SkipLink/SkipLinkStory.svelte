<script lang="ts">
	import SkipLink from './SkipLink.svelte';
</script>

<div class="space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="text-sm text-muted">Tab once to reveal the skip link (focus it).</p>
	<SkipLink href="#main-demo" />
	<main id="main-demo" class="rounded-xl bg-surface-overlay p-4 text-sm text-secondary">
		Main content target
	</main>
</div>
