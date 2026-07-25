<script lang="ts">
	import Eyebrow from '$lib/components/atoms/Eyebrow/Eyebrow.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	interface StepHeaderProps {
		step?: number;
		total?: number;
		eyebrow?: string;
		title: string;
		description?: string;
		class?: string;
	}

	const {
		step,
		total,
		eyebrow,
		title,
		description,
		class: className = ''
	}: StepHeaderProps = $props();
</script>

<header class={['w-full space-y-2', className]}>
	<div class="flex flex-wrap items-center gap-2">
		{#if eyebrow}
			<Eyebrow>{eyebrow}</Eyebrow>
		{/if}
		{#if step != null && total != null}
			<Badge size="sm" variant="secondary">Step {step} of {total}</Badge>
		{/if}
	</div>
	<Heading level={2} size="xl">{title}</Heading>
	{#if description}
		<Text size="sm" tone="muted">{description}</Text>
	{/if}
</header>
