<script lang="ts">
	import Meter from '$lib/components/atoms/Meter/Meter.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Users from '@lucide/svelte/icons/users';

	interface SeatMeterProps {
		label?: string;
		used?: number;
		total?: number;
		/** Soft warning threshold as fraction of total (default 0.8) */
		warnAt?: number;
		planName?: string;
		class?: string;
		onupgrade?: () => void;
		onmanage?: () => void;
	}

	let {
		label = 'Seats',
		used = 0,
		total = 10,
		warnAt = 0.8,
		planName,
		class: className = '',
		onupgrade,
		onmanage
	}: SeatMeterProps = $props();

	const ratio = $derived(total > 0 ? used / total : 0);
	const remaining = $derived(Math.max(0, total - used));
	const tone = $derived(
		ratio >= 1 ? 'error' : ratio >= warnAt ? 'warning' : ('brand' as const)
	);
</script>

<div
	class={[
		'w-full rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm',
		className
	]}
>
	<div class="flex items-start gap-3">
		<span
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"
		>
			<Users class="h-5 w-5" strokeWidth={2} />
		</span>
		<div class="min-w-0 flex-1 space-y-3">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div class="min-w-0">
					<p class="text-sm font-semibold text-primary">{label}</p>
					<p class="text-xs text-muted">
						<span class="tabular-nums font-medium text-secondary">{used}</span>
						of
						<span class="tabular-nums">{total}</span>
						used · {remaining} left
					</p>
				</div>
				{#if planName}
					<Badge size="sm" variant="secondary">{planName}</Badge>
				{/if}
			</div>

			<Meter value={used} max={total} {tone} size="sm" showValue={false} />

			{#if onupgrade || onmanage}
				<div class="flex flex-wrap gap-2">
					{#if onupgrade && ratio >= warnAt}
						<Button size="xs" onclick={() => onupgrade?.()}>Upgrade seats</Button>
					{/if}
					{#if onmanage}
						<Button size="xs" variant="ghost" onclick={() => onmanage?.()}>Manage</Button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
