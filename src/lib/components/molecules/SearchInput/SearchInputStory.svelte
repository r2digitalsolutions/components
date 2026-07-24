<script lang="ts">
	import SearchInput from './SearchInput.svelte';

	let props = $props<{
		placeholder?: string;
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
	}>();

	let value = $state('');
	let lastSubmit = $state('');
</script>

<div class="w-80 max-w-full space-y-2">
	<SearchInput
		bind:value
		placeholder={props.placeholder ?? 'Search projects…'}
		size={props.size ?? 'md'}
		disabled={props.disabled ?? false}
		onsubmit={(v) => (lastSubmit = v)}
	/>
	{#if lastSubmit}
		<p class="text-xs text-muted">Submitted: {lastSubmit}</p>
	{/if}
</div>
