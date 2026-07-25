<script lang="ts">
	import { renderMarkdown } from '$lib/utils/markdown.js';

	type MarkdownSize = 'sm' | 'md' | 'lg';

	interface MarkdownPreviewProps {
		source?: string;
		/** Visual density / type scale */
		size?: MarkdownSize;
		/** Card chrome around content */
		framed?: boolean;
		/** Shown when source is empty */
		emptyText?: string;
		class?: string;
	}

	let {
		source = '',
		size = 'md',
		framed = false,
		emptyText = 'Nothing to preview',
		class: className = ''
	}: MarkdownPreviewProps = $props();

	const html = $derived(renderMarkdown(source));
	const isEmpty = $derived(!source.trim());

	const sizeClass: Record<MarkdownSize, string> = {
		sm: 'md-size-sm',
		md: 'md-size-md',
		lg: 'md-size-lg'
	};
</script>

<div
	class={[
		'markdown-preview text-primary',
		sizeClass[size],
		framed && 'rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm sm:p-6',
		className
	]}
>
	{#if isEmpty}
		<p class="py-8 text-center text-sm text-muted">{emptyText}</p>
	{:else}
		<!-- Markdown is escaped before render; {@html} is intentional. -->
		<div class="md-body">{@html html}</div>
	{/if}
</div>

<style>
	.markdown-preview :global(.md-body) {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.md-size-sm :global(.md-body) {
		font-size: 0.8125rem;
		line-height: 1.55;
		gap: 0.55rem;
	}
	.md-size-md :global(.md-body) {
		font-size: 0.875rem;
		line-height: 1.65;
	}
	.md-size-lg :global(.md-body) {
		font-size: 1rem;
		line-height: 1.7;
		gap: 0.9rem;
	}

	.markdown-preview :global(.md-h) {
		font-weight: 650;
		letter-spacing: -0.02em;
		color: var(--color-primary, inherit);
		line-height: 1.25;
		margin-top: 0.35rem;
	}
	.markdown-preview :global(.md-h1) {
		font-size: 1.65em;
		padding-bottom: 0.35rem;
		border-bottom: 1px solid color-mix(in oklab, var(--color-border, #e5e7eb) 80%, transparent);
	}
	.markdown-preview :global(.md-h2) {
		font-size: 1.35em;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid color-mix(in oklab, var(--color-border, #e5e7eb) 55%, transparent);
	}
	.markdown-preview :global(.md-h3) {
		font-size: 1.15em;
	}
	.markdown-preview :global(.md-h4),
	.markdown-preview :global(.md-h5),
	.markdown-preview :global(.md-h6) {
		font-size: 1em;
		opacity: 0.95;
	}

	.markdown-preview :global(.md-p) {
		color: color-mix(in oklab, var(--color-primary, #111) 72%, transparent);
	}

	.markdown-preview :global(.md-a) {
		color: var(--color-brand-600, #4f46e5);
		text-decoration: underline;
		text-underline-offset: 2px;
		font-weight: 500;
	}
	:global(.dark) .markdown-preview :global(.md-a) {
		color: var(--color-brand-400, #818cf8);
	}

	.markdown-preview :global(.md-code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.88em;
		padding: 0.12em 0.4em;
		border-radius: 0.35rem;
		background: color-mix(in oklab, var(--color-surface-overlay, #f4f4f5) 100%, transparent);
		border: 1px solid color-mix(in oklab, var(--color-border, #e5e7eb) 70%, transparent);
	}

	.markdown-preview :global(.md-pre-wrap) {
		overflow: hidden;
		border-radius: 0.85rem;
		border: 1px solid color-mix(in oklab, var(--color-border, #e5e7eb) 80%, transparent);
		background: color-mix(in oklab, var(--color-surface-overlay, #f4f4f5) 100%, transparent);
	}
	.markdown-preview :global(.md-pre-label) {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 0.4rem 0.85rem 0;
		color: color-mix(in oklab, var(--color-primary, #111) 45%, transparent);
	}
	.markdown-preview :global(.md-pre) {
		overflow-x: auto;
		margin: 0;
		padding: 0.85rem 1rem 1rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.78em;
		line-height: 1.55;
	}
	.markdown-preview :global(.md-pre code) {
		background: none;
		border: none;
		padding: 0;
		font-size: inherit;
		border-radius: 0;
	}

	.markdown-preview :global(.md-quote) {
		margin: 0;
		padding: 0.35rem 0 0.35rem 0.95rem;
		border-left: 3px solid var(--color-brand-500, #6366f1);
		color: color-mix(in oklab, var(--color-primary, #111) 65%, transparent);
		background: color-mix(in oklab, var(--color-brand-500, #6366f1) 6%, transparent);
		border-radius: 0 0.5rem 0.5rem 0;
	}
	.markdown-preview :global(.md-quote p) {
		margin: 0.2rem 0;
	}

	.markdown-preview :global(.md-ul),
	.markdown-preview :global(.md-ol),
	.markdown-preview :global(.md-task) {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		color: color-mix(in oklab, var(--color-primary, #111) 75%, transparent);
	}
	.markdown-preview :global(.md-ol) {
		list-style: decimal;
	}
	.markdown-preview :global(.md-ul) {
		list-style: disc;
	}
	.markdown-preview :global(.md-task) {
		list-style: none;
		padding-left: 0.15rem;
	}
	.markdown-preview :global(.md-task-item) {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}
	.markdown-preview :global(.md-check) {
		flex-shrink: 0;
		opacity: 0.7;
		line-height: 1.4;
	}

	.markdown-preview :global(.md-hr) {
		border: none;
		height: 1px;
		margin: 0.5rem 0;
		background: color-mix(in oklab, var(--color-border, #e5e7eb) 100%, transparent);
	}

	.markdown-preview :global(.md-img) {
		display: block;
		max-width: 100%;
		height: auto;
		border-radius: 0.75rem;
		border: 1px solid color-mix(in oklab, var(--color-border, #e5e7eb) 80%, transparent);
	}

	.markdown-preview :global(.md-table-wrap) {
		overflow-x: auto;
		border-radius: 0.75rem;
		border: 1px solid color-mix(in oklab, var(--color-border, #e5e7eb) 80%, transparent);
	}
	.markdown-preview :global(.md-table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.92em;
	}
	.markdown-preview :global(.md-th),
	.markdown-preview :global(.md-td) {
		padding: 0.55rem 0.75rem;
		border-bottom: 1px solid color-mix(in oklab, var(--color-border, #e5e7eb) 80%, transparent);
	}
	.markdown-preview :global(.md-th) {
		font-weight: 600;
		background: color-mix(in oklab, var(--color-surface-overlay, #f4f4f5) 80%, transparent);
		text-align: left;
	}
	.markdown-preview :global(tbody tr:last-child .md-td) {
		border-bottom: none;
	}

	.markdown-preview :global(strong) {
		font-weight: 650;
		color: var(--color-primary, inherit);
	}
	.markdown-preview :global(del) {
		opacity: 0.7;
	}
</style>
