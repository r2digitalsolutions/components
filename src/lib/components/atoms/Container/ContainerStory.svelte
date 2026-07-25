<script lang="ts">
	import Container from './Container.svelte';

	const sizeOptions = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full'] as const;
	type SizeOption = (typeof sizeOptions)[number];

	let props = $props<{
		size?: SizeOption;
		padding?: 'none' | 'sm' | 'md' | 'lg';
	}>();

	const active: SizeOption = $derived(props.size ?? 'md');
	const pad = $derived(props.padding ?? 'md');

	const sizeLabels: Record<SizeOption, string> = {
		xs: '20rem',
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		'2xl': '1536px',
		'3xl': '48rem',
		'4xl': '56rem',
		'5xl': '64rem',
		'6xl': '72rem',
		'7xl': '80rem',
		full: '100%'
	};
</script>

<div class="w-full space-y-6">
	<div class="rounded-2xl border border-border bg-surface-overlay/60 p-4">
		<div class="mb-3 flex flex-wrap items-end justify-between gap-2">
			<div>
				<p class="text-sm font-semibold text-primary">Active container</p>
				<p class="text-xs text-muted">
					size=<span class="font-mono text-secondary">{active}</span>
					· max-width {sizeLabels[active]}
					· padding={pad}
				</p>
			</div>
		</div>

		<div
			class="overflow-hidden rounded-xl border border-dashed border-border-strong"
			style="background-image: linear-gradient(to right, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px); background-size: 20px 20px;"
		>
			<Container size={active} padding={pad}>
				<div
					class="my-4 rounded-xl border border-brand-300 bg-brand-50 px-4 py-6 text-center dark:border-brand-800 dark:bg-brand-950/40"
				>
					<p class="text-sm font-semibold text-brand-700 dark:text-brand-300">
						Content area · {active}
					</p>
					<p class="mt-1 text-xs text-brand-600/80 dark:text-brand-400/80">
						Centered with horizontal padding. Resize the canvas to compare breakpoints.
					</p>
				</div>
			</Container>
		</div>
	</div>

	<div>
		<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Size scale</p>
		<div class="space-y-1.5">
			{#each sizeOptions as s}
				<div class="flex items-center gap-3">
					<span class="w-10 shrink-0 text-right font-mono text-[11px] text-muted">{s}</span>
					<div class="h-2 flex-1 overflow-hidden rounded-full bg-surface-overlay">
						<div
							class={[
								'h-full rounded-full transition-all',
								s === active ? 'bg-brand-500' : 'bg-border-strong/70'
							]}
							style:width={s === 'full' ? '100%' : `min(100%, ${sizeLabels[s]})`}
						></div>
					</div>
					<span class="w-16 shrink-0 text-[10px] tabular-nums text-muted">{sizeLabels[s]}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
