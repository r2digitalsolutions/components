<script lang="ts">
	/**
	 * Lightweight visual barcode (Code 39–style pattern from the value string).
	 * For real scanning/printing use a dedicated encoder; this is UI-friendly.
	 */
	interface BarcodeProps {
		value: string;
		height?: number;
		showValue?: boolean;
		class?: string;
	}

	const {
		value,
		height = 56,
		showValue = true,
		class: className = ''
	}: BarcodeProps = $props();

	/** Map chars to bar/space widths (narrow=1, wide=2) — simplified Code 39 subset */
	const WIDTHS: Record<string, number[]> = {
		'0': [1, 1, 1, 2, 2, 1, 2, 1, 1],
		'1': [2, 1, 1, 2, 1, 1, 1, 1, 2],
		'2': [1, 1, 2, 2, 1, 1, 1, 1, 2],
		'3': [2, 1, 2, 2, 1, 1, 1, 1, 1],
		'4': [1, 1, 1, 2, 2, 1, 1, 1, 2],
		'5': [2, 1, 1, 2, 2, 1, 1, 1, 1],
		'6': [1, 1, 2, 2, 2, 1, 1, 1, 1],
		'7': [1, 1, 1, 2, 1, 1, 2, 1, 2],
		'8': [2, 1, 1, 2, 1, 1, 2, 1, 1],
		'9': [1, 1, 2, 2, 1, 1, 2, 1, 1],
		A: [2, 1, 1, 1, 1, 2, 1, 1, 2],
		B: [1, 1, 2, 1, 1, 2, 1, 1, 2],
		C: [2, 1, 2, 1, 1, 2, 1, 1, 1],
		D: [1, 1, 1, 1, 2, 2, 1, 1, 2],
		E: [2, 1, 1, 1, 2, 2, 1, 1, 1],
		F: [1, 1, 2, 1, 2, 2, 1, 1, 1],
		'*': [1, 2, 1, 1, 2, 1, 2, 1, 1]
	};

	const bars = $derived.by(() => {
		const raw = value.toUpperCase().replace(/[^0-9A-Z]/g, '') || '0';
		const chars = ['*', ...raw.split(''), '*'];
		const out: { w: number; black: boolean }[] = [];
		for (const ch of chars) {
			const pattern = WIDTHS[ch] ?? WIDTHS['0'];
			pattern.forEach((w, i) => out.push({ w, black: i % 2 === 0 }));
			out.push({ w: 1, black: false }); // gap
		}
		return out;
	});

	const totalUnits = $derived(bars.reduce((s, b) => s + b.w, 0));
</script>

<figure class={['inline-flex flex-col items-center gap-1.5', className]}>
	<svg
		role="img"
		aria-label={`Barcode ${value}`}
		height={height}
		viewBox={`0 0 ${totalUnits} ${height}`}
		class="w-full max-w-xs text-primary"
		preserveAspectRatio="none"
	>
		{#each bars as bar, i}
			{@const x = bars.slice(0, i).reduce((s, b) => s + b.w, 0)}
			{#if bar.black}
				<rect x={x} y="0" width={bar.w} height={height} fill="currentColor" />
			{/if}
		{/each}
	</svg>
	{#if showValue}
		<figcaption class="font-mono text-[11px] tracking-widest text-secondary">{value}</figcaption>
	{/if}
</figure>
