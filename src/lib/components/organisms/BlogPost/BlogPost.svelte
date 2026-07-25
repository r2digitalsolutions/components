<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Breadcrumb from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';
	import TableOfContents from '$lib/components/molecules/TableOfContents/TableOfContents.svelte';
	import type { TocItem } from '$lib/components/molecules/TableOfContents/TableOfContents.svelte';
	import ReactionBar from '$lib/components/molecules/ReactionBar/ReactionBar.svelte';
	import type { ReactionItem } from '$lib/components/molecules/ReactionBar/ReactionBar.svelte';
	import NewsletterSignup from '$lib/components/molecules/NewsletterSignup/NewsletterSignup.svelte';
	import ShareButton from '$lib/components/molecules/ShareButton/ShareButton.svelte';
	import Callout from '$lib/components/molecules/Callout/Callout.svelte';
	import Clock from '@lucide/svelte/icons/clock';
	import Calendar from '@lucide/svelte/icons/calendar';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	export interface BlogAuthor {
		name: string;
		avatar?: string;
		role?: string;
		bio?: string;
		href?: string;
	}

	export interface BlogRelatedPost {
		id: string;
		title: string;
		excerpt?: string;
		cover?: string;
		href?: string;
		readingMinutes?: number;
		date?: string | Date | number;
		tags?: string[];
	}

	export interface BlogAdjacentPost {
		id: string;
		title: string;
		href?: string;
	}

	export type BlogPostLayout = 'stacked' | 'with-toc';

	interface BlogPostProps {
		title: string;
		excerpt?: string;
		/** @deprecated Prefer `authors` */
		author?: string;
		/** @deprecated Prefer `authors` */
		avatar?: string;
		authors?: BlogAuthor[];
		date?: string | Date | number;
		updatedAt?: string | Date | number;
		tags?: string[];
		category?: string;
		cover?: string;
		coverCaption?: string;
		readingMinutes?: number;
		breadcrumbs?: BreadcrumbItem[];
		toc?: TocItem[];
		layout?: BlogPostLayout;
		related?: BlogRelatedPost[];
		prev?: BlogAdjacentPost;
		next?: BlogAdjacentPost;
		reactions?: ReactionItem[];
		showShare?: boolean;
		showReactions?: boolean;
		showNewsletter?: boolean;
		newsletterTitle?: string;
		newsletterDescription?: string;
		featuredNote?: string;
		class?: string;
		children?: Snippet;
		actions?: Snippet;
		footer?: Snippet;
		comments?: Snippet;
		ontag?: (tag: string) => void;
		onrelated?: (id: string) => void;
		onadjacent?: (id: string) => void;
		onauthor?: (name: string) => void;
		onreact?: (emoji: string, reacted: boolean) => void;
		onsubscribe?: (payload: { email: string; name?: string; consent: boolean }) => void;
	}

	let {
		title,
		excerpt,
		author = 'Author',
		avatar,
		authors,
		date,
		updatedAt,
		tags = [],
		category,
		cover,
		coverCaption,
		readingMinutes,
		breadcrumbs = [],
		toc = [],
		layout = 'stacked',
		related = [],
		prev,
		next,
		reactions = $bindable<ReactionItem[]>([
			{ emoji: '👍', count: 24 },
			{ emoji: '❤️', count: 12 },
			{ emoji: '🔥', count: 8 },
			{ emoji: '💡', count: 5 }
		]),
		showShare = true,
		showReactions = true,
		showNewsletter = true,
		newsletterTitle = 'Get new posts in your inbox',
		newsletterDescription = 'Practical notes on design systems — no spam.',
		featuredNote,
		class: className = '',
		children,
		actions,
		footer,
		comments,
		ontag,
		onrelated,
		onadjacent,
		onauthor,
		onreact,
		onsubscribe
	}: BlogPostProps = $props();

	const resolvedAuthors = $derived<BlogAuthor[]>(
		authors?.length
			? authors
			: [{ name: author, avatar, role: undefined, bio: undefined }]
	);

	const primaryAuthor = $derived(resolvedAuthors[0]);
	const withToc = $derived(layout === 'with-toc' && toc.length > 0);

	function formatDate(value: string | Date | number) {
		const d = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(d.getTime())) return String(value);
		return d.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<article class={['mx-auto w-full max-w-6xl', className]}>
	<div class={withToc ? 'lg:grid lg:grid-cols-[1fr_15rem] lg:gap-10' : ''}>
		<div class="mx-auto w-full max-w-3xl space-y-8 lg:mx-0">
			<header class="space-y-5">
				{#if breadcrumbs.length}
					<Breadcrumb items={breadcrumbs} class="text-xs" />
				{/if}

				<div class="flex flex-wrap items-center gap-2">
					{#if category}
						<Badge size="sm" variant="primary">{category}</Badge>
					{/if}
					{#each tags as tag}
						<button type="button" onclick={() => ontag?.(tag)}>
							<Badge size="sm" variant="secondary">{tag}</Badge>
						</button>
					{/each}
				</div>

				<h1 class="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
					{title}
				</h1>

				{#if excerpt}
					<p class="text-pretty text-lg leading-relaxed text-secondary sm:text-xl">
						{excerpt}
					</p>
				{/if}

				{#if featuredNote}
					<Callout tone="info" title="Editor’s note">
						{featuredNote}
					</Callout>
				{/if}

				<div class="flex flex-wrap items-center gap-x-4 gap-y-3">
					<div class="flex flex-wrap items-center gap-3">
						{#each resolvedAuthors as a (a.name)}
							<button
								type="button"
								class="flex items-center gap-2.5 rounded-xl text-left transition-opacity hover:opacity-80"
								onclick={() => onauthor?.(a.name)}
							>
								<Avatar src={a.avatar} name={a.name} size="md" />
								<span class="min-w-0">
									<span class="block text-sm font-semibold text-primary">{a.name}</span>
									{#if a.role}
										<span class="block text-xs text-muted">{a.role}</span>
									{/if}
								</span>
							</button>
						{/each}
					</div>

					<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted sm:text-sm">
						{#if date}
							<span class="inline-flex items-center gap-1.5">
								<Calendar class="h-3.5 w-3.5" aria-hidden="true" />
								<TimeAgo {date} />
								<span class="hidden text-muted/70 sm:inline">· {formatDate(date)}</span>
							</span>
						{/if}
						{#if updatedAt}
							<span class="text-muted">Updated {formatDate(updatedAt)}</span>
						{/if}
						{#if readingMinutes}
							<span class="inline-flex items-center gap-1.5">
								<Clock class="h-3.5 w-3.5" aria-hidden="true" />
								{readingMinutes} min read
							</span>
						{/if}
					</div>

					<div class="ms-auto flex items-center gap-2">
						{#if showShare}
							<ShareButton size="xs" />
						{/if}
						{#if actions}
							{@render actions()}
						{/if}
					</div>
				</div>
			</header>

			{#if cover}
				<figure class="space-y-2">
					<img
						src={cover}
						alt=""
						class="aspect-[2/1] w-full rounded-2xl object-cover shadow-sm ring-1 ring-border/60"
					/>
					{#if coverCaption}
						<figcaption class="px-1 text-center text-xs text-muted sm:text-sm">
							{coverCaption}
						</figcaption>
					{/if}
				</figure>
			{/if}

			{#if !withToc && toc.length}
				<div class="rounded-2xl border border-border bg-surface-overlay/50 p-4 sm:p-5">
					<TableOfContents items={toc} variant="soft" size="sm" numbered />
				</div>
			{/if}

			<Divider />

			<div
				class={[
					'blog-prose space-y-5 text-[0.975rem] leading-7 text-secondary',
					'sm:text-base sm:leading-8'
				]}
			>
				{#if children}
					{@render children()}
				{:else}
					<p>
						This is where the article body lives. Compose markdown or rich text below the header
						and cover image.
					</p>
				{/if}
			</div>

			{#if showReactions || showShare}
				<div
					class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-elevated/80 px-4 py-3"
				>
					{#if showReactions}
						<div class="space-y-1.5">
							<Text size="xs" tone="muted" as="p">Was this helpful?</Text>
							<ReactionBar bind:items={reactions} {onreact} />
						</div>
					{/if}
					{#if showShare}
						<div class="ms-auto">
							<ShareButton size="sm" label="Share article" />
						</div>
					{/if}
				</div>
			{/if}

			{#if primaryAuthor}
				<section
					class="flex flex-col gap-4 rounded-2xl border border-border bg-surface-overlay/40 p-5 sm:flex-row sm:items-start"
				>
					<Avatar src={primaryAuthor.avatar} name={primaryAuthor.name} size="lg" />
					<div class="min-w-0 flex-1 space-y-2">
						<div>
							<p class="text-sm font-semibold text-primary">{primaryAuthor.name}</p>
							{#if primaryAuthor.role}
								<p class="text-xs text-muted">{primaryAuthor.role}</p>
							{/if}
						</div>
						{#if primaryAuthor.bio}
							<p class="text-sm leading-relaxed text-secondary">{primaryAuthor.bio}</p>
						{/if}
						{#if primaryAuthor.href}
							<Button
								size="xs"
								variant="secondary"
								onclick={() => onauthor?.(primaryAuthor.name)}
							>
								View profile
							</Button>
						{/if}
					</div>
				</section>
			{/if}

			{#if prev || next}
				<nav class="grid gap-3 sm:grid-cols-2" aria-label="Adjacent posts">
					{#if prev}
						<button
							type="button"
							class="group flex flex-col gap-1 rounded-2xl border border-border bg-surface-elevated p-4 text-left transition-colors hover:border-brand-300 hover:bg-surface-overlay"
							onclick={() => onadjacent?.(prev.id)}
						>
							<span class="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted">
								<ArrowLeft class="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
								Previous
							</span>
							<span class="text-sm font-semibold text-primary">{prev.title}</span>
						</button>
					{:else}
						<span class="hidden sm:block"></span>
					{/if}
					{#if next}
						<button
							type="button"
							class="group flex flex-col gap-1 rounded-2xl border border-border bg-surface-elevated p-4 text-left transition-colors hover:border-brand-300 hover:bg-surface-overlay sm:items-end sm:text-right"
							onclick={() => onadjacent?.(next.id)}
						>
							<span class="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted">
								Next
								<ArrowRight class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
							</span>
							<span class="text-sm font-semibold text-primary">{next.title}</span>
						</button>
					{/if}
				</nav>
			{/if}

			{#if related.length}
				<section class="space-y-4">
					<div class="flex items-end justify-between gap-3">
						<h2 class="text-lg font-semibold text-primary">Related posts</h2>
						<Text size="xs" tone="muted" as="span">{related.length} articles</Text>
					</div>
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each related as post (post.id)}
							<button
								type="button"
								class="group overflow-hidden rounded-2xl border border-border bg-surface-elevated text-left transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
								onclick={() => onrelated?.(post.id)}
							>
								{#if post.cover}
									<img
										src={post.cover}
										alt=""
										class="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
									/>
								{/if}
								<div class="space-y-2 p-4">
									{#if post.tags?.length}
										<div class="flex flex-wrap gap-1">
											{#each post.tags.slice(0, 2) as tag}
												<Badge size="sm" variant="secondary">{tag}</Badge>
											{/each}
										</div>
									{/if}
									<p class="line-clamp-2 text-sm font-semibold text-primary">{post.title}</p>
									{#if post.excerpt}
										<p class="line-clamp-2 text-xs leading-relaxed text-muted">{post.excerpt}</p>
									{/if}
									<div class="flex items-center gap-2 text-[11px] text-muted">
										{#if post.readingMinutes}
											<span>{post.readingMinutes} min</span>
										{/if}
										{#if post.date}
											<span>·</span>
											<TimeAgo date={post.date} />
										{/if}
									</div>
								</div>
							</button>
						{/each}
					</div>
				</section>
			{/if}

			{#if showNewsletter}
				<NewsletterSignup
					variant="card"
					title={newsletterTitle}
					description={newsletterDescription}
					socialProof="Join 4,200+ subscribers"
					onsubmit={onsubscribe}
				/>
			{/if}

			{#if comments}
				<section class="space-y-3">
					<h2 class="text-lg font-semibold text-primary">Discussion</h2>
					{@render comments()}
				</section>
			{/if}

			{#if footer}
				{@render footer()}
			{/if}
		</div>

		{#if withToc}
			<aside class="hidden lg:block">
				<div class="sticky top-6 rounded-2xl border border-border bg-surface-elevated/80 p-4 backdrop-blur-sm">
					<TableOfContents items={toc} variant="rail" size="sm" numbered scrollSpy />
				</div>
			</aside>
		{/if}
	</div>
</article>

<style>
	.blog-prose :global(h2) {
		margin-top: 2rem;
		scroll-margin-top: 1.25rem;
		font-size: 1.35rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--text-primary);
	}
	.blog-prose :global(h3) {
		margin-top: 1.5rem;
		scroll-margin-top: 1.25rem;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	.blog-prose :global(p) {
		margin: 0;
	}
	.blog-prose :global(ul),
	.blog-prose :global(ol) {
		padding-left: 1.25rem;
		display: grid;
		gap: 0.4rem;
	}
	.blog-prose :global(li::marker) {
		color: var(--text-muted);
	}
	.blog-prose :global(blockquote) {
		margin: 0;
		border-left: 3px solid color-mix(in oklab, var(--color-brand-500) 65%, transparent);
		padding-left: 1rem;
		font-style: italic;
		color: var(--text-secondary);
	}
	.blog-prose :global(pre) {
		overflow-x: auto;
		border-radius: 0.9rem;
		border: 1px solid var(--border);
		background: var(--surface-overlay);
		padding: 1rem 1.1rem;
		font-size: 0.85rem;
		line-height: 1.6;
	}
	.blog-prose :global(code) {
		font-family: var(--font-mono);
		font-size: 0.9em;
	}
	.blog-prose :global(:not(pre) > code) {
		border-radius: 0.35rem;
		background: var(--surface-overlay);
		padding: 0.1rem 0.35rem;
		border: 1px solid var(--border);
	}
	.blog-prose :global(a) {
		color: var(--color-brand-600);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	:global(.dark) .blog-prose :global(a) {
		color: var(--color-brand-400);
	}
	.blog-prose :global(img) {
		border-radius: 1rem;
		width: 100%;
	}
	.blog-prose :global(hr) {
		border: 0;
		border-top: 1px solid var(--border);
		margin: 1.75rem 0;
	}
</style>
