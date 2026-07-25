<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Rating from '$lib/components/atoms/Rating/Rating.svelte';

	export interface TestimonialItem {
		id: string;
		quote: string;
		author: string;
		role?: string;
		avatar?: string;
		rating?: number;
	}

	interface TestimonialsProps {
		title?: string;
		items?: TestimonialItem[];
		columns?: 1 | 2 | 3;
		class?: string;
	}

	const {
		title = 'Loved by teams',
		items = [],
		columns = 3,
		class: className = ''
	}: TestimonialsProps = $props();

	const gridCols = {
		1: 'grid-cols-1',
		2: 'sm:grid-cols-2',
		3: 'sm:grid-cols-2 lg:grid-cols-3'
	};
</script>

<section class={['w-full space-y-5', className]}>
	{#if title}
		<h2 class="text-center text-lg font-semibold tracking-tight text-primary">{title}</h2>
	{/if}

	<ul class={['grid gap-4', gridCols[columns]]}>
		{#each items as item (item.id)}
			<li class="flex flex-col rounded-2xl border border-border bg-surface-elevated p-5">
				{#if item.rating !== undefined}
					<div class="mb-3">
						<Rating value={item.rating} readonly size="sm" />
					</div>
				{/if}
				<blockquote class="flex-1 text-sm leading-relaxed text-secondary">
					“{item.quote}”
				</blockquote>
				<footer class="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
					<Avatar name={item.author} src={item.avatar} size="sm" />
					<div class="min-w-0">
						<p class="truncate text-sm font-medium text-primary">{item.author}</p>
						{#if item.role}
							<Text size="xs" tone="muted" as="span">{item.role}</Text>
						{/if}
					</div>
				</footer>
			</li>
		{/each}
	</ul>
</section>
