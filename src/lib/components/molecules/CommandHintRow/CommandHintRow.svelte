<script lang="ts">
	import Kbd from '$lib/components/atoms/Kbd/Kbd.svelte';

	interface CommandHintRowProps {
		label: string;
		keys?: string[];
		class?: string;
	}

	const { label, keys = [], class: className = '' }: CommandHintRowProps = $props();
</script>

<div
	class={[
		'flex items-center justify-between gap-4 rounded-lg border border-border bg-surface-elevated px-3 py-2',
		className
	]}
>
	<span class="text-sm text-secondary">{label}</span>
	<Kbd {keys} size="sm" />
</div>
