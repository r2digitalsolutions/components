<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Kbd from '$lib/components/atoms/Kbd/Kbd.svelte';

	interface CommentComposerProps {
		value?: string;
		placeholder?: string;
		avatar?: string;
		name?: string;
		submitLabel?: string;
		cancelLabel?: string;
		showCancel?: boolean;
		loading?: boolean;
		disabled?: boolean;
		rows?: number;
		maxLength?: number;
		/** Show ⌘/Ctrl+Enter hint */
		showShortcut?: boolean;
		class?: string;
		/** Extra actions left of the submit row (emoji, attach, …) */
		toolbar?: Snippet;
		onsubmit?: (value: string) => void;
		oncancel?: () => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Write a comment…',
		avatar,
		name = 'You',
		submitLabel = 'Comment',
		cancelLabel = 'Cancel',
		showCancel = false,
		loading = false,
		disabled = false,
		rows = 2,
		maxLength,
		showShortcut = true,
		class: className = '',
		toolbar,
		onsubmit,
		oncancel
	}: CommentComposerProps = $props();

	let focused = $state(false);
	let textareaEl = $state<HTMLTextAreaElement | null>(null);

	const canSubmit = $derived(value.trim().length > 0 && !loading && !disabled);
	const isMac =
		typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

	function resize() {
		if (!textareaEl) return;
		textareaEl.style.height = 'auto';
		textareaEl.style.height = `${Math.min(textareaEl.scrollHeight, 240)}px`;
	}

	function submit() {
		const trimmed = value.trim();
		if (!trimmed || loading || disabled) return;
		onsubmit?.(trimmed);
		value = '';
		queueMicrotask(resize);
	}

	function cancel() {
		value = '';
		oncancel?.();
		queueMicrotask(resize);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			submit();
		}
	}

	$effect(() => {
		void value;
		resize();
	});
</script>

<div class={['flex gap-3', className]}>
	<Avatar src={avatar} {name} size="sm" class="mt-0.5 shrink-0" />

	<div
		class={[
			'min-w-0 flex-1 overflow-hidden rounded-xl border bg-surface-elevated transition-shadow',
			focused
				? 'border-brand-500/50 shadow-[0_0_0_3px] shadow-brand-500/15'
				: 'border-border hover:border-border-strong'
		]}
	>
		<textarea
			bind:this={textareaEl}
			bind:value
			{placeholder}
			{disabled}
			{rows}
			maxlength={maxLength}
			aria-label={placeholder}
			class={[
				'block w-full resize-none bg-transparent px-3.5 pt-3 pb-2 text-sm leading-relaxed text-primary',
				'placeholder:text-muted outline-none disabled:cursor-not-allowed disabled:opacity-50'
			]}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
			onkeydown={onKeydown}
			oninput={resize}
		></textarea>

		<div
			class={[
				'flex flex-wrap items-center gap-2 border-t px-2.5 py-2',
				focused ? 'border-brand-500/20 bg-brand-500/[0.03]' : 'border-border/80 bg-surface-overlay/40'
			]}
		>
			{#if toolbar}
				<div class="flex items-center gap-0.5">
					{@render toolbar()}
				</div>
			{/if}

			{#if showShortcut}
				<p class="hidden items-center gap-1.5 text-[11px] text-muted sm:flex">
					<span>Press</span>
					<Kbd size="sm">{isMac ? '⌘' : 'Ctrl'}</Kbd>
					<Kbd size="sm">Enter</Kbd>
				</p>
			{/if}

			<div class="ml-auto flex items-center gap-1.5">
				{#if maxLength !== undefined}
					<span
						class={[
							'mr-0.5 font-mono text-[10px] tabular-nums',
							value.length >= maxLength ? 'text-red-500' : 'text-muted'
						]}
					>
						{value.length}/{maxLength}
					</span>
				{/if}

				{#if showCancel}
					<Button size="xs" variant="ghost" {disabled} onclick={cancel}>
						{cancelLabel}
					</Button>
				{/if}

				<Button size="xs" {loading} disabled={!canSubmit} onclick={submit}>
					{submitLabel}
				</Button>
			</div>
		</div>
	</div>
</div>
