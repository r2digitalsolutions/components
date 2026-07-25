<script lang="ts">
	import DownloadButton from './DownloadButton.svelte';
	import type { DownloadStatus } from './DownloadButton.svelte';

	let asyncStatus = $state<DownloadStatus>('idle');
	let lastEvent = $state('—');

	async function fakeCsv() {
		await new Promise((r) => setTimeout(r, 1200));
		const csv = 'id,name,total\n1,Acme,120\n2,Globex,80\n';
		return new Blob([csv], { type: 'text/csv;charset=utf-8' });
	}

	async function fakeFail() {
		await new Promise((r) => setTimeout(r, 800));
		throw new Error('Network error');
	}

	async function fakePdf() {
		await new Promise((r) => setTimeout(r, 900));
		// Minimal valid-enough PDF bytes for a demo download
		const content = '%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n';
		return new Blob([content], { type: 'application/pdf' });
	}
</script>

<div class="space-y-8">
	<section class="space-y-2">
		<h3 class="text-sm font-semibold text-primary">Link download</h3>
		<div class="flex flex-wrap gap-2">
			<DownloadButton href="/favicon.png" filename="favicon.png" label="Download PNG" />
			<DownloadButton
				href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
				filename="dummy.pdf"
				label="Open PDF"
				openInNewTab
				variant="outline"
			/>
		</div>
	</section>

	<section class="space-y-2">
		<h3 class="text-sm font-semibold text-primary">Async (returns Blob)</h3>
		<div class="flex flex-wrap items-center gap-2">
			<DownloadButton
				bind:status={asyncStatus}
				filename="export.csv"
				label="Export CSV"
				variant="primary"
				ondownload={fakeCsv}
				onsuccess={() => (lastEvent = 'CSV ready')}
			/>
			<DownloadButton filename="report.pdf" label="Generate PDF" ondownload={fakePdf} />
			<DownloadButton
				label="Retry download"
				variant="destructive"
				ondownload={fakeFail}
				onerror={() => (lastEvent = 'Download failed')}
			/>
		</div>
		<p class="text-xs text-muted">
			Status: <code class="text-primary">{asyncStatus}</code> · Last event: {lastEvent}
		</p>
	</section>

	<section class="space-y-2">
		<h3 class="text-sm font-semibold text-primary">Sizes & variants</h3>
		<div class="flex flex-wrap items-center gap-2">
			<DownloadButton size="xs" label="XS" onclick={() => {}} />
			<DownloadButton size="sm" label="SM" onclick={() => {}} />
			<DownloadButton size="md" label="MD" variant="primary" onclick={() => {}} />
			<DownloadButton size="lg" label="LG" variant="outline" onclick={() => {}} />
			<DownloadButton size="sm" variant="ghost" label="Ghost" onclick={() => {}} />
			<DownloadButton size="sm" loading label="Preparing…" />
			<DownloadButton size="sm" disabled label="Disabled" />
		</div>
	</section>

	<section class="space-y-2">
		<h3 class="text-sm font-semibold text-primary">Icon only / full width</h3>
		<div class="flex max-w-sm flex-col gap-2">
			<div class="flex gap-2">
				<DownloadButton
					iconOnly
					label="Download"
					filename="notes.txt"
					ondownload={async () => 'hello from DownloadButton\n'}
				/>
				<DownloadButton iconOnly variant="primary" label="Download" onclick={() => {}} />
			</div>
			<DownloadButton fullWidth variant="secondary" label="Download all attachments" onclick={() => {}} />
		</div>
	</section>
</div>
