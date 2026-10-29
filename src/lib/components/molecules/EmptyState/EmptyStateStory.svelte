<script lang="ts">
	import EmptyState from './EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		title?: string;
		description?: string;
		eyebrow?: string;
		hint?: string;
		variant?: 'dashed' | 'card' | 'plain';
		size?: 'sm' | 'md' | 'lg';
		background?: 'none' | 'gradient';
		iconStyle?: 'soft' | 'elevated';
		showAction?: boolean;
		customIcon?: boolean;
	}>();
</script>

<div class={props.size === 'lg' ? 'w-[40rem] max-w-full' : 'w-96 max-w-full'}>
	<EmptyState
		title={props.title ?? 'No invoices found'}
		description={props.description ?? 'You haven’t created any invoices yet. Create your first invoice to get started.'}
		eyebrow={props.eyebrow}
		hint={props.hint}
		variant={props.variant}
		size={props.size}
		background={props.background}
		iconStyle={props.iconStyle}
	>
		{#snippet icon()}
			{#if props.customIcon}
				<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5m-9 6 3-3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v13Z" />
				</svg>
			{:else}
				<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
					<path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
				</svg>
			{/if}
		{/snippet}
		{#snippet action()}
			{#if props.showAction !== false}
				<Button variant="primary" size="sm">Create Invoice</Button>
			{/if}
		{/snippet}
	</EmptyState>
</div>
