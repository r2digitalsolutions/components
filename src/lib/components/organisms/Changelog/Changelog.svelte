<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	export interface ChangelogEntry {
		id: string;
		version: string;
		date: string;
		title: string;
		body: string;
		tags?: string[];
	}

	interface ChangelogProps {
		title?: string;
		description?: string;
		entries?: ChangelogEntry[];
		class?: string;
	}

	const {
		title = 'Changelog',
		description = 'Product improvements and fixes.',
		entries = [],
		class: className = ''
	}: ChangelogProps = $props();
</script>

<div class={['mx-auto w-full max-w-2xl space-y-6', className]}>
	<PageHeader {title} {description} />

	<ol class="relative space-y-6 border-l border-border pl-6">
		{#each entries as entry (entry.id)}
			<li class="relative">
				<span
					class="absolute -left-[1.625rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-brand-500"
					aria-hidden="true"
				></span>
				<div class="mb-1 flex flex-wrap items-center gap-2">
					<span class="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">
						{entry.version}
					</span>
					<Text size="xs" tone="muted" as="span">{entry.date}</Text>
					{#each entry.tags ?? [] as tag}
						<Badge size="sm">{tag}</Badge>
					{/each}
				</div>
				<h3 class="text-sm font-semibold text-primary">{entry.title}</h3>
				<p class="mt-1 text-xs leading-relaxed text-secondary">{entry.body}</p>
			</li>
		{/each}
	</ol>
</div>
