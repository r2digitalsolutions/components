<script lang="ts">
	import TableOfContents from './TableOfContents.svelte';

	let props = $props<{
		variant?: 'rail' | 'soft' | 'plain';
		size?: 'sm' | 'md';
		numbered?: boolean;
		title?: string;
	}>();

	const items = [
		{ id: 'intro', label: 'Introduction', depth: 1 },
		{ id: 'install', label: 'Installation', depth: 1 },
		{ id: 'usage', label: 'Usage', depth: 1 },
		{ id: 'compose', label: 'Composition', depth: 2 },
		{ id: 'api', label: 'API reference', depth: 2 },
		{ id: 'theming', label: 'Theming', depth: 1 },
		{ id: 'tokens', label: 'Design tokens', depth: 2 },
		{ id: 'a11y', label: 'Accessibility', depth: 1 },
		{ id: 'examples', label: 'Examples', depth: 1 },
		{ id: 'faq', label: 'FAQ', depth: 1 }
	];

	const sections = [
		{
			id: 'intro',
			title: 'Introduction',
			body: 'A lightweight table of contents with scroll-spy. Use it beside long-form docs, changelogs, or settings pages.'
		},
		{
			id: 'install',
			title: 'Installation',
			body: 'Install the package, import TableOfContents, and pass an array of section ids that match headings in the page.'
		},
		{
			id: 'usage',
			title: 'Usage',
			body: 'Keep the TOC in a side column. As the reader scrolls the article, the active item updates automatically.'
		},
		{
			id: 'compose',
			title: 'Composition',
			body: 'Nest items with depth to mirror h2 / h3 structure. Nested links indent without fighting the rail indicator.'
		},
		{
			id: 'api',
			title: 'API reference',
			body: 'Bind activeId if you need controlled mode, or let scrollSpy drive the highlight. onchange fires on click.'
		},
		{
			id: 'theming',
			title: 'Theming',
			body: 'Variants cover docs (rail), cards (soft), and minimal lists (plain). All use semantic tokens.'
		},
		{
			id: 'tokens',
			title: 'Design tokens',
			body: 'Active color uses brand-500 / brand-600. Borders and muted labels follow surface tokens for light and dark.'
		},
		{
			id: 'a11y',
			title: 'Accessibility',
			body: 'Rendered as a nav with aria-current on the active link. Keyboard focus rings stay visible on every item.'
		},
		{
			id: 'examples',
			title: 'Examples',
			body: 'Docs shells, changelog readers, and multi-section settings pages are the most common placements.'
		},
		{
			id: 'faq',
			title: 'FAQ',
			body: 'Pass scrollRoot when the article scrolls inside a panel instead of the window, so spy and click-scroll stay in sync.'
		}
	];
</script>

<div class="flex h-[36rem] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
	<div class="shrink-0 border-b border-border px-5 py-3">
		<p class="text-sm font-semibold text-primary">Documentation</p>
		<p class="text-xs text-muted">Scroll the article on the left — TOC stays put with a sticky title.</p>
	</div>

	<div class="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,1fr)_14rem]">
		<article
			id="toc-scroll-root"
			class="min-h-0 overflow-y-auto overscroll-contain border-border px-5 py-6 md:border-r"
		>
			<div class="mx-auto max-w-prose space-y-12 pb-16">
				{#each sections as section (section.id)}
					<section id={section.id} class="scroll-mt-3">
						<h2 class="mb-3 text-base font-semibold tracking-tight text-primary">{section.title}</h2>
						<p class="text-sm leading-relaxed text-secondary">{section.body}</p>
						<p class="mt-3 text-sm leading-relaxed text-muted">
							Keep scrolling through this section. Each block is intentionally tall so the panel needs
							a scrollbar and the active TOC item can update as you move.
						</p>
						<p class="mt-3 text-sm leading-relaxed text-muted">
							Another paragraph for breathing room — click any TOC link to jump here smoothly inside
							this scroll container.
						</p>
					</section>
				{/each}
			</div>
		</article>

		<aside class="hidden min-h-0 border-border md:flex md:flex-col">
			<TableOfContents
				{items}
				variant={props.variant ?? 'rail'}
				size={props.size ?? 'md'}
				numbered={props.numbered ?? false}
				title={props.title ?? 'On this page'}
				stickyTitle
				scrollRoot="#toc-scroll-root"
				class="h-full min-h-0 bg-surface-elevated p-4"
			/>
		</aside>
	</div>
</div>

<div class="mt-8 grid gap-4 sm:grid-cols-3">
	{#each [
		{ variant: 'rail' as const, label: 'Rail' },
		{ variant: 'soft' as const, label: 'Soft' },
		{ variant: 'plain' as const, label: 'Plain' }
	] as demo}
		<div class="rounded-xl border border-border bg-surface-elevated p-4">
			<p class="mb-3 text-[11px] font-medium text-muted">{demo.label}</p>
			<TableOfContents
				{items}
				variant={demo.variant}
				title=""
				scrollSpy={false}
				activeId="usage"
				size="sm"
			/>
		</div>
	{/each}
</div>
