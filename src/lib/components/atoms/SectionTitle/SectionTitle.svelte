<script lang="ts">
	import type { Snippet } from 'svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import type { HeadingLevel, HeadingSize } from '$lib/components/atoms/Heading/Heading.svelte';

	interface SectionTitleProps {
		title: string;
		description?: string;
		level?: HeadingLevel;
		size?: HeadingSize;
		eyebrow?: string;
		class?: string;
		actions?: Snippet;
	}

	const {
		title,
		description,
		level = 2,
		size = 'lg',
		eyebrow,
		class: className = '',
		actions
	}: SectionTitleProps = $props();
</script>

<div class={['flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className]}>
	<div class="min-w-0 space-y-1">
		{#if eyebrow}
			<p class="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
				{eyebrow}
			</p>
		{/if}
		<Heading {level} {size}>{title}</Heading>
		{#if description}
			<p class="max-w-2xl text-sm text-secondary">{description}</p>
		{/if}
	</div>
	{#if actions}
		<div class="flex shrink-0 items-center gap-2">
			{@render actions()}
		</div>
	{/if}
</div>
