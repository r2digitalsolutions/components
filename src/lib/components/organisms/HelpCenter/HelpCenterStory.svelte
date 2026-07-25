<script lang="ts">
	import HelpCenter from './HelpCenter.svelte';

	let query = $state('');
</script>

<div class="mx-auto max-w-3xl p-4">
	<HelpCenter bind:query />
</div>
