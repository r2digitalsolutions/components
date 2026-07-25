<script lang="ts">
	import CopyButton from '$lib/components/molecules/CopyButton/CopyButton.svelte';

	interface CopyFieldProps {
		value: string;
		label?: string;
		masked?: boolean;
		class?: string;
		oncopy?: () => void;
	}

	const {
		value,
		label,
		masked = false,
		class: className = '',
		oncopy
	}: CopyFieldProps = $props();

	const display = $derived(
		masked ? value.replace(/.(?=.{4})/g, '•') : value
	);
</script>

<div class={['w-full', className]}>
	{#if label}
		<p class="mb-1.5 text-xs font-medium text-secondary">{label}</p>
	{/if}
	<div
		class="flex items-center gap-2 rounded-lg border border-border bg-surface-overlay/50 px-2.5 py-1.5"
	>
		<code class="min-w-0 flex-1 truncate font-mono text-xs text-primary" title={value}>
			{display}
		</code>
		<CopyButton {value} size="xs" variant="ghost" label="Copy" {oncopy} />
	</div>
</div>
