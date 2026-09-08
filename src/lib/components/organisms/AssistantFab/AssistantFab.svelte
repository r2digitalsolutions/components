<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import { Sparkles } from '@lucide/svelte';

	interface AssistantFabProps {
		label?: string;
		onclick?: () => void;
		class?: string;
	}

	let {
		label = 'Abrir asistente',
		onclick,
		class: className = ''
	}: AssistantFabProps = $props();
</script>

<IconButton
	variant="primary"
	size="xl"
	rounded
	{label}
	onclick={() => onclick?.()}
	class={['shadow-lg shadow-brand-500/30', className].filter(Boolean).join(' ')}
>
	<Sparkles size={22} strokeWidth={2} />
</IconButton>
