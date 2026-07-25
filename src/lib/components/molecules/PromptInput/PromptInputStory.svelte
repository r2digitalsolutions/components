<script lang="ts">
	import PromptInput from './PromptInput.svelte';

	let value = $state('');
	let loading = $state(false);
	let log = $state<string[]>([]);

	function send(v: string) {
		log = [...log, v];
		value = '';
		loading = true;
		setTimeout(() => (loading = false), 1200);
	}
</script>

<div class="mx-auto max-w-xl space-y-3 rounded-2xl border border-border bg-surface-elevated p-4">
	{#if log.length}
		<ul class="space-y-1.5 rounded-xl bg-surface-overlay p-3 text-sm text-secondary">
			{#each log as msg, i (i)}
				<li><span class="font-medium text-primary">You:</span> {msg}</li>
			{/each}
		</ul>
	{/if}
	<PromptInput
		bind:value
		{loading}
		suggestions={['Summarize this doc', 'Write a unit test', 'Explain this error']}
		onsubmit={send}
		onstop={() => (loading = false)}
	/>
</div>
