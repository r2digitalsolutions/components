<script lang="ts">
	import FieldHint from './FieldHint.svelte';

	let props = $props<{
		text?: string;
		tone?: 'muted' | 'info' | 'success' | 'warning' | 'error';
	}>();
</script>

<div class="max-w-sm space-y-2 rounded-xl border border-border bg-surface-elevated p-4">
	<label class="block text-sm font-medium text-primary" for="demo-email">Email</label>
	<input
		id="demo-email"
		class="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary"
		placeholder="you@company.com"
	/>
	<FieldHint text={props.text ?? 'We will never share your email.'} tone={props.tone ?? 'muted'} />
</div>
