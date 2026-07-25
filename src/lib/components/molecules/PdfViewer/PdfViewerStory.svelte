<script lang="ts">
	import PdfViewer from './PdfViewer.svelte';

	interface Props {
		variant?: 'default' | 'withSrc';
	}

	let { variant = 'default' }: Props = $props();

	let page = $state(1);
	let zoom = $state(100);
</script>

<div class="w-full space-y-3">
	{#if variant === 'default'}
		<PdfViewer
			bind:page
			bind:zoom
			title="Q4 Product Review"
			fileName="q4-product-review.pdf"
			fileSize="1.8 MB"
			pageCount={3}
			height="min(70vh, 44rem)"
			class="w-full"
		/>
	{:else}
		<PdfViewer
			bind:page
			bind:zoom
			src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
			title="Sample PDF"
			fileName="dummy.pdf"
			fileSize="13 KB"
			pageCount={1}
			preview={true}
			height="min(70vh, 44rem)"
			class="w-full"
		/>
	{/if}
</div>
