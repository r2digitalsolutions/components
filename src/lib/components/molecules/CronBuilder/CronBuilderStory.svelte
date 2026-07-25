<script lang="ts">
	import CronBuilder from './CronBuilder.svelte';

	let value = $state('0 9 * * 1-5');
</script>

<div class="max-w-lg">
	<CronBuilder bind:value />
</div>
