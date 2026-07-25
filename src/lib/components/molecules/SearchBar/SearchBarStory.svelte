<script lang="ts">
	import SearchBar from './SearchBar.svelte';

	let props = $props<{ placeholder?: string; buttonLabel?: string; loading?: boolean }>();
	let value = $state('');
	let last = $state('');
</script>

<div class="max-w-xl">
	<SearchBar
		bind:value
		placeholder={props.placeholder ?? 'Search components…'}
		buttonLabel={props.buttonLabel ?? 'Search'}
		loading={props.loading ?? false}
		onsubmit={(q) => (last = q)}
	/>
	{#if last}
		<p class="mt-2 text-xs text-muted">Submitted: {last}</p>
	{/if}
</div>
