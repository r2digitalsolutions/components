<script lang="ts">
	import CountrySelect from './CountrySelect.svelte';

	let value = $state('ES');
</script>

<div class="max-w-xs">
	<CountrySelect bind:value />
</div>
