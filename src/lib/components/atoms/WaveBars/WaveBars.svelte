<script lang="ts">
	interface WaveBarsProps {
		bars?: number[];
		count?: number;
		active?: boolean;
		barCount?: number;
		height?: number;
		/** 0–1 playback progress — continuous fill, not bar steps */
		progress?: number;
		tone?: 'brand' | 'danger' | 'neutral';
		class?: string;
	}

	const {
		bars,
		count,
		active = false,
		barCount = 32,
		height = 32,
		progress,
		tone = 'brand',
		class: className = ''
	}: WaveBarsProps = $props();

	const resolvedBars = $derived.by(() => {
		if (bars?.length) return bars.map((v) => Math.min(1, Math.max(0, v)));
		const n = count ?? barCount;
		return Array.from({ length: n }, (_, i) => {
			const t = i / Math.max(1, n - 1);
			return 0.22 + 0.55 * Math.abs(Math.sin(t * Math.PI * 3.2));
		});
	});

	const fillTone: Record<'brand' | 'danger' | 'neutral', string> = {
		brand: 'bg-brand-500',
		danger: 'bg-red-500',
		neutral: 'bg-secondary'
	};

	const baseTone = $derived(
		active ? fillTone[tone] : 'bg-border-strong/70 dark:bg-border'
	);

	const playedTone: Record<'brand' | 'danger' | 'neutral', string> = {
		brand: 'bg-brand-600 dark:bg-brand-400',
		danger: 'bg-red-600 dark:bg-red-400',
		neutral: 'bg-primary'
	};

	const hasProgress = $derived(progress !== undefined && progress >= 0);
	const progressPct = $derived(Math.min(100, Math.max(0, (progress ?? 0) * 100)));
</script>

{#snippet barRow(colorClass: string, animateHeight: boolean)}
	<div class="flex h-full w-full min-w-0 items-end justify-between gap-[2px]">
		{#each resolvedBars as bar, i (i)}
			<span
				class={[
					'min-w-[2px] flex-1 rounded-full',
					colorClass,
					animateHeight && 'transition-[height] duration-75 ease-out'
				]}
				style={`height: ${Math.max(12, bar * 100)}%`}
				aria-hidden="true"
			></span>
		{/each}
	</div>
{/snippet}

<div
	class={['relative inline-flex w-full min-w-0', className]}
	style={`height: ${height}px`}
	role="img"
	aria-label={active ? 'Live audio levels' : 'Audio waveform'}
>
	{@render barRow(baseTone, active && !hasProgress)}

	{#if hasProgress}
		<div
			class="pointer-events-none absolute inset-0 overflow-hidden"
			style={`width: ${progressPct}%`}
		>
			<div class="h-full" style={`width: ${progressPct > 0 ? 10000 / progressPct : 100}%`}>
				{@render barRow(playedTone[tone], false)}
			</div>
		</div>
	{/if}
</div>
