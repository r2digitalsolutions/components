<script lang="ts">
	import LocaleSwitcher from './LocaleSwitcher.svelte';

	let value = $state('es');
</script>

<div class="max-w-xs">
	<LocaleSwitcher bind:value />
	<p class="mt-2 text-xs text-muted">Selected: {value}</p>
</div>
