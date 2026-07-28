<script lang="ts">
	import Callout from '$lib/components/molecules/Callout/Callout.svelte';
	import CodeBlock from '$lib/components/molecules/CodeBlock/CodeBlock.svelte';
	import Quote from '$lib/components/molecules/Quote/Quote.svelte';
	import MarkdownPreview from '$lib/components/molecules/MarkdownPreview/MarkdownPreview.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import {
		blogAlignClass,
		blogAspectPadding,
		blogWidthClass,
		getBlogComponent,
		parseBlogDocument,
		type BlogBlock,
		type BlogCalloutData,
		type BlogCodeData,
		type BlogComponentData,
		type BlogCtaData,
		type BlogDividerData,
		type BlogDocument,
		type BlogEmbedData,
		type BlogGalleryData,
		type BlogHeadingData,
		type BlogHtmlData,
		type BlogImageData,
		type BlogListData,
		type BlogMarkdownData,
		type BlogParagraphData,
		type BlogQuoteData,
		type BlogSpacerData,
		type BlogTableData,
		type BlogVideoData
	} from '$lib/utils/blogDocument.js';

	export type { BlogDocument, BlogBlock };

	interface BlogRendererProps {
		/** Document object or JSON string */
		value?: BlogDocument | string;
		/** Show document meta (author, tags, cover). */
		showMeta?: boolean;
		class?: string;
	}

	let {
		value = emptyDoc(),
		showMeta = true,
		class: className = ''
	}: BlogRendererProps = $props();

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
		if (tone === 'success' || tone === 'warning' || tone === 'info' || tone === 'neutral')
			return tone;
		return 'info';
	}

	function spacerClass(size?: BlogSpacerData['size']): string {
		switch (size) {
			case 'xs':
				return 'h-2';
			case 'sm':
				return 'h-4';
			case 'lg':
				return 'h-12';
			case 'xl':
				return 'h-20';
			case 'md':
			default:
				return 'h-8';
		}
	}

	function galleryCols(cols?: number): string {
		if (cols === 2) return 'grid-cols-2';
		if (cols === 4) return 'grid-cols-2 sm:grid-cols-4';
		return 'grid-cols-2 sm:grid-cols-3';
	}

	function galleryGap(gap?: string): string {
		if (gap === 'sm') return 'gap-2';
		if (gap === 'lg') return 'gap-5';
		return 'gap-3';
	}

	function toEmbedSrc(url: string): string {
		try {
			const u = new URL(url);
			if (u.hostname.includes('youtube.com')) {
				const id = u.searchParams.get('v');
				if (id) return `https://www.youtube.com/embed/${id}`;
			}
			if (u.hostname === 'youtu.be') {
				const id = u.pathname.slice(1);
				if (id) return `https://www.youtube.com/embed/${id}`;
			}
			if (u.hostname.includes('vimeo.com')) {
				const id = u.pathname.split('/').filter(Boolean).pop();
				if (id) return `https://player.vimeo.com/video/${id}`;
			}
		} catch {
			/* keep raw */
		}
		return url;
	}
</script>

<article class={['mx-auto flex w-full max-w-3xl flex-col gap-5', className]} data-blog-renderer>
	{#if showMeta && doc.coverImage}
		<div class="overflow-hidden rounded-xl border border-border">
			<img src={doc.coverImage} alt="" class="max-h-72 w-full object-cover" />
		</div>
	{/if}

	{#if doc.title}
		<h1 class="text-3xl font-bold tracking-tight text-primary">{doc.title}</h1>
	{/if}

	{#if showMeta && (doc.description || doc.author || doc.tags?.length || doc.publishedAt)}
		<div class="flex flex-col gap-2 border-b border-border pb-4">
			{#if doc.description}
				<p class="text-base text-secondary">{doc.description}</p>
			{/if}
			<div class="flex flex-wrap items-center gap-2 text-xs text-muted">
				{#if doc.author}
					<span>{doc.author}</span>
				{/if}
				{#if doc.publishedAt}
					<span>· {doc.publishedAt}</span>
				{/if}
			</div>
			{#if doc.tags?.length}
				<div class="flex flex-wrap gap-1.5">
					{#each doc.tags as tag (tag)}
						<Badge variant="secondary">{tag}</Badge>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	{#if doc.blocks.length === 0}
		<EmptyState title="Empty document" description="Pass a BlogDocument JSON to render content." />
	{:else}
		{#each doc.blocks as block (block.id)}
			{#if block.type === 'heading'}
				{@const data = block.data as BlogHeadingData}
				{@const Tag = headingTag(data.level)}
				<svelte:element
					this={Tag}
					id={data.anchor || undefined}
					class={[headingClass[data.level] ?? headingClass[2], blogAlignClass(data.align)]}
				>
					{data.text}
				</svelte:element>
			{:else if block.type === 'paragraph'}
				{@const data = block.data as BlogParagraphData}
				<p
					class={[
						'leading-relaxed whitespace-pre-wrap',
						data.lead ? 'text-lg text-primary' : 'text-base text-secondary',
						data.muted ? 'text-muted' : '',
						blogAlignClass(data.align)
					]}
				>
					{data.text}
				</p>
			{:else if block.type === 'image'}
				{@const data = block.data as BlogImageData}
				<figure
					class={[
						'overflow-hidden border border-border',
						data.rounded !== false ? 'rounded-xl' : '',
						data.shadow ? 'shadow-md' : '',
						blogWidthClass(data.width),
						blogAlignClass(data.align)
					]}
				>
					{#if data.src}
						{#if data.href}
							<a href={data.href} target="_blank" rel="noopener noreferrer">
								<img src={data.src} alt={data.alt ?? ''} class="w-full object-cover" />
							</a>
						{:else}
							<img src={data.src} alt={data.alt ?? ''} class="w-full object-cover" />
						{/if}
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
				<div class="overflow-hidden rounded-xl border border-border">
					{#if data.filename || data.language}
						<div
							class="flex items-center justify-between border-b border-border bg-surface-overlay/60 px-3 py-1.5 text-[11px] text-muted"
						>
							<span class="font-medium text-secondary">{data.filename || data.language}</span>
							{#if data.filename && data.language}
								<span>{data.language}</span>
							{/if}
						</div>
					{/if}
					<CodeBlock code={data.code} language={data.language ?? 'ts'} />
				</div>
			{:else if block.type === 'callout'}
				{@const data = block.data as BlogCalloutData}
				<Callout tone={calloutTone(data.tone)} title={data.title}>
					{#snippet children()}
						<p class="whitespace-pre-wrap">{data.text}</p>
					{/snippet}
				</Callout>
			{:else if block.type === 'quote'}
				{@const data = block.data as BlogQuoteData}
				<div class={blogAlignClass(data.align)}>
					<Quote
						quote={data.text}
						author={data.cite}
						role={data.role}
					/>
				</div>
			{:else if block.type === 'list'}
				{@const data = block.data as BlogListData}
				{#if data.ordered}
					<ol
						class={[
							'list-decimal pl-5 text-secondary',
							data.tight ? 'space-y-0.5' : 'space-y-1'
						]}
						start={data.start ?? 1}
					>
						{#each data.items as item, i (i)}
							<li>{item}</li>
						{/each}
					</ol>
				{:else}
					<ul
						class={[
							'list-disc pl-5 text-secondary',
							data.tight ? 'space-y-0.5' : 'space-y-1'
						]}
					>
						{#each data.items as item, i (i)}
							<li>{item}</li>
						{/each}
					</ul>
				{/if}
			{:else if block.type === 'divider'}
				{@const data = block.data as BlogDividerData}
				<div
					class={[
						data.spacing === 'sm' ? 'py-1' : data.spacing === 'lg' ? 'py-6' : 'py-3'
					]}
				>
					{#if data.label}
						<div class="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted">
							<span class="h-px flex-1 bg-border"></span>
							{data.label}
							<span class="h-px flex-1 bg-border"></span>
						</div>
					{:else}
						<hr
							class={[
								'border-0 border-t border-border',
								data.style === 'dashed'
									? 'border-dashed'
									: data.style === 'dotted'
										? 'border-dotted'
										: ''
							]}
						/>
					{/if}
				</div>
			{:else if block.type === 'markdown'}
				{@const data = block.data as BlogMarkdownData}
				<MarkdownPreview source={data.source} />
			{:else if block.type === 'video'}
				{@const data = block.data as BlogVideoData}
				<figure class={[blogWidthClass(data.width), blogAlignClass(data.align)]}>
					{#if data.src}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video
							src={data.src}
							poster={data.poster || undefined}
							controls={data.controls !== false}
							autoplay={!!data.autoplay}
							loop={!!data.loop}
							muted={!!data.muted || !!data.autoplay}
							class="w-full rounded-xl border border-border bg-black"
						></video>
					{:else}
						<div
							class="rounded-xl border border-dashed border-border bg-surface-overlay px-4 py-12 text-center text-sm text-muted"
						>
							No video
						</div>
					{/if}
					{#if data.caption}
						<figcaption class="mt-2 text-xs text-muted">{data.caption}</figcaption>
					{/if}
				</figure>
			{:else if block.type === 'embed'}
				{@const data = block.data as BlogEmbedData}
				<figure>
					{#if data.url}
						<div
							class="relative w-full overflow-hidden rounded-xl border border-border"
							style={data.height
								? `height:${data.height}px`
								: `padding-bottom:${blogAspectPadding(data.aspectRatio)}`}
						>
							<iframe
								src={toEmbedSrc(data.url)}
								title={data.title || 'Embed'}
								class="absolute inset-0 h-full w-full"
								loading="lazy"
								referrerpolicy="no-referrer"
								allowfullscreen
							></iframe>
						</div>
					{:else}
						<div
							class="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted"
						>
							No embed URL
						</div>
					{/if}
					{#if data.caption}
						<figcaption class="mt-2 text-xs text-muted">{data.caption}</figcaption>
					{/if}
				</figure>
			{:else if block.type === 'gallery'}
				{@const data = block.data as BlogGalleryData}
				<div class={['grid', galleryCols(data.columns), galleryGap(data.gap)]}>
					{#each data.images as img, i (i)}
						<figure
							class={[
								'overflow-hidden border border-border bg-surface-overlay',
								data.rounded !== false ? 'rounded-lg' : ''
							]}
						>
							{#if img.src}
								<img src={img.src} alt={img.alt ?? ''} class="aspect-square w-full object-cover" />
							{:else}
								<div class="flex aspect-square items-center justify-center text-xs text-muted">
									Empty
								</div>
							{/if}
							{#if img.caption}
								<figcaption class="px-2 py-1 text-[11px] text-muted">{img.caption}</figcaption>
							{/if}
						</figure>
					{/each}
				</div>
			{:else if block.type === 'table'}
				{@const data = block.data as BlogTableData}
				<div class="overflow-x-auto rounded-xl border border-border">
					<table class="w-full text-left text-sm">
						{#if data.caption}
							<caption class="border-b border-border px-3 py-2 text-xs text-muted">
								{data.caption}
							</caption>
						{/if}
						<thead class="bg-surface-overlay/70 text-xs uppercase tracking-wide text-muted">
							<tr>
								{#each data.headers as header, i (i)}
									<th class={['px-3 font-semibold', data.compact ? 'py-1.5' : 'py-2.5']}>
										{header}
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each data.rows as row, ri (ri)}
								<tr
									class={[
										'border-t border-border',
										data.striped && ri % 2 === 1 ? 'bg-surface-overlay/40' : ''
									]}
								>
									{#each row as cell, ci (ci)}
										<td class={['px-3 text-secondary', data.compact ? 'py-1.5' : 'py-2.5']}>
											{cell}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else if block.type === 'cta'}
				{@const data = block.data as BlogCtaData}
				<div class={['flex flex-col gap-2', blogAlignClass(data.align)]}>
					{#if data.subtitle}
						<p class="text-sm text-muted">{data.subtitle}</p>
					{/if}
					<div class={data.align === 'center' ? 'flex justify-center' : data.align === 'right' ? 'flex justify-end' : ''}>
						{#if data.href}
							<a
								href={data.href}
								target={data.openInNewTab ? '_blank' : undefined}
								rel={data.openInNewTab ? 'noopener noreferrer' : undefined}
							>
								<Button
									variant={data.variant === 'outline' ? 'secondary' : (data.variant ?? 'primary')}
								>
									{data.label}
								</Button>
							</a>
						{:else}
							<Button
								variant={data.variant === 'outline' ? 'secondary' : (data.variant ?? 'primary')}
							>
								{data.label}
							</Button>
						{/if}
					</div>
				</div>
			{:else if block.type === 'spacer'}
				{@const data = block.data as BlogSpacerData}
				<div class={spacerClass(data.size)} aria-hidden="true"></div>
			{:else if block.type === 'html'}
				{@const data = block.data as BlogHtmlData}
				<!-- Trusted CMS HTML only — consumers must sanitize upstream if needed. -->
				<div class="blog-html prose prose-sm max-w-none text-secondary">
					{@html data.html}
				</div>
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
