<script lang="ts">
	import Callout from './Callout.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		tone?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
		title?: string;
	}>();
</script>

<div class="w-full max-w-lg space-y-3">
	<Callout tone={props.tone ?? 'info'} title={props.title ?? 'Heads up'}>
		Your trial ends in 5 days. Upgrade to keep using advanced analytics.
		{#snippet actions()}
			<Button size="xs">Upgrade plan</Button>
		{/snippet}
	</Callout>
	<Callout tone="success" title="Deployed">Production release v1.4.2 is live.</Callout>
	<Callout tone="warning" title="Degraded performance">API latency is higher than usual.</Callout>
</div>
