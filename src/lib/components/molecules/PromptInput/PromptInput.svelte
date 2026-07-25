<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface PromptInputProps {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		loading?: boolean;
		submitLabel?: string;
		maxRows?: number;
		/** Suggested prompts shown above the input */
		suggestions?: string[];
		class?: string;
		leading?: Snippet;
		trailing?: Snippet;
		onsubmit?: (value: string) => void;
		onstop?: () => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Ask anything…',
		disabled = false,
		loading = false,
		submitLabel = 'Send',
		maxRows = 6,
		suggestions = [],
		class: className = '',
		leading,
		trailing,
		onsubmit,
		onstop
	}: PromptInputProps = $props();

	let textareaEl: HTMLTextAreaElement | undefined = $state();

	const canSubmit = $derived(!disabled && !loading && value.trim().length > 0);

	function resize() {
		if (!textareaEl) return;
		textareaEl.style.height = 'auto';
		const lineHeight = 20;
		const max = lineHeight * maxRows + 16;
		textareaEl.style.height = `${Math.min(textareaEl.scrollHeight, max)}px`;
	}

	function submit() {
		if (!canSubmit) return;
		onsubmit?.(value.trim());
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	$effect(() => {
		value;
		requestAnimationFrame(resize);
	});
</script>

<div class={['flex flex-col gap-2', className]}>
	{#if suggestions.length > 0 && !value}
		<div class="flex flex-wrap gap-1.5">
			{#each suggestions as s (s)}
				<button
					type="button"
					class="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-secondary transition-colors hover:border-brand-400 hover:text-primary"
					onclick={() => (value = s)}
				>
					{s}
				</button>
			{/each}
		</div>
	{/if}

	<div
		class="flex items-end gap-2 rounded-2xl border border-border bg-surface-elevated p-2 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"
	>
		{#if leading}
			<div class="shrink-0 pb-1.5 pl-1">{@render leading()}</div>
		{/if}

		<textarea
			bind:this={textareaEl}
			class="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-primary placeholder:text-muted focus:outline-none"
			rows="1"
			{placeholder}
			{disabled}
			{value}
			oninput={(e) => {
				value = (e.currentTarget as HTMLTextAreaElement).value;
				resize();
			}}
			onkeydown={onKeydown}
			aria-label="Prompt"
		></textarea>

		{#if trailing}
			<div class="shrink-0 pb-1">{@render trailing()}</div>
		{/if}

		{#if loading}
			<Button variant="secondary" size="sm" onclick={() => onstop?.()}>Stop</Button>
		{:else}
			<Button variant="primary" size="sm" disabled={!canSubmit} onclick={submit}>
				{submitLabel}
			</Button>
		{/if}
	</div>

	<p class="px-1 text-[11px] text-muted">Enter to send · Shift+Enter for newline</p>
</div>
