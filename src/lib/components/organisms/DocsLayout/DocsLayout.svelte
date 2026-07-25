<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import type { SidebarGroup } from '$lib/components/organisms/Sidebar/Sidebar.svelte';
	import TableOfContents from '$lib/components/molecules/TableOfContents/TableOfContents.svelte';
	import type { TocItem } from '$lib/components/molecules/TableOfContents/TableOfContents.svelte';
	import MarkdownPreview from '$lib/components/molecules/MarkdownPreview/MarkdownPreview.svelte';
	import Container from '$lib/components/atoms/Container/Container.svelte';

	interface DocsLayoutProps {
		brand?: string;
		nav?: SidebarGroup[];
		navValue?: string;
		toc?: TocItem[];
		activeHeading?: string;
		markdown?: string;
		class?: string;
		children?: Snippet;
		onnavchange?: (id: string) => void;
	}

	let {
		brand = 'Docs',
		nav = [],
		navValue = $bindable(''),
		toc = [],
		activeHeading = $bindable(''),
		markdown = '',
		class: className = '',
		children,
		onnavchange
	}: DocsLayoutProps = $props();
</script>

<div class={['flex min-h-[28rem] w-full bg-surface', className]}>
	<Sidebar {brand} groups={nav} bind:value={navValue} onchange={onnavchange} class="hidden md:flex" />

	<div class="flex min-w-0 flex-1">
		<main class="min-w-0 flex-1 overflow-auto p-6">
			<Container size="3xl" padding="none">
				{#if children}
					{@render children()}
				{:else if markdown}
					<article class="prose-docs">
						<MarkdownPreview source={markdown} />
					</article>
				{/if}
			</Container>
		</main>

		{#if toc.length}
			<aside class="hidden w-56 shrink-0 border-l border-border p-4 xl:block">
				<TableOfContents items={toc} bind:activeId={activeHeading} scrollSpy={false} />
			</aside>
		{/if}
	</div>
</div>
