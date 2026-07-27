<script lang="ts">
	export type VersionTagTone = 'neutral' | 'brand' | 'success';
	export type VersionTagSize = 'sm' | 'md';

	interface VersionTagProps {
		version: string;
		prefix?: string;
		tone?: VersionTagTone;
		size?: VersionTagSize;
		class?: string;
	}

	const {
		version,
		prefix = 'v',
		tone = 'neutral',
		size = 'sm',
		class: className = ''
	}: VersionTagProps = $props();

	const tones: Record<VersionTagTone, string> = {
		neutral: 'border-border bg-surface-overlay text-secondary',
		brand: 'border-brand-500/30 bg-brand-500/10 text-brand-700 dark:text-brand-300',
		success: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
	};

	const sizes: Record<VersionTagSize, string> = {
		sm: 'px-1.5 py-0.5 text-[10px]',
		md: 'px-2 py-0.5 text-xs'
	};

	const display = $derived(`${prefix}${version}`);
</script>

<span
	class={[
		'inline-flex items-center rounded-md border font-mono font-medium tabular-nums tracking-tight',
		tones[tone],
		sizes[size],
		className
	]}
>
	{display}
</span>
