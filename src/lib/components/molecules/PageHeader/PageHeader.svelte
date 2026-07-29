<script lang="ts">
	import type { Snippet } from 'svelte';
	import Breadcrumb from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import Skeleton from '$lib/components/atoms/Skeleton/Skeleton.svelte';

	type PageHeaderSize = 'sm' | 'md' | 'lg';

	interface PageHeaderProps {
		title: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		/** Visual size of the title + spacing. Default `md`. */
		size?: PageHeaderSize;
		/** Stick to the top when scrolling (adds backdrop-blur). */
		sticky?: boolean;
		/** Show skeleton placeholders instead of content while loading. */
		loading?: boolean;
		class?: string;
		/** Content placed before the title (e.g. a back-arrow button). */
		leading?: Snippet;
		/** Inline badge/status next to the title. */
		status?: Snippet;
		actions?: Snippet;
		/** Secondary info below the title (badges, meta text…). */
		meta?: Snippet;
		/** Tabs or secondary navigation below the header body. */
		tabs?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		description,
		breadcrumbs = [],
		size = 'md',
		sticky = false,
		loading = false,
		class: className = '',
		leading,
		status,
		actions,
		meta,
		tabs,
		children
	}: PageHeaderProps = $props();

	const titleSize: Record<PageHeaderSize, string> = {
		sm: 'text-lg font-semibold',
		md: 'text-2xl font-semibold',
		lg: 'text-3xl font-bold'
	};

	const spacing: Record<PageHeaderSize, string> = {
		sm: 'space-y-2',
		md: 'space-y-3',
		lg: 'space-y-4'
	};

	const resolvedSize = $derived<PageHeaderSize>(
		size === 'sm' || size === 'lg' ? size : 'md'
	);
</script>

<header
	class={[
		'w-full',
		spacing[resolvedSize],
		sticky && 'sticky top-0 z-10 bg-surface/90 backdrop-blur-md',
		sticky && 'border-b border-border pb-3',
		className
	]}
>
	{#if breadcrumbs.length}
		<Breadcrumb items={breadcrumbs} />
	{/if}

	<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
		<div class="flex min-w-0 items-center gap-2">
			{#if leading}
				<div class="shrink-0">
					{@render leading()}
				</div>
			{/if}

			<div class="min-w-0 space-y-0.5">
				{#if loading}
					<Skeleton
						variant="rounded"
						width={resolvedSize === 'lg' ? '14rem' : resolvedSize === 'sm' ? '9rem' : '12rem'}
						height={resolvedSize === 'lg' ? '2rem' : resolvedSize === 'sm' ? '1.25rem' : '1.75rem'}
					/>
					{#if description}
						<Skeleton variant="rounded" width="18rem" height="1rem" class="mt-1.5" />
					{/if}
				{:else}
					<div class="flex min-w-0 items-center gap-2">
						<h1 class={['truncate tracking-tight text-primary', titleSize[resolvedSize]]}>
							{title}
						</h1>
						{#if status}
							<div class="shrink-0">
								{@render status()}
							</div>
						{/if}
					</div>
					{#if description}
						<p class="max-w-2xl text-sm leading-snug text-muted">{description}</p>
					{/if}
					{#if meta}
						<div class="pt-1">
							{@render meta()}
						</div>
					{/if}
				{/if}
			</div>
		</div>

		{#if actions && !loading}
			<div class="flex shrink-0 flex-wrap items-center gap-2">
				{@render actions()}
			</div>
		{:else if loading}
			<div class="flex shrink-0 items-center gap-2">
				<Skeleton variant="rounded" width="6rem" height="2rem" />
				<Skeleton variant="rounded" width="5rem" height="2rem" />
			</div>
		{/if}
	</div>

	{#if tabs && !loading}
		<div>
			{@render tabs()}
		</div>
	{/if}

	{#if children}
		<div class="pt-1">
			{@render children()}
		</div>
	{/if}
</header>
