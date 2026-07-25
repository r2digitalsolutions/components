<script lang="ts">
	import FeatureFlagsPage from './FeatureFlagsPage.svelte';

	let last = $state('');
</script>

<div class="p-4">
	<FeatureFlagsPage
		oncreate={() => (last = 'create')}
		onchange={(id, en) => (last = `${en ? 'on' : 'off'}:${id}`)}
		onedit={(id) => (last = `edit:${id}`)}
	/>
</div>
{#if last}
	<p class="text-center text-xs text-muted">Action: {last}</p>
{/if}
