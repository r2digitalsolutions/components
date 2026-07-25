<script lang="ts">
	import Alert, { type AlertItem } from './Alert.svelte';

	let props = $props<{
		variant?: 'info' | 'success' | 'warning' | 'error';
		title?: string;
		message?: string;
		items?: AlertItem[];
		dismissible?: boolean;
	}>();
</script>

<div class="flex w-full max-w-lg flex-col gap-3">
	<Alert
		variant={props.variant ?? 'info'}
		title={props.title ?? 'Update available'}
		message={props.message ?? 'A new software version (v2.4.0) is ready to install.'}
		items={props.items}
		dismissible={props.dismissible ?? true}
	/>
	<Alert variant="success" title="Payment received" message="Invoice #1842 was paid successfully." />
	<Alert
		variant="warning"
		title="Quota almost full"
		message="You have used 92% of your storage plan."
		dismissible
	/>
	<Alert
		variant="error"
		title="Sync failed"
		message="We could not reach the remote repository."
		items={[
			{ text: 'Check your network connection' },
			{ text: 'Retry in a few minutes' }
		]}
		dismissible
	/>
</div>
