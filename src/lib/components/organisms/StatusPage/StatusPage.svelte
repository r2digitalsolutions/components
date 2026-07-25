<script lang="ts">
	import type { Snippet } from 'svelte';
	import Result from '$lib/components/molecules/Result/Result.svelte';
	import Center from '$lib/components/atoms/Center/Center.svelte';
	import Container from '$lib/components/atoms/Container/Container.svelte';

	type Status = 'success' | 'error' | 'info' | 'warning' | 'empty';

	interface StatusPageProps {
		status?: Status;
		title?: string;
		description?: string;
		primaryLabel?: string;
		secondaryLabel?: string;
		class?: string;
		extra?: Snippet;
		onprimary?: () => void;
		onsecondary?: () => void;
	}

	const {
		status = 'success',
		title = 'All set',
		description = 'Your changes have been saved successfully.',
		primaryLabel = 'Continue',
		secondaryLabel,
		class: className = '',
		extra,
		onprimary,
		onsecondary
	}: StatusPageProps = $props();
</script>

<Center padding="lg" minHeight="24rem" class={className}>
	<Container size="sm" padding="none">
		<Result
			{status}
			{title}
			{description}
			primaryAction={{ label: primaryLabel, onclick: onprimary }}
			secondaryAction={secondaryLabel ? { label: secondaryLabel, onclick: onsecondary } : undefined}
		>
			{#snippet extra()}
				{#if extra}{@render extra()}{/if}
			{/snippet}
		</Result>
	</Container>
</Center>
