<script lang="ts">
	import ConfirmDialog from './ConfirmDialog.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		title?: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		confirmLoading?: boolean;
	}>();

	let open = $state(false);
	let result = $state<string | null>(null);
</script>

<div class="flex flex-col items-start gap-4 p-6">
	<Button variant="destructive" onclick={() => (open = true)}>
		Delete Item
	</Button>

	{#if result}
		<p class="text-sm text-secondary">Last action: <span class="font-semibold text-primary">{result}</span></p>
	{/if}

	<ConfirmDialog
		bind:open
		title={props.title ?? 'Delete Item'}
		description={props.description ?? 'Are you sure you want to delete this item? This action cannot be undone.'}
		confirmLabel={props.confirmLabel ?? 'Delete'}
		cancelLabel={props.cancelLabel ?? 'Cancel'}
		confirmLoading={props.confirmLoading ?? false}
		onconfirm={() => { result = 'confirmed'; }}
		oncancel={() => { result = 'cancelled'; }}
	/>
</div>
