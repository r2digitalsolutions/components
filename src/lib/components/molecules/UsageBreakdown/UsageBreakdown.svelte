<script lang="ts">
	export interface UsageBreakdownItem {
		id: string;
		label: string;
		value: number;
		max?: number;
		color?: string;
	}

	interface UsageBreakdownProps {
		items: UsageBreakdownItem[];
		unit?: string;
		class?: string;
	}

	let { items, unit = '', class: className = '' }: UsageBreakdownProps = $props();

	const totalMax = $derived(
		items.reduce((sum, item) => sum + (item.max ?? item.value), 0) || 1
	);

	const segments = $derived(
		items.map((item) => ({
			...item,
			pct: Math.min(100, Math.max(0, (item.value / totalMax) * 100))
		}))
	);

	const totalValue = $derived(items.reduce((sum, item) => sum + item.value, 0));

	const defaultColors = [
		'bg-brand-500',
		'bg-sky-500',
		'bg-amber-500',
		'bg-green-500',
		'bg-violet-500'
	];
</script>

<div class={['w-full space-y-4 rounded-xl border border-border bg-surface-elevated p-4', className]}>
	<div class="flex items-center justify-between gap-3">
		<p class="text-sm font-semibold text-primary">Usage breakdown</p>
		<p class="text-xs tabular-nums text-muted">
			<span class="font-medium text-secondary">{totalValue}</span>
			{unit}
		</p>
	</div>

	<div
		class="flex h-3 w-full overflow-hidden rounded-full bg-surface-overlay"
		role="img"
		aria-label="Stacked usage breakdown"
	>
		{#each segments as item, i (item.id)}
			<div
				class={[item.color ?? defaultColors[i % defaultColors.length], 'h-full transition-[width] duration-300']}
				style="width: {item.pct}%"
				title="{item.label}: {item.value}{unit}"
			></div>
		{/each}
	</div>

	<ul class="space-y-2">
		{#each segments as item, i (item.id)}
			<li class="flex items-center justify-between gap-3 text-xs">
				<div class="flex min-w-0 items-center gap-2">
					<span
						class={['h-2.5 w-2.5 shrink-0 rounded-full', item.color ?? defaultColors[i % defaultColors.length]]}
						aria-hidden="true"
					></span>
					<span class="truncate text-secondary">{item.label}</span>
				</div>
				<span class="shrink-0 tabular-nums text-muted">
					{item.value}{unit}
					{#if item.max != null}
						<span class="text-muted/70"> / {item.max}{unit}</span>
					{/if}
				</span>
			</li>
		{/each}
	</ul>
</div>
