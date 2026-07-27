<script lang="ts">
	import Callout from '$lib/components/molecules/Callout/Callout.svelte';
	import CodeBlock from '$lib/components/molecules/CodeBlock/CodeBlock.svelte';
	import Quote from '$lib/components/molecules/Quote/Quote.svelte';
	import MarkdownPreview from '$lib/components/molecules/MarkdownPreview/MarkdownPreview.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
	import {
		getBlogComponent,
		parseBlogDocument,
		type BlogBlock,
		type BlogCalloutData,
		type BlogCodeData,
		type BlogComponentData,
		type BlogDocument,
		type BlogHeadingData,
		type BlogImageData,
		type BlogListData,
		type BlogMarkdownData,
		type BlogParagraphData,
		type BlogQuoteData
	} from '$lib/utils/blogDocument.js';

	export type { BlogDocument, BlogBlock };

	interface BlogRendererProps {
		/** Document object or JSON string */
		value?: BlogDocument | string;
		class?: string;
	}

	let { value = emptyDoc(), class: className = '' }: BlogRendererProps = $props();

	function emptyDoc(): BlogDocument {
		return { version: 1, title: '', blocks: [] };
	}

	const doc = $derived(parseBlogDocument(value));

	function headingTag(level: number): 'h1' | 'h2' | 'h3' | 'h4' {
		if (level === 1) return 'h1';
		if (level === 2) return 'h2';
		if (level === 3) return 'h3';
		return 'h4';
	}

	const headingClass: Record<number, string> = {
		1: 'text-3xl font-bold text-primary',
		2: 'text-2xl font-semibold text-primary',
		3: 'text-xl font-semibold text-primary',
		4: 'text-lg font-medium text-primary'
	};

	function calloutTone(tone?: string): 'info' | 'success' | 'warning' | 'error' | 'neutral' {
		if (tone === 'danger') return 'error';
		if (tone === 'success' || tone === 'warning' || tone === 'info') return tone;
		return 'info';
	}
</script>

<article class={['mx-auto flex w-full max-w-3xl flex-col gap-5', className]} data-blog-renderer>
	{#if doc.title}
		<h1 class="text-3xl font-bold tracking-tight text-primary">{doc.title}</h1>
	{/if}

	{#if doc.blocks.length === 0}
		<EmptyState title="Empty document" description="Pass a BlogDocument JSON to render content." />
	{:else}
		{#each doc.blocks as block (block.id)}
			{#if block.type === 'heading'}
				{@const data = block.data as BlogHeadingData}
				{@const Tag = headingTag(data.level)}
				<svelte:element this={Tag} class={headingClass[data.level] ?? headingClass[2]}>
					{data.text}
				</svelte:element>
			{:else if block.type === 'paragraph'}
				{@const data = block.data as BlogParagraphData}
				<p class="text-base leading-relaxed text-secondary whitespace-pre-wrap">{data.text}</p>
			{:else if block.type === 'image'}
				{@const data = block.data as BlogImageData}
				<figure class="overflow-hidden rounded-xl border border-border">
					{#if data.src}
						<img src={data.src} alt={data.alt ?? ''} class="w-full object-cover" />
					{:else}
						<div class="bg-surface-overlay px-4 py-12 text-center text-sm text-muted">No image</div>
					{/if}
					{#if data.caption}
						<figcaption class="border-t border-border px-3 py-2 text-xs text-muted">
							{data.caption}
						</figcaption>
					{/if}
				</figure>
			{:else if block.type === 'code'}
				{@const data = block.data as BlogCodeData}
				<CodeBlock code={data.code} language={data.language ?? 'ts'} />
			{:else if block.type === 'callout'}
				{@const data = block.data as BlogCalloutData}
				<Callout tone={calloutTone(data.tone)} title={data.title}>
					{#snippet children()}
						<p class="whitespace-pre-wrap">{data.text}</p>
					{/snippet}
				</Callout>
			{:else if block.type === 'quote'}
				{@const data = block.data as BlogQuoteData}
				<Quote quote={data.text} author={data.cite} />
			{:else if block.type === 'list'}
				{@const data = block.data as BlogListData}
				{#if data.ordered}
					<ol class="list-decimal space-y-1 pl-5 text-secondary">
						{#each data.items as item, i (i)}
							<li>{item}</li>
						{/each}
					</ol>
				{:else}
					<ul class="list-disc space-y-1 pl-5 text-secondary">
						{#each data.items as item, i (i)}
							<li>{item}</li>
						{/each}
					</ul>
				{/if}
			{:else if block.type === 'divider'}
				<Divider />
			{:else if block.type === 'markdown'}
				{@const data = block.data as BlogMarkdownData}
				<MarkdownPreview source={data.source} />
			{:else if block.type === 'component'}
				{@const data = block.data as BlogComponentData}
				{@const reg = getBlogComponent(data.componentId)}
				{#if reg}
					{@const Comp = reg.component}
					<Comp {...(data.props ?? {})} />
				{:else}
					<EmptyState
						title={`Unknown component: ${data.componentId}`}
						description="Register it with registerBlogComponent() before rendering."
					/>
				{/if}
			{/if}
		{/each}
	{/if}
</article>
