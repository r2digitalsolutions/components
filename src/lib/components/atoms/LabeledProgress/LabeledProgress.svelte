<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import ProgressBar from '$lib/components/atoms/ProgressBar/ProgressBar.svelte';

	interface LabeledProgressProps {
		label: string;
		value: number;
		max?: number;
		helper?: string;
		showValue?: boolean;
		class?: string;
	}

	const {
		label,
		value,
		max = 100,
		helper,
		showValue = true,
		class: className = ''
	}: LabeledProgressProps = $props();

	const pct = $derived(Math.round(Math.min(100, Math.max(0, (value / max) * 100))));
</script>

<div class={['w-full space-y-2', className]}>
	<div class="flex items-center justify-between gap-2">
		<span class="text-sm font-medium text-primary">{label}</span>
		{#if showValue}
			<Badge size="sm" variant="secondary">{pct}%</Badge>
		{/if}
	</div>
	<ProgressBar {value} {max} />
	{#if helper}
		<p class="text-xs text-muted">{helper}</p>
	{/if}
</div>
