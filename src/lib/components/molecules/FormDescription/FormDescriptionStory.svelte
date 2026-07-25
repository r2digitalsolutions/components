<script lang="ts">
	import FormDescription from './FormDescription.svelte';
</script>

<div class="max-w-sm space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
	<FormDescription text="Muted helper text under a field." />
	<FormDescription text="Informational note." tone="info" />
	<FormDescription text="Something went wrong." tone="error" />
</div>
