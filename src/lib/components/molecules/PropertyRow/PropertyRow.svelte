<script lang="ts">
	import type { Snippet } from 'svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import CopyButton from '$lib/components/molecules/CopyButton/CopyButton.svelte';
	import Code from '$lib/components/atoms/Code/Code.svelte';

	interface PropertyRowProps {
		label: string;
		value: string;
		copyable?: boolean;
		mono?: boolean;
		class?: string;
		actions?: Snippet;
	}

	const {
		label,
		value,
		copyable = false,
		mono = false,
		class: className = '',
		actions
	}: PropertyRowProps = $props();
</script>

<div
	class={[
		'flex flex-col gap-2 rounded-xl border border-border bg-surface-elevated px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between',
		className
	]}
>
	<div class="min-w-0 space-y-0.5">
		<Text size="xs" tone="muted" as="span">{label}</Text>
		{#if mono}
			<div class="truncate"><Code>{value}</Code></div>
		{:else}
			<p class="truncate text-sm font-medium text-primary">{value}</p>
		{/if}
	</div>
	<div class="flex shrink-0 items-center gap-2">
		{#if copyable}
			<CopyButton {value} size="xs" variant="ghost" label="Copy" copiedLabel="Copied" />
		{/if}
		{#if actions}
			{@render actions()}
		{/if}
	</div>
</div>
