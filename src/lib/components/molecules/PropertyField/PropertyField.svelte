<script lang="ts">
	import type { Snippet } from 'svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface PropertyFieldProps {
		label: string;
		/** Label column width (CSS), default 40% */
		labelWidth?: string;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		label,
		labelWidth = '40%',
		disabled = false,
		class: className = '',
		children
	}: PropertyFieldProps = $props();
</script>

<div
	class={[
		'grid min-h-7 items-center gap-2 px-1 py-0.5',
		'rounded-sm hover:bg-surface-overlay/70',
		disabled && 'pointer-events-none opacity-50',
		className
	]}
	style:grid-template-columns={`${labelWidth} minmax(0, 1fr)`}
>
	<span class="truncate" title={label}>
		<Text size="xs" tone="secondary" as="span" class="font-medium">
			{label}
		</Text>
	</span>
	<div class="min-w-0">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
