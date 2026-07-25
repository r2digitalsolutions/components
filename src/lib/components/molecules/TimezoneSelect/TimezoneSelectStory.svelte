<script lang="ts">
	import TimezoneSelect from './TimezoneSelect.svelte';

	let value = $state('Europe/Madrid');
</script>

<div class="max-w-sm">
	<TimezoneSelect bind:value />
</div>
