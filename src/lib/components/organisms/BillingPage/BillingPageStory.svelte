<script lang="ts">
	import BillingPage from './BillingPage.svelte';

	let props = $props<{ status?: 'active' | 'past_due' | 'canceled' }>();
</script>

<div class="mx-auto max-w-4xl p-4">
	<BillingPage status={props.status ?? 'active'} />
</div>
