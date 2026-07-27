<script lang="ts">
	import HighlightMark from './HighlightMark.svelte';
</script>

<div class="flex max-w-md flex-col gap-4 text-sm text-primary">
	<p>
		Results for <HighlightMark text="dashboard" /> in your workspace.
	</p>
	<p>
		The <HighlightMark tone="warning">deprecated</HighlightMark> endpoint will be removed next month.
	</p>
	<p>
		<HighlightMark tone="success">Payment confirmed</HighlightMark> — receipt sent to your inbox.
	</p>
</div>
