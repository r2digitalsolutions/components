<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ButtonGroup from '$lib/components/molecules/ButtonGroup/ButtonGroup.svelte';

	interface FormActionsProps {
		submitLabel?: string;
		cancelLabel?: string;
		loading?: boolean;
		disabled?: boolean;
		/** Stretch actions to full width on mobile */
		fullWidth?: boolean;
		align?: 'start' | 'end' | 'between';
		showCancel?: boolean;
		class?: string;
		extra?: Snippet;
		onsubmit?: () => void;
		oncancel?: () => void;
	}

	const {
		submitLabel = 'Save',
		cancelLabel = 'Cancel',
		loading = false,
		disabled = false,
		fullWidth = false,
		align = 'end',
		showCancel = true,
		class: className = '',
		extra,
		onsubmit,
		oncancel
	}: FormActionsProps = $props();

	const alignClasses: Record<'start' | 'end' | 'between', string> = {
		start: 'justify-start',
		end: 'justify-end',
		between: 'justify-between'
	};
</script>

<div
	class={[
		'flex flex-wrap items-center gap-2',
		fullWidth ? 'w-full flex-col-reverse sm:flex-row' : '',
		alignClasses[align],
		className
	]}
>
	{#if extra}
		<div class="mr-auto">
			{@render extra()}
		</div>
	{/if}

	<ButtonGroup
		attached={false}
		class={fullWidth ? 'w-full sm:w-auto' : ''}
		aria-label="Form actions"
	>
		{#if showCancel}
			<Button
				type="button"
				variant="secondary"
				size="sm"
				disabled={loading || disabled}
				class={fullWidth ? 'w-full sm:w-auto' : ''}
				onclick={() => oncancel?.()}
			>
				{cancelLabel}
			</Button>
		{/if}
		<Button
			type="submit"
			size="sm"
			{loading}
			{disabled}
			class={fullWidth ? 'w-full sm:w-auto' : ''}
			onclick={() => onsubmit?.()}
		>
			{submitLabel}
		</Button>
	</ButtonGroup>
</div>
