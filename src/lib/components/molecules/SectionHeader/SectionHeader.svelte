<script lang="ts">
	import type { Snippet } from 'svelte';
	import SectionTitle from '$lib/components/atoms/SectionTitle/SectionTitle.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';

	interface SectionHeaderProps {
		title: string;
		description?: string;
		eyebrow?: string;
		divider?: boolean;
		class?: string;
		actions?: Snippet;
	}

	const {
		title,
		description,
		eyebrow,
		divider = true,
		class: className = '',
		actions
	}: SectionHeaderProps = $props();
</script>

<div class={['w-full space-y-3', className]}>
	<SectionTitle {title} {description} {eyebrow} {actions} />
	{#if divider}
		<Divider />
	{/if}
</div>
