<script lang="ts">
	import type { Snippet } from 'svelte';
	import Dialog from '$lib/components/organisms/Dialog/Dialog.svelte';

	interface ConfirmDialogProps {
		open?: boolean;
		title?: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		confirmLoading?: boolean;
		confirmDisabled?: boolean;
		children?: Snippet;
		onconfirm?: () => void;
		oncancel?: () => void;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		title,
		description,
		confirmLabel = 'Delete',
		cancelLabel = 'Cancel',
		confirmLoading = false,
		confirmDisabled = false,
		children,
		onconfirm,
		oncancel,
		onclose
	}: ConfirmDialogProps = $props();
</script>

<Dialog
	bind:open
	{title}
	{description}
	{confirmLabel}
	{cancelLabel}
	{confirmLoading}
	{confirmDisabled}
	tone="danger"
	confirmVariant="destructive"
	size="sm"
	{onconfirm}
	{oncancel}
	{onclose}
>
	{#if children}
		{@render children()}
	{/if}
</Dialog>
