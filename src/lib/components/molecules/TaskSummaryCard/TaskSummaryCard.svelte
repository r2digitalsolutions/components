<script lang="ts">
	import ProgressBar from '$lib/components/atoms/ProgressBar/ProgressBar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	interface TaskSummaryCardProps {
		title: string;
		total: number;
		done: number;
		overdue?: number;
		class?: string;
		onclick?: () => void;
	}

	const {
		title,
		total,
		done,
		overdue = 0,
		class: className = '',
		onclick
	}: TaskSummaryCardProps = $props();

	const remaining = $derived(Math.max(0, total - done));
	const percentage = $derived(total > 0 ? (done / total) * 100 : 0);
	const variant = $derived(
		overdue > 0 ? 'warning' : percentage >= 100 ? 'success' : 'primary'
	);

	const baseClass =
		'flex w-full flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-4 text-left';
</script>

{#snippet body()}
	<div class="flex items-start justify-between gap-3">
		<div>
			<p class="text-sm font-semibold text-primary">{title}</p>
			<p class="mt-0.5 text-xs text-muted">
				<span class="font-medium text-secondary">{done}</span> of {total} complete
			</p>
		</div>
		<div class="flex flex-col items-end gap-1">
			<span class="text-2xl font-semibold tabular-nums text-primary">{remaining}</span>
			<span class="text-[10px] uppercase tracking-wide text-muted">remaining</span>
		</div>
	</div>

	<ProgressBar value={done} max={total || 1} {variant} size="sm" />

	{#if overdue > 0}
		<div class="flex items-center gap-2">
			<Badge size="sm" variant="error">{overdue} overdue</Badge>
		</div>
	{/if}
{/snippet}

{#if onclick}
	<button
		type="button"
		class={[
			baseClass,
			'cursor-pointer transition-colors hover:border-brand-500/30 hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			className
		]}
		onclick={() => onclick?.()}
	>
		{@render body()}
	</button>
{:else}
	<div class={[baseClass, className]}>
		{@render body()}
	</div>
{/if}
