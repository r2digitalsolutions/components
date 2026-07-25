<script lang="ts">
	type StatusTone = 'online' | 'offline' | 'busy' | 'away' | 'neutral';
	type StatusSize = 'sm' | 'md' | 'lg';

	interface StatusDotProps {
		status?: StatusTone;
		size?: StatusSize;
		pulse?: boolean;
		label?: string;
		showLabel?: boolean;
		class?: string;
	}

	let {
		status = 'neutral',
		size = 'md',
		pulse = false,
		label,
		showLabel = false,
		class: className = ''
	}: StatusDotProps = $props();

	const tones: Record<StatusTone, string> = {
		online: 'bg-green-500',
		offline: 'bg-zinc-400 dark:bg-zinc-500',
		busy: 'bg-red-500',
		away: 'bg-amber-500',
		neutral: 'bg-sky-500'
	};

	const sizes: Record<StatusSize, string> = {
		sm: 'h-1.5 w-1.5',
		md: 'h-2.5 w-2.5',
		lg: 'h-3.5 w-3.5'
	};

	const defaultLabels: Record<StatusTone, string> = {
		online: 'Online',
		offline: 'Offline',
		busy: 'Busy',
		away: 'Away',
		neutral: 'Status'
	};

	const resolvedLabel = $derived(label ?? defaultLabels[status]);
</script>

<span class={['inline-flex items-center gap-2', className]} role="status" aria-label={resolvedLabel}>
	<span class="relative inline-flex shrink-0">
		<span class={['rounded-full', tones[status], sizes[size]]} aria-hidden="true"></span>
		{#if pulse && status !== 'offline'}
			<span
				class={['absolute inset-0 animate-ping rounded-full opacity-60', tones[status]]}
				aria-hidden="true"
			></span>
		{/if}
	</span>
	{#if showLabel}
		<span class="text-sm text-secondary">{resolvedLabel}</span>
	{/if}
</span>
