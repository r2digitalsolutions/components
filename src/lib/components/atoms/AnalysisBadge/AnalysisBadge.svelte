<script module lang="ts">
	export type AnalysisStatus = 'idle' | 'queued' | 'processing' | 'complete' | 'failed';
</script>

<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	interface AnalysisBadgeProps {
		status: AnalysisStatus;
		labels?: Partial<Record<AnalysisStatus, string>>;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	const { status, labels = {}, size = 'md', class: className = '' }: AnalysisBadgeProps = $props();

	const defaultLabels: Record<AnalysisStatus, string> = {
		idle: 'Not analyzed',
		queued: 'Queued',
		processing: 'Analyzing',
		complete: 'Complete',
		failed: 'Failed'
	};

	const variants = {
		idle: 'default',
		queued: 'secondary',
		processing: 'info',
		complete: 'success',
		failed: 'error'
	} as const;

	const label = $derived(labels[status] ?? defaultLabels[status]);
</script>

<span class={className} role="status" aria-live={status === 'processing' ? 'polite' : 'off'}>
	<Badge variant={variants[status]} {size} rounded dot>{label}</Badge>
</span>
