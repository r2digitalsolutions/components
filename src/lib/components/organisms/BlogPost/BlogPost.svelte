<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';

	interface BlogPostProps {
		title: string;
		excerpt?: string;
		author?: string;
		avatar?: string;
		date?: string | Date | number;
		tags?: string[];
		cover?: string;
		readingMinutes?: number;
		class?: string;
		children?: Snippet;
		actions?: Snippet;
	}

	const {
		title,
		excerpt,
		author = 'Author',
		avatar,
		date,
		tags = [],
		cover,
		readingMinutes,
		class: className = '',
		children,
		actions
	}: BlogPostProps = $props();
</script>

<article class={['mx-auto w-full max-w-3xl space-y-6', className]}>
	<header class="space-y-4">
		{#if tags.length}
			<div class="flex flex-wrap gap-1.5">
				{#each tags as tag}
					<Badge size="sm" variant="secondary">{tag}</Badge>
				{/each}
			</div>
		{/if}
		<h1 class="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">{title}</h1>
		{#if excerpt}
			<p class="text-lg text-secondary">{excerpt}</p>
		{/if}
		<div class="flex flex-wrap items-center gap-3">
			<div class="flex items-center gap-2">
				<Avatar src={avatar} name={author} size="sm" />
				<span class="text-sm font-medium text-primary">{author}</span>
			</div>
			{#if date}
				<span class="text-sm text-muted"><TimeAgo {date} /></span>
			{/if}
			{#if readingMinutes}
				<span class="text-sm text-muted">{readingMinutes} min read</span>
			{/if}
			{#if actions}
				<div class="ms-auto">
					{@render actions()}
				</div>
			{/if}
		</div>
	</header>

	{#if cover}
		<img src={cover} alt="" class="aspect-[2/1] w-full rounded-2xl object-cover" />
	{/if}

	<Divider />

	<div class="prose-sm space-y-4 text-secondary leading-relaxed dark:prose-invert">
		{#if children}
			{@render children()}
		{:else}
			<p>
				This is where the article body lives. Compose markdown or rich text below the header and cover image.
			</p>
		{/if}
	</div>
</article>
