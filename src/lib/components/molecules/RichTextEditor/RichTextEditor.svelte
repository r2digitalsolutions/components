<script lang="ts">
	import Toolbar from '$lib/components/molecules/Toolbar/Toolbar.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Surface from '$lib/components/atoms/Surface/Surface.svelte';

	interface RichTextEditorProps {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		minHeight?: string;
		class?: string;
		onchange?: (html: string) => void;
	}

	let {
		value = $bindable('<p></p>'),
		placeholder = 'Write something…',
		disabled = false,
		minHeight = '10rem',
		class: className = '',
		onchange
	}: RichTextEditorProps = $props();

	let editorEl = $state<HTMLDivElement | null>(null);

	function cmd(command: string, arg?: string) {
		if (disabled) return;
		document.execCommand(command, false, arg);
		sync();
	}

	function sync() {
		if (!editorEl) return;
		value = editorEl.innerHTML;
		onchange?.(value);
	}

	$effect(() => {
		if (!editorEl) return;
		if (editorEl.innerHTML !== value) editorEl.innerHTML = value || '<p></p>';
	});
</script>

<Surface variant="elevated" padding="none" radius="xl" class={['overflow-hidden', className].filter(Boolean).join(' ')}>
	<Toolbar class="border-b border-border px-2 py-1.5" dense>
		<div class="flex flex-wrap items-center gap-1">
			<IconButton label="Bold" size="sm" disabled={disabled} onclick={() => cmd('bold')}>
				<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h6a4 4 0 010 8H7V5zm0 10h7a4 4 0 010 8H7v-8z" /></svg>
			</IconButton>
			<IconButton label="Italic" size="sm" disabled={disabled} onclick={() => cmd('italic')}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 4h8M6 20h8M14 4l-4 16" /></svg>
			</IconButton>
			<IconButton label="Underline" size="sm" disabled={disabled} onclick={() => cmd('underline')}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 4v7a5 5 0 0010 0V4M5 20h14" /></svg>
			</IconButton>
			<span class="mx-1 h-5 w-px bg-border" aria-hidden="true"></span>
			<IconButton label="Bullet list" size="sm" disabled={disabled} onclick={() => cmd('insertUnorderedList')}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>
			</IconButton>
			<IconButton
				label="Link"
				size="sm"
				disabled={disabled}
				onclick={() => {
					const url = window.prompt('URL');
					if (url) cmd('createLink', url);
				}}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
			</IconButton>
		</div>
	</Toolbar>

	<div
		bind:this={editorEl}
		class={[
			'prose-editor px-3 py-3 text-sm text-primary outline-none',
			'empty:before:pointer-events-none empty:before:text-muted empty:before:content-[attr(data-placeholder)]',
			disabled && 'pointer-events-none opacity-60'
		]}
		style:min-height={minHeight}
		contenteditable={!disabled}
		role="textbox"
		aria-multiline="true"
		data-placeholder={placeholder}
		oninput={sync}
		onblur={sync}
	></div>
</Surface>

<style>
	.prose-editor :global(ul) {
		list-style: disc;
		padding-left: 1.25rem;
	}
	.prose-editor :global(a) {
		color: var(--color-brand-600, #4f46e5);
		text-decoration: underline;
	}
</style>
