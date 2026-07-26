<script lang="ts">
	import type { Snippet } from 'svelte';
	import ConfirmDialog from '$lib/components/molecules/ConfirmDialog/ConfirmDialog.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';

	interface ConfirmDeleteProps {
		open?: boolean;
		/** Entity label shown in copy, e.g. "project" */
		entity?: string;
		/** Exact name the user must type when `requireTyping` is true */
		itemName?: string;
		title?: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		confirmLoading?: boolean;
		/** Require typing `itemName` (or CONFIRM_WORD) before enabling delete */
		requireTyping?: boolean;
		confirmWord?: string;
		class?: string;
		children?: Snippet;
		onconfirm?: () => void;
		oncancel?: () => void;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		entity = 'item',
		itemName = '',
		title,
		description,
		confirmLabel = 'Delete',
		cancelLabel = 'Cancel',
		confirmLoading = false,
		requireTyping = false,
		confirmWord = 'DELETE',
		class: className = '',
		children,
		onconfirm,
		oncancel,
		onclose
	}: ConfirmDeleteProps = $props();

	let typed = $state('');

	const expected = $derived(itemName.trim() || confirmWord);
	const canConfirm = $derived(!requireTyping || typed.trim() === expected);

	const resolvedTitle = $derived(title ?? `Delete ${entity}?`);
	const resolvedDescription = $derived(
		description ??
			`This will permanently delete this ${entity}. This action cannot be undone.`
	);

	$effect(() => {
		if (!open) typed = '';
	});

	function handleConfirm() {
		if (!canConfirm || confirmLoading) return;
		onconfirm?.();
	}
</script>

<div class={className}>
	<ConfirmDialog
		bind:open
		title={resolvedTitle}
		description={resolvedDescription}
		confirmLabel={confirmLabel}
		{cancelLabel}
		{confirmLoading}
		confirmDisabled={!canConfirm}
		onconfirm={handleConfirm}
		{oncancel}
		{onclose}
	>
		{#if children}
			{@render children()}
		{/if}
		{#if requireTyping}
			<div class="mt-3 space-y-1.5">
				<p class="text-xs text-muted">
					Type <span class="font-mono font-semibold text-primary">{expected}</span> to confirm
				</p>
				<Input bind:value={typed} placeholder={expected} size="sm" />
			</div>
		{/if}
	</ConfirmDialog>
</div>
