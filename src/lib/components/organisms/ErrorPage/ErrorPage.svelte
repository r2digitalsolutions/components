<script lang="ts">
	import type { Snippet } from 'svelte';
	import StatusPage from '$lib/components/organisms/StatusPage/StatusPage.svelte';
	import Code from '$lib/components/atoms/Code/Code.svelte';
	import PropertyRow from '$lib/components/molecules/PropertyRow/PropertyRow.svelte';

	interface ErrorPageProps {
		code?: string | number;
		title?: string;
		description?: string;
		primaryLabel?: string;
		secondaryLabel?: string;
		requestId?: string;
		class?: string;
		extra?: Snippet;
		onprimary?: () => void;
		onsecondary?: () => void;
	}

	const {
		code = 404,
		title = 'Page not found',
		description = 'The page you requested does not exist or may have moved.',
		primaryLabel = 'Go home',
		secondaryLabel = 'Contact support',
		requestId,
		class: className = '',
		extra,
		onprimary,
		onsecondary
	}: ErrorPageProps = $props();
</script>

<StatusPage
	status="error"
	title={`${code} · ${title}`}
	{description}
	{primaryLabel}
	{secondaryLabel}
	class={className}
	{onprimary}
	{onsecondary}
>
	{#snippet extra()}
		<div class="mx-auto mt-2 w-full max-w-sm space-y-2">
			{#if requestId}
				<PropertyRow label="Request ID" value={requestId} copyable mono />
			{:else}
				<p class="text-center text-xs text-muted">
					Error code <Code>{String(code)}</Code>
				</p>
			{/if}
			{#if extra}{@render extra()}{/if}
		</div>
	{/snippet}
</StatusPage>
