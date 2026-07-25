<script lang="ts">
	import type { Snippet } from 'svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import UnsavedChanges from '$lib/components/molecules/UnsavedChanges/UnsavedChanges.svelte';

	interface ActionBarProps {
		submitLabel?: string;
		cancelLabel?: string;
		loading?: boolean;
		disabled?: boolean;
		dirty?: boolean;
		message?: string;
		sticky?: boolean;
		class?: string;
		extra?: Snippet;
		onsubmit?: () => void;
		oncancel?: () => void;
	}

	const {
		submitLabel = 'Save changes',
		cancelLabel = 'Discard',
		loading = false,
		disabled = false,
		dirty = false,
		message = 'You have unsaved changes',
		sticky = true,
		class: className = '',
		extra,
		onsubmit,
		oncancel
	}: ActionBarProps = $props();
</script>

<!-- Registers beforeunload when dirty; banner suppressed for compact bar UI -->
<UnsavedChanges {dirty} showBanner={false} />

<div
	class={[
		'w-full border-t border-border bg-surface-elevated/95 backdrop-blur',
		sticky && 'sticky bottom-0 z-20',
		className
	]}
>
	<div class="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
		<p class={['text-xs', dirty ? 'font-medium text-amber-700 dark:text-amber-400' : 'text-muted']}>
			{dirty ? message : 'All changes saved'}
		</p>

		<FormActions
			{submitLabel}
			{cancelLabel}
			{loading}
			disabled={disabled || (!dirty && !loading)}
			align="end"
			{onsubmit}
			{oncancel}
		>
			{#snippet extra()}
				{#if extra}
					{@render extra()}
				{/if}
			{/snippet}
		</FormActions>
	</div>
</div>
