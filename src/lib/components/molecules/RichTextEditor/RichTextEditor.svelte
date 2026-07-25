<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import Strikethrough from '@lucide/svelte/icons/strikethrough';
	import Heading1 from '@lucide/svelte/icons/heading-1';
	import Heading2 from '@lucide/svelte/icons/heading-2';
	import Heading3 from '@lucide/svelte/icons/heading-3';
	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import Quote from '@lucide/svelte/icons/quote';
	import Code from '@lucide/svelte/icons/code';
	import Link2 from '@lucide/svelte/icons/link-2';
	import Unlink from '@lucide/svelte/icons/unlink';
	import Undo2 from '@lucide/svelte/icons/undo-2';
	import Redo2 from '@lucide/svelte/icons/redo-2';
	import RemoveFormatting from '@lucide/svelte/icons/remove-formatting';
	import Pilcrow from '@lucide/svelte/icons/pilcrow';

	export type RichTextEditorVariant = 'default' | 'minimal';

	interface RichTextEditorProps {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		readonly?: boolean;
		minHeight?: string;
		maxHeight?: string;
		maxLength?: number;
		showToolbar?: boolean;
		showFooter?: boolean;
		showWordCount?: boolean;
		variant?: RichTextEditorVariant;
		autofocus?: boolean;
		class?: string;
		onchange?: (html: string) => void;
		onfocus?: () => void;
		onblur?: () => void;
	}

	let {
		value = $bindable('<p></p>'),
		placeholder = 'Start writing…',
		disabled = false,
		readonly = false,
		minHeight = '12rem',
		maxHeight,
		maxLength,
		showToolbar = true,
		showFooter = true,
		showWordCount = true,
		variant = 'default',
		autofocus = false,
		class: className = '',
		onchange,
		onfocus,
		onblur
	}: RichTextEditorProps = $props();

	let editorEl = $state<HTMLDivElement | null>(null);
	let focused = $state(false);
	let linkOpen = $state(false);
	let linkUrl = $state('https://');
	let savedRange = $state<Range | null>(null);

	let active = $state({
		bold: false,
		italic: false,
		underline: false,
		strike: false,
		ul: false,
		ol: false,
		blockquote: false,
		code: false,
		h1: false,
		h2: false,
		h3: false,
		link: false
	});

	const editable = $derived(!disabled && !readonly);

	const plainText = $derived(
		value
			.replace(/<br\s*\/?>/gi, '\n')
			.replace(/<\/p>/gi, '\n')
			.replace(/<[^>]+>/g, '')
			.replace(/&nbsp;/g, ' ')
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.trim()
	);

	const isEmpty = $derived(!plainText);
	const charCount = $derived(plainText.length);
	const wordCount = $derived(
		plainText ? plainText.split(/\s+/).filter(Boolean).length : 0
	);
	const overLimit = $derived(maxLength != null && charCount > maxLength);

	function syncFromDom() {
		if (!editorEl) return;
		value = editorEl.innerHTML;
		onchange?.(value);
		refreshActive();
	}

	function refreshActive() {
		if (typeof document === 'undefined' || !editable) return;
		try {
			const block = document.queryCommandValue('formatBlock').toLowerCase();
			active = {
				bold: document.queryCommandState('bold'),
				italic: document.queryCommandState('italic'),
				underline: document.queryCommandState('underline'),
				strike: document.queryCommandState('strikeThrough'),
				ul: document.queryCommandState('insertUnorderedList'),
				ol: document.queryCommandState('insertOrderedList'),
				blockquote: block === 'blockquote',
				code: block === 'pre',
				h1: block === 'h1',
				h2: block === 'h2',
				h3: block === 'h3',
				link: document.queryCommandState('createLink') || nearestLink()
			};
		} catch {
			/* ignore when selection is outside */
		}
	}

	function nearestLink(): boolean {
		const sel = window.getSelection();
		if (!sel?.anchorNode) return false;
		let node: Node | null = sel.anchorNode;
		while (node && node !== editorEl) {
			if (node instanceof HTMLAnchorElement) return true;
			node = node.parentNode;
		}
		return false;
	}

	function focusEditor() {
		editorEl?.focus();
	}

	function cmd(command: string, arg?: string) {
		if (!editable) return;
		focusEditor();
		document.execCommand(command, false, arg);
		syncFromDom();
	}

	function formatBlock(tag: string) {
		if (!editable) return;
		focusEditor();
		const current = document.queryCommandValue('formatBlock').toLowerCase();
		document.execCommand('formatBlock', false, current === tag ? 'p' : tag);
		syncFromDom();
	}

	function saveSelection() {
		const sel = window.getSelection();
		if (sel && sel.rangeCount > 0) savedRange = sel.getRangeAt(0).cloneRange();
	}

	function restoreSelection() {
		if (!savedRange) return;
		const sel = window.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(savedRange);
	}

	function openLink() {
		if (!editable) return;
		saveSelection();
		linkUrl = 'https://';
		linkOpen = true;
	}

	function applyLink() {
		if (!linkUrl.trim()) return;
		focusEditor();
		restoreSelection();
		document.execCommand('createLink', false, linkUrl.trim());
		linkOpen = false;
		syncFromDom();
	}

	function removeLink() {
		cmd('unlink');
	}

	function onEditorKeydown(e: KeyboardEvent) {
		const meta = e.metaKey || e.ctrlKey;
		if (!meta) return;
		const k = e.key.toLowerCase();
		if (k === 'b') {
			e.preventDefault();
			cmd('bold');
		} else if (k === 'i') {
			e.preventDefault();
			cmd('italic');
		} else if (k === 'u') {
			e.preventDefault();
			cmd('underline');
		} else if (k === 'k') {
			e.preventDefault();
			openLink();
		} else if (k === 'z' && !e.shiftKey) {
			e.preventDefault();
			cmd('undo');
		} else if (k === 'z' && e.shiftKey) {
			e.preventDefault();
			cmd('redo');
		}
	}

	$effect(() => {
		if (!editorEl) return;
		if (editorEl.innerHTML !== value) {
			editorEl.innerHTML = value || '<p></p>';
		}
	});

	$effect(() => {
		if (!autofocus || !editorEl) return;
		editorEl.focus();
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		const onSel = () => {
			if (!editorEl) return;
			const sel = window.getSelection();
			if (!sel?.anchorNode) return;
			if (editorEl.contains(sel.anchorNode)) refreshActive();
		};
		document.addEventListener('selectionchange', onSel);
		return () => document.removeEventListener('selectionchange', onSel);
	});
</script>

{#snippet tool(
	label: string,
	pressed: boolean,
	onclick: () => void,
	icon: typeof Bold
)}
	{@const Icon = icon}
	<IconButton
		{label}
		size="sm"
		variant={pressed ? 'secondary' : 'ghost'}
		disabled={!editable}
		aria-pressed={pressed}
		class={pressed
			? 'rounded-md bg-brand-500/10 text-brand-700 ring-1 ring-brand-500/25 dark:text-brand-300'
			: 'rounded-md'}
		{onclick}
	>
		<Icon class="h-4 w-4" strokeWidth={2.25} />
	</IconButton>
{/snippet}

{#snippet sep()}
	<span class="mx-0.5 hidden h-5 w-px bg-border sm:block" aria-hidden="true"></span>
{/snippet}

<div
	class={[
		'overflow-hidden rounded-xl border bg-surface-elevated transition-shadow',
		focused && !disabled
			? 'border-brand-500/45 shadow-[0_0_0_3px] shadow-brand-500/10'
			: 'border-border',
		disabled && 'opacity-60',
		className
	]}
>
	{#if showToolbar && variant !== 'minimal'}
		<div
			class="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface-overlay/50 px-1.5 py-1.5"
			role="toolbar"
			aria-label="Formatting"
		>
			{@render tool('Bold', active.bold, () => cmd('bold'), Bold)}
			{@render tool('Italic', active.italic, () => cmd('italic'), Italic)}
			{@render tool('Underline', active.underline, () => cmd('underline'), Underline)}
			{@render tool('Strikethrough', active.strike, () => cmd('strikeThrough'), Strikethrough)}
			{@render sep()}
			{@render tool('Paragraph', false, () => formatBlock('p'), Pilcrow)}
			{@render tool('Heading 1', active.h1, () => formatBlock('h1'), Heading1)}
			{@render tool('Heading 2', active.h2, () => formatBlock('h2'), Heading2)}
			{@render tool('Heading 3', active.h3, () => formatBlock('h3'), Heading3)}
			{@render sep()}
			{@render tool('Bullet list', active.ul, () => cmd('insertUnorderedList'), List)}
			{@render tool('Numbered list', active.ol, () => cmd('insertOrderedList'), ListOrdered)}
			{@render tool('Quote', active.blockquote, () => formatBlock('blockquote'), Quote)}
			{@render tool('Code block', active.code, () => formatBlock('pre'), Code)}
			{@render sep()}
			{@render tool('Link', active.link, openLink, Link2)}
			{@render tool('Unlink', false, removeLink, Unlink)}
			{@render sep()}
			{@render tool('Undo', false, () => cmd('undo'), Undo2)}
			{@render tool('Redo', false, () => cmd('redo'), Redo2)}
			{@render tool('Clear formatting', false, () => cmd('removeFormat'), RemoveFormatting)}
		</div>
	{:else if showToolbar && variant === 'minimal'}
		<div
			class="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface-overlay/40 px-1.5 py-1"
			role="toolbar"
			aria-label="Formatting"
		>
			{@render tool('Bold', active.bold, () => cmd('bold'), Bold)}
			{@render tool('Italic', active.italic, () => cmd('italic'), Italic)}
			{@render tool('List', active.ul, () => cmd('insertUnorderedList'), List)}
			{@render tool('Link', active.link, openLink, Link2)}
		</div>
	{/if}

	{#if linkOpen}
		<div
			class="flex flex-wrap items-end gap-2 border-b border-border bg-surface px-3 py-2.5"
		>
			<div class="min-w-0 flex-1">
				<Input
					size="sm"
					label="Link URL"
					bind:value={linkUrl}
					placeholder="https://…"
					disabled={!editable}
				/>
			</div>
			<Button size="sm" variant="secondary" onclick={() => (linkOpen = false)}>Cancel</Button>
			<Button size="sm" disabled={!linkUrl.trim()} onclick={applyLink}>Apply</Button>
		</div>
	{/if}

	<div class="relative">
		{#if isEmpty && !focused}
			<p
				class="pointer-events-none absolute top-3 left-3.5 text-sm text-muted"
				aria-hidden="true"
			>
				{placeholder}
			</p>
		{/if}

		<div
			bind:this={editorEl}
			class={[
				'rte px-3.5 py-3 text-sm leading-relaxed text-primary outline-none',
				!editable && 'cursor-default'
			]}
			style:min-height={minHeight}
			style:max-height={maxHeight}
			style:overflow-y={maxHeight ? 'auto' : undefined}
			contenteditable={editable}
			role="textbox"
			aria-multiline="true"
			aria-label={placeholder}
			aria-disabled={disabled}
			aria-readonly={readonly}
			oninput={syncFromDom}
			onkeydown={onEditorKeydown}
			onfocus={() => {
				focused = true;
				onfocus?.();
			}}
			onblur={() => {
				focused = false;
				syncFromDom();
				onblur?.();
			}}
			onclick={refreshActive}
			onkeyup={refreshActive}
		></div>
	</div>

	{#if showFooter}
		<div
			class="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface-overlay/30 px-3 py-1.5"
		>
			{#if showWordCount}
				<p class="text-[11px] tabular-nums text-muted">
					{wordCount} word{wordCount === 1 ? '' : 's'}
					<span class="mx-1 text-border-strong">·</span>
					<span class={overLimit ? 'font-medium text-red-600 dark:text-red-400' : ''}>
						{charCount}{maxLength != null ? ` / ${maxLength}` : ''} chars
					</span>
				</p>
			{:else}
				<span></span>
			{/if}
			<p class="hidden text-[10px] text-muted sm:block">
				⌘B · ⌘I · ⌘U · ⌘K
			</p>
		</div>
	{/if}
</div>

<style>
	.rte :global(p) {
		margin: 0 0 0.65em;
	}
	.rte :global(p:last-child) {
		margin-bottom: 0;
	}
	.rte :global(h1) {
		margin: 0 0 0.4em;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.25;
	}
	.rte :global(h2) {
		margin: 0.85em 0 0.35em;
		font-size: 1.2rem;
		font-weight: 650;
		letter-spacing: -0.015em;
		line-height: 1.3;
	}
	.rte :global(h3) {
		margin: 0.75em 0 0.3em;
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.35;
	}
	.rte :global(ul) {
		list-style: disc;
		padding-left: 1.35rem;
		margin: 0 0 0.65em;
	}
	.rte :global(ol) {
		list-style: decimal;
		padding-left: 1.35rem;
		margin: 0 0 0.65em;
	}
	.rte :global(li) {
		margin: 0.15em 0;
	}
	.rte :global(blockquote) {
		margin: 0.75em 0;
		border-left: 3px solid var(--color-brand-500, #6366f1);
		padding-left: 0.85rem;
		color: var(--color-secondary, #71717a);
		font-style: italic;
	}
	.rte :global(pre) {
		margin: 0.75em 0;
		overflow-x: auto;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border, #e4e4e7);
		background: var(--color-surface-overlay, #f4f4f5);
		padding: 0.75rem 0.9rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.8rem;
		line-height: 1.5;
	}
	.rte :global(code) {
		border-radius: 0.3rem;
		background: var(--color-surface-overlay, #f4f4f5);
		padding: 0.1rem 0.35rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.85em;
	}
	.rte :global(a) {
		color: var(--color-brand-600, #4f46e5);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.rte :global(strong) {
		font-weight: 650;
	}
</style>
