<script lang="ts">
	import EmptyState from './EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		title?: string;
		description?: string;
	}>();
</script>

<div class="w-96 max-w-full">
	<EmptyState
		title={props.title ?? 'No invoices found'}
		description={props.description ?? 'You haven’t created any invoices yet. Create your first invoice to get started.'}
	>
		{#snippet action()}
			<Button variant="primary" size="sm">Create Invoice</Button>
		{/snippet}
	</EmptyState>
</div>
