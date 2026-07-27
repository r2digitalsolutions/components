<script lang="ts">
	export type LatencyPillTone = 'auto' | 'good' | 'warn' | 'bad';
	export type LatencyPillSize = 'sm' | 'md';

	interface LatencyPillProps {
		ms: number;
		label?: string;
		tone?: LatencyPillTone;
		size?: LatencyPillSize;
		class?: string;
	}

	const {
		ms,
		label,
		tone = 'auto',
		size = 'sm',
		class: className = ''
	}: LatencyPillProps = $props();

	type ResolvedTone = 'good' | 'warn' | 'bad';

	const resolvedTone = $derived.by((): ResolvedTone => {
		if (tone !== 'auto') return tone;
		if (ms < 100) return 'good';
		if (ms < 300) return 'warn';
		return 'bad';
	});

	const tones: Record<ResolvedTone, string> = {
		good: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400',
		warn: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
		bad: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400'
	};

	const sizes: Record<LatencyPillSize, string> = {
		sm: 'px-1.5 py-0.5 text-[10px] gap-1',
		md: 'px-2 py-0.5 text-xs gap-1.5'
	};

	const display = $derived(label ? `${label} ${ms}ms` : `${ms}ms`);
</script>

<span
	class={[
		'inline-flex items-center rounded-full border font-medium tabular-nums',
		tones[resolvedTone],
		sizes[size],
		className
	]}
	role="status"
>
	{display}
</span>
