<script lang="ts">
	import type { Snippet } from 'svelte';
	import Breadcrumb from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';

	interface PageHeaderProps {
		title: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		class?: string;
		actions?: Snippet;
		meta?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		description,
		breadcrumbs = [],
		class: className = '',
		actions,
		meta,
		children
	}: PageHeaderProps = $props();
</script>

<header class={['w-full space-y-3', className]}>
	{#if breadcrumbs.length}
		<Breadcrumb items={breadcrumbs} />
	{/if}

	<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
		<div class="min-w-0 space-y-0.5">
			<h1 class="truncate text-2xl font-semibold tracking-tight text-primary">{title}</h1>
			{#if description}
				<p class="max-w-2xl text-sm leading-snug text-muted">{description}</p>
			{/if}
			{#if meta}
				<div class="pt-1">
					{@render meta()}
				</div>
			{/if}
		</div>

		{#if actions}
			<div class="flex shrink-0 flex-wrap items-center gap-2">
				{@render actions()}
			</div>
		{/if}
	</div>

	{#if children}
		<div class="pt-1">
			{@render children()}
		</div>
	{/if}
</header>
