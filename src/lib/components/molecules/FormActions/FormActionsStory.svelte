<script lang="ts">
	import FormActions from './FormActions.svelte';

	let props = $props<{
		submitLabel?: string;
		cancelLabel?: string;
		loading?: boolean;
		align?: 'start' | 'end' | 'between';
	}>();

	let last = $state('');
</script>

<div class="max-w-md space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="text-sm text-muted">Form footer actions</p>
	<FormActions
		submitLabel={props.submitLabel ?? 'Save changes'}
		cancelLabel={props.cancelLabel ?? 'Cancel'}
		loading={props.loading ?? false}
		align={props.align ?? 'end'}
		onsubmit={() => (last = 'submit')}
		oncancel={() => (last = 'cancel')}
	/>
	{#if last}
		<p class="text-xs text-muted">Last action: {last}</p>
	{/if}
</div>
