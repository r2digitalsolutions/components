<script lang="ts">
	import type { Snippet } from 'svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	interface FormSectionProps {
		title: string;
		description?: string;
		/** Show divider below header (default true) */
		divided?: boolean;
		class?: string;
		actions?: Snippet;
		children?: Snippet;
	}

	const {
		title,
		description,
		divided = true,
		class: className = '',
		actions,
		children
	}: FormSectionProps = $props();
</script>

<section class={['w-full space-y-4', className]}>
	<div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
		<div class="min-w-0 space-y-1">
			<h2 class="text-sm font-semibold text-primary">{title}</h2>
			{#if description}
				<p class="max-w-2xl text-xs leading-relaxed text-muted">{description}</p>
			{/if}
		</div>
		{#if actions}
			<div class="flex shrink-0 flex-wrap items-center gap-2">
				{@render actions()}
			</div>
		{/if}
	</div>

	{#if divided}
		<Divider />
	{/if}

	{#if children}
		<Stack gap="md">
			{@render children()}
		</Stack>
	{/if}
</section>
