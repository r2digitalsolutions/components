<script lang="ts">
	import OnboardingPage from './OnboardingPage.svelte';

	let step = $state(0);
	let finished = $state('');
</script>

<div class="p-4">
	<OnboardingPage
		bind:step
		onfinish={(p) => (finished = `${p.workspace} · ${p.goals.join(',')}`)}
	/>
	{#if finished}
		<p class="mt-4 text-center text-xs text-muted">Finished: {finished}</p>
	{/if}
</div>
