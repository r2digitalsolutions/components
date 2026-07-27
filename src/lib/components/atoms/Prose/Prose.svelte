<script lang="ts">
	import type { Snippet } from 'svelte';

	export type ProseSize = 'sm' | 'md' | 'lg' | 'xl';
	export type ProseDensity = 'compact' | 'comfortable' | 'relaxed';
	export type ProseTone = 'default' | 'muted';
	export type ProseAlign = 'left' | 'center' | 'justify';
	export type ProseMaxWidth = 'none' | 'sm' | 'md' | 'lg' | 'prose';

	interface ProseProps {
		size?: ProseSize;
		density?: ProseDensity;
		tone?: ProseTone;
		align?: ProseAlign;
		maxWidth?: ProseMaxWidth;
		/** Soften heading scale relative to body size */
		subtleHeadings?: boolean;
		children?: Snippet;
		class?: string;
	}

	const {
		size = 'md',
		density = 'comfortable',
		tone = 'default',
		align = 'left',
		maxWidth = 'none',
		subtleHeadings = false,
		children,
		class: className = ''
	}: ProseProps = $props();

	const sizeClasses: Record<ProseSize, string> = {
		sm: 'text-sm leading-relaxed',
		md: 'text-base leading-relaxed',
		lg: 'text-lg leading-relaxed',
		xl: 'text-xl leading-relaxed'
	};

	const densityClasses: Record<ProseDensity, string> = {
		compact: 'space-y-2',
		comfortable: 'space-y-4',
		relaxed: 'space-y-6'
	};

	const toneClasses: Record<ProseTone, string> = {
		default: 'text-secondary',
		muted: 'text-muted'
	};

	const alignClasses: Record<ProseAlign, string> = {
		left: 'text-left',
		center: 'text-center',
		justify: 'text-justify'
	};

	const maxWidthClasses: Record<ProseMaxWidth, string> = {
		none: '',
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		prose: 'max-w-prose'
	};
</script>

<div
	class={[
		'prose-content',
		sizeClasses[size],
		densityClasses[density],
		toneClasses[tone],
		alignClasses[align],
		maxWidthClasses[maxWidth],
		subtleHeadings && 'prose-subtle-headings',
		className
	]}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.prose-content :global(h1) {
		margin-top: 0;
		font-size: 1.875rem;
		line-height: 2.25rem;
		font-weight: 700;
		color: var(--text-primary);
	}
	.prose-content :global(h2) {
		font-size: 1.5rem;
		line-height: 2rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	.prose-content :global(h3) {
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	.prose-content :global(h4),
	.prose-content :global(h5),
	.prose-content :global(h6) {
		font-size: 1rem;
		line-height: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	.prose-subtle-headings :global(h1) {
		font-size: 1.5rem;
		line-height: 2rem;
	}
	.prose-subtle-headings :global(h2) {
		font-size: 1.25rem;
		line-height: 1.75rem;
	}
	.prose-subtle-headings :global(h3) {
		font-size: 1.125rem;
		line-height: 1.625rem;
	}
	.prose-content :global(p) {
		margin: 0;
	}
	.prose-content :global(strong) {
		font-weight: 600;
		color: var(--text-primary);
	}
	.prose-content :global(em) {
		font-style: italic;
	}
	.prose-content :global(a) {
		color: var(--color-brand-600, #4f46e5);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.prose-content :global(a:hover) {
		color: var(--color-brand-700, #4338ca);
	}
	:global(.dark) .prose-content :global(a) {
		color: var(--color-brand-400, #818cf8);
	}
	:global(.dark) .prose-content :global(a:hover) {
		color: var(--color-brand-300, #a5b4fc);
	}
	.prose-content :global(ul),
	.prose-content :global(ol) {
		margin: 0;
		padding-left: 1.25rem;
	}
	.prose-content :global(ul) {
		list-style-type: disc;
	}
	.prose-content :global(ol) {
		list-style-type: decimal;
	}
	.prose-content :global(li) {
		margin-top: 0.25rem;
	}
	.prose-content :global(li > ul),
	.prose-content :global(li > ol) {
		margin-top: 0.25rem;
	}
	.prose-content :global(blockquote) {
		margin: 0;
		border-left: 3px solid var(--border);
		padding-left: 1rem;
		font-style: italic;
		color: var(--text-muted);
	}
	.prose-content :global(code) {
		border-radius: 0.25rem;
		background-color: var(--surface-overlay);
		padding: 0.125rem 0.375rem;
		font-size: 0.875em;
	}
	.prose-content :global(pre) {
		margin: 0;
		overflow-x: auto;
		border-radius: 0.5rem;
		background-color: var(--surface-overlay);
		padding: 1rem;
		font-size: 0.875em;
		line-height: 1.6;
	}
	.prose-content :global(pre code) {
		background-color: transparent;
		padding: 0;
	}
	.prose-content :global(hr) {
		margin: 0;
		border: 0;
		border-top: 1px solid var(--border);
	}
	.prose-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}
	.prose-content :global(figure) {
		margin: 0;
	}
	.prose-content :global(figcaption) {
		margin-top: 0.5rem;
		font-size: 0.875em;
		color: var(--text-muted);
		text-align: center;
	}
	.prose-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875em;
	}
	.prose-content :global(th),
	.prose-content :global(td) {
		border-bottom: 1px solid var(--border);
		padding: 0.5rem 0.75rem;
		text-align: left;
	}
	.prose-content :global(th) {
		font-weight: 600;
		color: var(--text-primary);
	}
	.prose-content :global(kbd) {
		border-radius: 0.25rem;
		border: 1px solid var(--border);
		background-color: var(--surface-overlay);
		padding: 0.125rem 0.375rem;
		font-size: 0.8em;
		font-family: ui-monospace, monospace;
	}
</style>
