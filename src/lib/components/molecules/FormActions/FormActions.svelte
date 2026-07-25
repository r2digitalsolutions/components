<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface FormActionsProps {
		submitLabel?: string;
		cancelLabel?: string;
		/** Optional destructive action on the left (e.g. Delete) */
		dangerLabel?: string;
		loading?: boolean;
		disabled?: boolean;
		/** Disable only the primary submit control (e.g. wizard validation) */
		submitDisabled?: boolean;
		/** Stretch buttons on small screens */
		fullWidth?: boolean;
		align?: 'start' | 'end' | 'between';
		showCancel?: boolean;
		/**
		 * plain = bare row
		 * bar = bordered footer chrome inside a card
		 * sticky = pinned footer; place next to a `flex-1 overflow-y-auto` body
		 */
		variant?: 'plain' | 'bar' | 'sticky';
		size?: 'sm' | 'md';
		/** Hint text on the left (saved status, helper) */
		hint?: string;
		class?: string;
		extra?: Snippet;
		onsubmit?: () => void;
		oncancel?: () => void;
		ondanger?: () => void;
	}

	const {
		submitLabel = 'Save',
		cancelLabel = 'Cancel',
		dangerLabel,
		loading = false,
		disabled = false,
		submitDisabled = false,
		fullWidth = true,
		align = 'end',
		showCancel = true,
		variant = 'bar',
		size = 'md',
		hint = '',
		class: className = '',
		extra,
		onsubmit,
		oncancel,
		ondanger
	}: FormActionsProps = $props();

	const alignClasses: Record<'start' | 'end' | 'between', string> = {
		start: 'justify-start',
		end: 'justify-end',
		between: 'justify-between'
	};

	const busy = $derived(loading || disabled);
</script>

<div
	class={[
		'flex w-full flex-col gap-3 sm:flex-row sm:items-center',
		alignClasses[align],
		variant === 'bar' &&
			'rounded-b-2xl border-t border-border bg-surface/50 px-4 py-3 sm:px-5',
		variant === 'sticky' &&
			'shrink-0 border-t border-border bg-surface-elevated/95 px-4 py-3 shadow-[0_-8px_24px_rgb(0,0,0,0.06)] backdrop-blur-md dark:shadow-black/30 sm:px-5',
		variant === 'plain' && 'gap-2',
		className
	]}
	role="group"
	aria-label="Form actions"
>
	{#if hint || extra || dangerLabel}
		<div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
			{#if dangerLabel}
				<Button
					type="button"
					variant="ghost"
					{size}
					disabled={busy}
					class="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
					onclick={() => ondanger?.()}
				>
					{dangerLabel}
				</Button>
			{/if}
			{#if extra}
				{@render extra()}
			{/if}
			{#if hint}
				<p class="text-xs text-muted">{hint}</p>
			{/if}
		</div>
	{:else if align === 'between'}
		<div class="hidden flex-1 sm:block" aria-hidden="true"></div>
	{/if}

	<div
		class={[
			'flex items-center gap-2',
			fullWidth && 'w-full flex-col-reverse sm:w-auto sm:flex-row'
		]}
	>
		{#if showCancel}
			<Button
				type="button"
				variant="secondary"
				{size}
				disabled={busy}
				class={fullWidth ? 'w-full sm:w-auto' : ''}
				onclick={() => oncancel?.()}
			>
				{cancelLabel}
			</Button>
		{/if}
		<Button
			type="submit"
			{size}
			{loading}
			disabled={busy || submitDisabled}
			class={fullWidth ? 'w-full sm:w-auto' : ''}
			onclick={() => onsubmit?.()}
		>
			{submitLabel}
		</Button>
	</div>
</div>
