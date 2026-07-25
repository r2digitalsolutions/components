<script lang="ts">
	import ReceiptCard from './ReceiptCard.svelte';

	let last = $state('');
</script>

<div class="flex justify-center p-4">
	<ReceiptCard
		ondownload={() => (last = 'download')}
		onviewinvoice={() => (last = 'invoice')}
	/>
</div>
{#if last}
	<p class="text-center text-xs text-muted">Action: {last}</p>
{/if}
