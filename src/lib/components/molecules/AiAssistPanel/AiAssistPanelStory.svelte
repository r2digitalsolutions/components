<script lang="ts">
	import AiAssistPanel from './AiAssistPanel.svelte';
	import type { AiAssistMessage } from './AiAssistPanel.svelte';

	let messages = $state<AiAssistMessage[]>([
		{ id: '1', role: 'system', content: 'Context: ResourceStudio · customers' },
		{ id: '2', role: 'user', content: 'Write a filter for active VIP customers' },
		{
			id: '3',
			role: 'assistant',
			content: 'status:active AND tags:vip'
		}
	]);

	function onsubmit(prompt: string) {
		messages = [
			...messages,
			{
				id: String(Date.now()),
				role: 'assistant',
				content: `Suggested: ${prompt.includes('filter') ? 'status:active' : 'Done.'}`
			}
		];
	}
</script>

<div class="flex justify-center p-4">
	<AiAssistPanel
		bind:messages
		{onsubmit}
		snippets={['Summarize', 'Fix types', 'Write test']}
		oninsert={(t) => console.log('insert', t)}
	/>
</div>
