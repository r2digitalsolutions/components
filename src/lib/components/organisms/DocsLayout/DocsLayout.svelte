<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import type { SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import TableOfContents from '$lib/components/molecules/TableOfContents/TableOfContents.svelte';
	import type { TocItem } from '$lib/components/molecules/TableOfContents/TableOfContents.svelte';
	import MarkdownPreview from '$lib/components/molecules/MarkdownPreview/MarkdownPreview.svelte';
	import Container from '$lib/components/atoms/Container/Container.svelte';

	export interface DocsPage {
		id: string;
		title?: string;
		markdown: string;
		toc?: TocItem[];
	}

	interface DocsLayoutProps {
		brand?: string;
		nav?: SidebarGroup[];
		navValue?: string;
		toc?: TocItem[];
		activeHeading?: string;
		markdown?: string;
		/** Optional page map — sidebar clicks swap content + TOC */
		pages?: DocsPage[];
		class?: string;
		children?: Snippet;
		onnavchange?: (id: string) => void;
		onheadingchange?: (id: string) => void;
	}

	let {
		brand = 'Docs',
		nav = [],
		navValue = $bindable(''),
		toc = [],
		activeHeading = $bindable(''),
		markdown = '',
		pages = [],
		class: className = '',
		children,
		onnavchange,
		onheadingchange
	}: DocsLayoutProps = $props();

	let mainEl = $state<HTMLElement | null>(null);

	const activePage = $derived(
		pages.find((p) => p.id === navValue) ?? pages[0] ?? null
	);

	const resolvedMarkdown = $derived(activePage?.markdown ?? markdown);
	const resolvedToc = $derived(activePage?.toc ?? toc);

	function onNav(id: string) {
		navValue = id;
		activeHeading = '';
		onnavchange?.(id);
		queueMicrotask(() => {
			mainEl?.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	$effect(() => {
		if (!activeHeading && resolvedToc.length) {
			activeHeading = resolvedToc[0].id;
		}
	});
</script>

<div
	class={[
		'flex h-full min-h-dvh w-full overflow-hidden bg-surface',
		className
	]}
>
	<Sidebar
		{brand}
		groups={nav}
		bind:value={navValue}
		onchange={onNav}
		class="hidden h-full shrink-0 md:flex"
	/>

	<div class="flex min-h-0 min-w-0 flex-1">
		<main
			bind:this={mainEl}
			data-docs-scroll
			class="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain"
		>
			<Container size="3xl" class="px-6 py-8 sm:px-8 sm:py-10">
				{#if children}
					{@render children()}
				{:else if resolvedMarkdown}
					{#key navValue}
						<article class="prose-docs max-w-none">
							{#if activePage?.title}
								<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
									{activePage.title}
								</p>
							{/if}
							<MarkdownPreview source={resolvedMarkdown} size="lg" />
						</article>
					{/key}
				{/if}
			</Container>
		</main>

		{#if resolvedToc.length}
			<aside class="hidden h-full w-56 shrink-0 overflow-y-auto border-l border-border bg-surface p-4 xl:block">
				<TableOfContents
					items={resolvedToc}
					bind:activeId={activeHeading}
					scrollSpy
					scrollRoot="[data-docs-scroll]"
					variant="rail"
					onchange={(id) => onheadingchange?.(id)}
				/>
			</aside>
		{/if}
	</div>
</div>
