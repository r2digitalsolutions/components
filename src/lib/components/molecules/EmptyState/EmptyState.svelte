<script lang="ts">
	import type { Snippet } from 'svelte';

	interface EmptyStateProps {
		title?: string;
		description?: string;
		icon?: Snippet;
		action?: Snippet;
		class?: string;
	}

	const {
		title = 'No data found',
		description = 'There are no items to display right now.',
		icon,
		action,
		class: className = ''
	}: EmptyStateProps = $props();
</script>

<div
	class={[
		'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-border bg-surface-elevated w-full',
		className
	]}
>
	<!-- Icon or illustration container -->
	<div class="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-xs">
		{#if icon}
			{@render icon()}
		{:else}
			<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
				<path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
			</svg>
		{/if}
	</div>

	<h3 class="text-base font-semibold text-primary mb-1">{title}</h3>
	{#if description}
		<p class="text-xs text-muted max-w-sm leading-relaxed mb-5">{description}</p>
	{/if}

	{#if action}
		{@render action()}
	{/if}
</div>
