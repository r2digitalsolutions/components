<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Link from '$lib/components/atoms/Link/Link.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import Download from '@lucide/svelte/icons/download';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import FileText from '@lucide/svelte/icons/file-text';
	import Maximize2 from '@lucide/svelte/icons/maximize-2';

	interface PdfViewerProps {
		/** Optional PDF URL. Many hosts block iframe embed — preview pages always show as fallback. */
		src?: string;
		title?: string;
		fileName?: string;
		fileSize?: string;
		pageCount?: number;
		page?: number;
		zoom?: number;
		height?: string;
		/** Force document preview instead of native embed (recommended for demos). */
		preview?: boolean;
		class?: string;
		/** Custom page body for the active page. Receives page index (1-based). */
		children?: Snippet<[number]>;
	}

	let {
		src,
		title = 'Document',
		fileName,
		fileSize,
		pageCount = 3,
		page = $bindable(1),
		zoom = $bindable(100),
		height = '40rem',
		preview = true,
		class: className = '',
		children
	}: PdfViewerProps = $props();

	let rootEl: HTMLDivElement | undefined = $state();
	let embedFailed = $state(false);

	const totalPages = $derived(Math.max(1, pageCount));
	const currentPage = $derived(Math.min(totalPages, Math.max(1, page)));
	const zoomClamped = $derived(Math.min(200, Math.max(50, zoom)));
	const displayName = $derived(fileName ?? title);
	const useEmbed = $derived(Boolean(src) && !preview && !embedFailed);

	function go(delta: number) {
		page = Math.min(totalPages, Math.max(1, currentPage + delta));
	}

	function setZoom(next: number) {
		zoom = Math.min(200, Math.max(50, Math.round(next / 10) * 10));
	}

	function onEmbedError() {
		embedFailed = true;
	}

	function openSrc() {
		if (src) window.open(src, '_blank', 'noopener,noreferrer');
	}

	async function toggleFullscreen() {
		if (!rootEl) return;
		if (document.fullscreenElement === rootEl) {
			await document.exitFullscreen();
		} else {
			await rootEl.requestFullscreen();
		}
	}
</script>

{#snippet defaultPage(n: number)}
	<div
		class="mx-auto flex w-full max-w-[52rem] flex-col gap-5 bg-white p-10 text-slate-900 shadow-md sm:p-12 dark:bg-zinc-50"
	>
		<div class="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
			<div>
				<p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
					Confidential
				</p>
				<h2 class="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
					{title}
				</h2>
			</div>
			<div class="text-right text-[11px] text-slate-400">
				<p>Page {n} of {totalPages}</p>
				{#if fileSize}<p>{fileSize}</p>{/if}
			</div>
		</div>

		{#if n === 1}
			<p class="text-sm leading-relaxed text-slate-600">
				Quarterly summary covering product velocity, customer health, and next-quarter priorities.
				Use the toolbar to change pages and zoom — this preview stays visible even when native PDF
				embedding is blocked.
			</p>
			<div class="grid gap-3 sm:grid-cols-3">
				{#each [['ARR', '$2.4M'], ['NPS', '62'], ['Churn', '1.8%']] as [label, value]}
					<div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
						<p class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
						<p class="mt-1 text-lg font-semibold text-slate-900">{value}</p>
					</div>
				{/each}
			</div>
			<div class="space-y-2">
				<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Highlights</p>
				{#each ['Closed Series A expansion with 3 enterprise logos', 'Cut onboarding time from 14 → 6 days', 'Shipped CompareSlider + CalendarApp in design system'] as item}
					<div class="flex gap-2 text-sm text-slate-700">
						<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span>
						<span>{item}</span>
					</div>
				{/each}
			</div>
		{:else if n === 2}
			<p class="text-sm font-semibold text-slate-800">Roadmap & owners</p>
			<div class="overflow-hidden rounded-lg border border-slate-200">
				<table class="w-full text-left text-sm">
					<thead class="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
						<tr>
							<th class="px-3 py-2 font-semibold">Initiative</th>
							<th class="px-3 py-2 font-semibold">Owner</th>
							<th class="px-3 py-2 font-semibold">Status</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 text-slate-700">
						{#each [['Editor dock', 'Design Sys', 'In progress'], ['Billing portal', 'Growth', 'Queued'], ['Mobile polish', 'Product', 'Done']] as [a, b, c]}
							<tr>
								<td class="px-3 py-2.5">{a}</td>
								<td class="px-3 py-2.5 text-slate-500">{b}</td>
								<td class="px-3 py-2.5">{c}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="h-28 rounded-lg border border-dashed border-slate-200 bg-slate-50/80"></div>
		{:else}
			<p class="text-sm font-semibold text-slate-800">Appendix</p>
			<div class="space-y-3 text-sm leading-relaxed text-slate-600">
				<p>
					Visual document preview for Storybook and apps where iframe PDF plugins fail silently.
					Pass a real <code class="rounded bg-slate-100 px-1 text-xs">src</code> when you need native
					embed, or keep preview mode for a reliable UI shell.
				</p>
				<p>
					Zoom, pagination, download and open actions stay available regardless of embed support.
				</p>
			</div>
			<div class="mt-4 grid grid-cols-2 gap-3">
				<div class="h-20 rounded-lg bg-slate-100"></div>
				<div class="h-20 rounded-lg bg-slate-100"></div>
			</div>
		{/if}

		<div
			class="mt-auto flex items-center justify-between border-t border-slate-200 pt-4 text-[10px] text-slate-400"
		>
			<span>R2DigiSolutions · Internal</span>
			<span>{n} / {totalPages}</span>
		</div>
	</div>
{/snippet}

<div
	bind:this={rootEl}
	class={[
		'flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
	style:height
>
	<div
		class="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2 sm:gap-3"
	>
		<div class="flex min-w-0 flex-1 items-center gap-2.5">
			<span
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400"
			>
				<FileText class="h-4 w-4" />
			</span>
			<div class="min-w-0">
				<p class="truncate text-sm font-medium text-primary">{displayName}</p>
				<p class="truncate text-[11px] text-muted">
					PDF
					{#if fileSize}· {fileSize}{/if}
					· {totalPages} pages
				</p>
			</div>
		</div>

		<div class="flex items-center gap-0.5 rounded-lg border border-border bg-surface-elevated p-0.5">
			<IconButton
				label="Previous page"
				size="sm"
				variant="ghost"
				disabled={currentPage <= 1}
				onclick={() => go(-1)}
			>
				<ChevronLeft class="h-4 w-4" />
			</IconButton>
			<span class="min-w-16 px-1 text-center text-xs font-medium tabular-nums text-secondary">
				{currentPage} / {totalPages}
			</span>
			<IconButton
				label="Next page"
				size="sm"
				variant="ghost"
				disabled={currentPage >= totalPages}
				onclick={() => go(1)}
			>
				<ChevronRight class="h-4 w-4" />
			</IconButton>
		</div>

		<div class="flex items-center gap-0.5 rounded-lg border border-border bg-surface-elevated p-0.5">
			<IconButton label="Zoom out" size="sm" variant="ghost" onclick={() => setZoom(zoomClamped - 10)}>
				<ZoomOut class="h-4 w-4" />
			</IconButton>
			<span class="min-w-12 px-1 text-center text-xs font-medium tabular-nums text-secondary">
				{zoomClamped}%
			</span>
			<IconButton label="Zoom in" size="sm" variant="ghost" onclick={() => setZoom(zoomClamped + 10)}>
				<ZoomIn class="h-4 w-4" />
			</IconButton>
		</div>

		<div class="flex items-center gap-0.5">
			{#if src}
				<IconButton label="Download PDF" size="sm" variant="ghost" onclick={openSrc}>
					<Download class="h-4 w-4" />
				</IconButton>
				<IconButton label="Open in new tab" size="sm" variant="ghost" onclick={openSrc}>
					<ExternalLink class="h-4 w-4" />
				</IconButton>
			{/if}
			<IconButton label="Fullscreen" size="sm" variant="ghost" onclick={toggleFullscreen}>
				<Maximize2 class="h-4 w-4" />
			</IconButton>
		</div>
	</div>

	<div class="relative min-h-0 flex-1 overflow-auto bg-zinc-200/80 dark:bg-zinc-900">
		{#if useEmbed && src}
			<object
				data={src}
				type="application/pdf"
				title={title}
				class="h-full w-full"
				onerror={onEmbedError}
			>
				<iframe {src} title={title} class="h-full w-full border-0" onerror={onEmbedError}></iframe>
			</object>
		{:else}
			<div
				class="flex min-h-full justify-center px-4 py-6 sm:px-8 sm:py-8"
				style:transform={`scale(${zoomClamped / 100})`}
				style:transform-origin="top center"
			>
				{#if children}
					{@render children(currentPage)}
				{:else}
					{@render defaultPage(currentPage)}
				{/if}
			</div>
		{/if}
	</div>

	{#if src && preview}
		<div
			class="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border bg-surface px-3 py-2"
		>
			<Text size="xs" tone="muted" as="span">
				Preview mode — native PDF embed is often blocked in Storybook / CSP.
			</Text>
			<Link href={src} external size="sm">
				Open PDF
			</Link>
		</div>
	{/if}
</div>
