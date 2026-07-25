<script lang="ts">
	import StatusPage from '$lib/components/organisms/StatusPage/StatusPage.svelte';
	import Countdown from '$lib/components/molecules/Countdown/Countdown.svelte';
	import type { Snippet } from 'svelte';

	interface ComingSoonPageProps {
		title?: string;
		description?: string;
		launchAt?: string | Date;
		primaryLabel?: string;
		secondaryLabel?: string;
		class?: string;
		extra?: Snippet;
		onprimary?: () => void;
		onsecondary?: () => void;
	}

	const {
		title = 'Coming soon',
		description = 'We are putting the finishing touches on something great. Stay tuned.',
		launchAt,
		primaryLabel = 'Notify me',
		secondaryLabel = 'Follow updates',
		class: className = '',
		extra,
		onprimary,
		onsecondary
	}: ComingSoonPageProps = $props();

	const target = $derived(
		launchAt instanceof Date
			? launchAt
			: launchAt
				? new Date(launchAt)
				: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
	);
</script>

<StatusPage
	status="info"
	{title}
	{description}
	{primaryLabel}
	{secondaryLabel}
	class={className}
	{onprimary}
	{onsecondary}
>
	{#snippet extra()}
		<div class="mx-auto mt-4 w-full max-w-md">
			<Countdown target={target} />
			{#if extra}{@render extra()}{/if}
		</div>
	{/snippet}
</StatusPage>
