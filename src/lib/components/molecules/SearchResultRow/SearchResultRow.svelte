<script lang="ts">
	import type { Snippet } from 'svelte'

	export type SearchResultRowKind = 'doc' | 'page' | 'person' | 'file' | 'product' | string

	interface SearchResultRowProps {
		title: string
		href?: string
		/** Breadcrumb text shown below the title */
		urlLabel?: string
		snippet?: string
		kind?: SearchResultRowKind
		/** URL or path to a favicon/icon image */
		favicon?: string
		class?: string
		/** Optional leading slot (replaces favicon when provided) */
		leading?: Snippet
	}

	let {
		title,
		href,
		urlLabel,
		snippet,
		kind: _kind,
		favicon,
		class: className = '',
		leading
	}: SearchResultRowProps = $props()

	const hasLeading = $derived(!!leading || !!favicon)
</script>

<div class={['group flex min-w-0 gap-3 py-2', className]}>
	{#if hasLeading}
		<div class="mt-0.5 shrink-0">
			{#if leading}
				{@render leading()}
			{:else if favicon}
				<img
					src={favicon}
					alt=""
					aria-hidden="true"
					class="h-4 w-4 rounded-sm object-contain"
					loading="lazy"
					decoding="async"
				/>
			{/if}
		</div>
	{/if}

	<div class="min-w-0 flex-1">
		{#if urlLabel}
			<p class="mb-0.5 truncate text-xs text-muted">{urlLabel}</p>
		{/if}

		{#if href}
			<a
				{href}
				class="block truncate text-lg font-medium leading-snug text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
			>
				{title}
			</a>
		{:else}
			<span class="block truncate text-lg font-medium leading-snug text-brand-600">
				{title}
			</span>
		{/if}

		{#if snippet}
			<p class="mt-1 line-clamp-2 text-sm text-secondary">{snippet}</p>
		{/if}
	</div>
</div>
