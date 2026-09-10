<script lang="ts">
	import { encodeBarcode, type BarcodeSymbology } from '$lib/utils/barcode.js';

	interface BarcodeProps {
		value: string;
		height?: number;
		showValue?: boolean;
		/** Force a symbology. `auto` picks EAN/UPC when the value is a valid GTIN. */
		format?: 'auto' | BarcodeSymbology;
		class?: string;
	}

	const {
		value,
		height = 72,
		showValue = true,
		format = 'auto',
		class: className = ''
	}: BarcodeProps = $props();

	const encoded = $derived(encodeBarcode(value, format));
	const label = $derived(encoded?.text || value);
</script>

<figure class={['max-w-sm gap-2 inline-flex w-full flex-col items-center', className]}>
	{#if encoded}
		<div class="rounded-lg bg-white px-2 py-3 w-full">
			<svg
				role="img"
				aria-label={`Barcode ${label}`}
				{height}
				viewBox="0 0 {encoded.modules} {height}"
				class="text-black block w-full"
				preserveAspectRatio="none"
			>
				<title>{label}</title>
				<rect width={encoded.modules} {height} fill="#fff" />
				{#each encoded.runs as run (run.x)}
					{#if run.black}
						<rect x={run.x} y="0" width={run.w} {height} fill="#000" />
					{/if}
				{/each}
			</svg>
		</div>
		{#if showValue}
			<figcaption class="font-mono tracking-widest text-secondary text-[11px]">{label}</figcaption>
		{/if}
	{:else}
		<figcaption class="font-mono tracking-widest text-secondary text-[11px]">{value}</figcaption>
	{/if}
</figure>
