<script lang="ts">
	import Meter from '$lib/components/atoms/Meter/Meter.svelte';
	import TrendArrow from '$lib/components/atoms/TrendArrow/TrendArrow.svelte';
	import type { TrendDirection } from '$lib/components/atoms/TrendArrow/TrendArrow.svelte';

	export type GoalProgressTone = 'brand' | 'success' | 'warning';

	interface GoalProgressProps {
		label: string;
		current: number;
		target: number;
		unit?: string;
		tone?: GoalProgressTone;
		showTrend?: boolean;
		class?: string;
	}

	let {
		label,
		current,
		target,
		unit = '',
		tone = 'brand',
		showTrend = true,
		class: className = ''
	}: GoalProgressProps = $props();

	const pct = $derived(target > 0 ? Math.min(100, (current / target) * 100) : 0);
	const remaining = $derived(Math.max(0, target - current));
	const complete = $derived(current >= target);

	const meterTone = $derived(
		tone === 'success' ? 'success' : tone === 'warning' ? 'warning' : ('brand' as const)
	);

	const trendDirection = $derived<TrendDirection>(
		pct >= 100 ? 'up' : pct >= 50 ? 'flat' : 'down'
	);
</script>

<div
	class={[
		'w-full rounded-xl border border-border bg-surface-elevated p-4 shadow-sm',
		className
	]}
>
	<div class="mb-3 flex items-start justify-between gap-3">
		<div class="min-w-0 space-y-1">
			<p class="text-sm font-semibold text-primary">{label}</p>
			<p class="text-xs text-muted">
				<span class="tabular-nums font-medium text-secondary">{current}{unit}</span>
				of
				<span class="tabular-nums">{target}{unit}</span>
				{#if !complete}
					· {remaining}{unit} left
				{:else}
					· Goal reached
				{/if}
			</p>
		</div>
		{#if showTrend}
			<TrendArrow direction={trendDirection} size="sm" />
		{/if}
	</div>

	<Meter value={current} max={target} tone={meterTone} size="sm" showValue={false} />
</div>
