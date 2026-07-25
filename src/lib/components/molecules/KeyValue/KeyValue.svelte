<script lang="ts">
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface KeyValueProps {
		label: string;
		value: string;
		orientation?: 'horizontal' | 'vertical';
		class?: string;
	}

	const {
		label,
		value,
		orientation = 'horizontal',
		class: className = ''
	}: KeyValueProps = $props();
</script>

<div
	class={[
		orientation === 'horizontal'
			? 'flex items-baseline justify-between gap-4'
			: 'flex flex-col gap-0.5',
		className
	]}
>
	<Text size="xs" tone="muted" as="span">{label}</Text>
	<span class="text-sm font-medium text-primary">{value}</span>
</div>
