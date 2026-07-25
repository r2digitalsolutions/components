<script lang="ts">
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';

	export interface FeatureListItem {
		id: string;
		title: string;
		description?: string;
		icon?: 'check' | 'bolt' | 'shield' | 'spark';
	}

	interface FeatureListProps {
		title?: string;
		items?: FeatureListItem[];
		class?: string;
	}

	const { title, items = [], class: className = '' }: FeatureListProps = $props();

	const icons: Record<NonNullable<FeatureListItem['icon']>, string> = {
		check: 'M5 13l4 4L19 7',
		bolt: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
		shield: 'M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z',
		spark: 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1'
	};
</script>

<div class={['w-full space-y-3', className]}>
	{#if title}
		<Heading level={3} size="md">{title}</Heading>
	{/if}
	<Stack gap="md">
		{#each items as item (item.id)}
			<div class="flex gap-3">
				<span
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
					aria-hidden="true"
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={icons[item.icon ?? 'check']} />
					</svg>
				</span>
				<div class="min-w-0">
					<p class="text-sm font-medium text-primary">{item.title}</p>
					{#if item.description}
						<p class="mt-0.5 text-xs leading-relaxed text-muted">{item.description}</p>
					{/if}
				</div>
			</div>
		{/each}
	</Stack>
</div>
