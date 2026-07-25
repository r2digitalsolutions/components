<script lang="ts">
	import StatusPage from './StatusPage.svelte';

	let props = $props<{ status?: 'success' | 'error' | 'info' | 'warning' | 'empty' }>();
</script>

<StatusPage
	status={props.status ?? 'success'}
	title="Payment confirmed"
	description="Thanks — your Pro plan is now active."
	primaryLabel="Go to dashboard"
	secondaryLabel="View invoice"
/>
