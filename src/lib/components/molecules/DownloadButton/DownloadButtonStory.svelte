<script lang="ts">
	import DownloadButton from './DownloadButton.svelte';
</script>

<div class="flex flex-wrap gap-2">
	<DownloadButton href="/sample.pdf" filename="report.pdf" label="Download PDF" />
	<DownloadButton variant="primary" label="Export CSV" onclick={() => {}} />
	<DownloadButton size="md" loading label="Preparing…" />
</div>
