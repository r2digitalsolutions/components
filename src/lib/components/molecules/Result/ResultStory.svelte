<script lang="ts">
	import Result from './Result.svelte';

	let props = $props<{
		status?: 'success' | 'error' | 'info' | 'warning' | 'empty';
		title?: string;
		description?: string;
	}>();
</script>

<div class="w-full max-w-lg rounded-2xl border border-border bg-surface-elevated">
	<Result
		status={props.status ?? 'success'}
		title={props.title ?? 'Payment completed'}
		description={props.description ?? 'Your invoice has been paid and a receipt was sent to your email.'}
		primaryAction={{ label: 'View receipt' }}
		secondaryAction={{ label: 'Back to dashboard' }}
	/>
</div>
