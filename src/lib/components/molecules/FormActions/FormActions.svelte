<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import { getFormContext } from '$lib/utils/formContext.js';
	import { i18n } from '$lib/utils/i18n.svelte.js';

	interface FormActionsProps {
		submitLabel?: string;
		cancelLabel?: string;
		/** Optional destructive action on the left (e.g. Delete) */
		dangerLabel?: string;
		/** When omitted, inherits `loading` from nearest `<Form>` context */
		loading?: boolean;
		disabled?: boolean;
		/** Disable only the primary submit control (e.g. wizard validation) */
		submitDisabled?: boolean;
		/** Stretch buttons on small screens */
		fullWidth?: boolean;
		align?: 'start' | 'end' | 'between';
		showCancel?: boolean;
		/** Hide the primary submit control (e.g. file-upload step that auto-advances). */
		showSubmit?: boolean;
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
		submitLabel,
		cancelLabel,
		dangerLabel,
		loading,
		disabled = false,
		submitDisabled = false,
		fullWidth = true,
		align = 'end',
		showCancel = true,
		showSubmit = true,
		variant = 'bar',
		size = 'md',
		hint = '',
		class: className = '',
		extra,
		onsubmit,
		oncancel,
		ondanger
	}: FormActionsProps = $props();

	const form = getFormContext();
	const resolvedSubmitLabel = $derived(submitLabel ?? i18n.t('save'));
	const resolvedCancelLabel = $derived(cancelLabel ?? i18n.t('cancel'));
	const resolvedLoading = $derived(loading ?? form?.loading ?? false);
	const busy = $derived(resolvedLoading || disabled || Boolean(form?.disabled));

	const alignClasses: Record<'start' | 'end' | 'between', string> = {
		start: 'justify-start',
		end: 'justify-end',
		between: 'justify-between'
	};
</script>

<div
	class={[
		'gap-3 sm:flex-row sm:items-center flex w-full flex-col',
		alignClasses[align],
		variant === 'bar' && 'rounded-b-2xl border-border bg-surface/50 px-4 py-3 sm:px-5 border-t',
		variant === 'sticky' &&
			'border-border bg-surface-elevated/95 px-4 py-3 backdrop-blur-md dark:shadow-black/30 sm:px-5 shrink-0 border-t shadow-[0_-8px_24px_rgb(0,0,0,0.06)]',
		variant === 'plain' && 'gap-2',
		className
	]}
	role="group"
	aria-label="Form actions"
>
	{#if hint || extra || dangerLabel}
		<div class="min-w-0 gap-2 flex flex-1 flex-wrap items-center">
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
		<div class="sm:block hidden flex-1" aria-hidden="true"></div>
	{/if}

	<div
		class={[
			'gap-2 flex items-center',
			fullWidth && 'sm:w-auto sm:flex-row w-full flex-col-reverse'
		]}
	>
		{#if showCancel}
			<Button
				type="button"
				variant="secondary"
				{size}
				disabled={busy}
				class={fullWidth ? 'sm:w-auto w-full' : ''}
				onclick={() => oncancel?.()}
			>
				{resolvedCancelLabel}
			</Button>
		{/if}
		{#if showSubmit}
			<Button
				type="submit"
				{size}
				loading={resolvedLoading}
				disabled={busy || submitDisabled}
				class={fullWidth ? 'sm:w-auto w-full' : ''}
				onclick={() => onsubmit?.()}
			>
				{resolvedSubmitLabel}
			</Button>
		{/if}
	</div>
</div>
