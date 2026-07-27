<script lang="ts">
	import SmartSuggestion from './SmartSuggestion.svelte';

	let visible = $state(true);
	let last = $state('');

	const suggestions = [
		{
			title: 'Upgrade to Pro for 2× API limits',
			body: 'Based on your usage this month, Pro would save you overage fees.',
			actionLabel: 'View plans'
		}
	];
</script>

<div class="mx-auto max-w-lg space-y-4 p-4">
	{#if visible}
		<SmartSuggestion
			title={suggestions[0].title}
			body={suggestions[0].body}
			actionLabel={suggestions[0].actionLabel}
			onaction={() => (last = 'action')}
			ondismiss={() => {
				visible = false;
				last = 'dismissed';
			}}
		/>
	{:else}
		<p class="text-center text-sm text-muted">Suggestion dismissed.</p>
	{/if}
	{#if last}
		<p class="text-center text-xs text-muted">Event: {last}</p>
	{/if}
</div>
