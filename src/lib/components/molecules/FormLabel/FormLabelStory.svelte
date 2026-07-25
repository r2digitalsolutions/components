<script lang="ts">
	import FormLabel from './FormLabel.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
</script>

<div class="max-w-sm space-y-2 rounded-2xl border border-border bg-surface-elevated p-4">
	<FormLabel for="demo" required>Email</FormLabel>
	<input
		id="demo"
		type="email"
		class="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-sm text-primary"
		placeholder="you@example.com"
	/>
	<FormDescription text="We'll never share your email." />
</div>
