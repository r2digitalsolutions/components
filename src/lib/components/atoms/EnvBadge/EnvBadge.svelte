<script lang="ts">
	export type EnvKind = 'development' | 'staging' | 'production' | 'preview' | 'test';

	interface EnvBadgeProps {
		env?: EnvKind;
		label?: string;
		size?: 'sm' | 'md';
		class?: string;
	}

	const {
		env = 'development',
		label,
		size = 'sm',
		class: className = ''
	}: EnvBadgeProps = $props();

	const defaults: Record<EnvKind, string> = {
		development: 'DEV',
		staging: 'STG',
		production: 'PROD',
		preview: 'PREVIEW',
		test: 'TEST'
	};

	const tones: Record<EnvKind, string> = {
		development: 'bg-violet-100 text-violet-700 ring-violet-500/20 dark:bg-violet-950/50 dark:text-violet-300',
		staging: 'bg-amber-100 text-amber-800 ring-amber-500/20 dark:bg-amber-950/50 dark:text-amber-300',
		production: 'bg-emerald-100 text-emerald-800 ring-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-300',
		preview: 'bg-sky-100 text-sky-800 ring-sky-500/20 dark:bg-sky-950/50 dark:text-sky-300',
		test: 'bg-zinc-100 text-zinc-700 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-300'
	};

	const sizes = {
		sm: 'px-1.5 py-0.5 text-[10px]',
		md: 'px-2 py-0.5 text-xs'
	};

	const text = $derived(label ?? defaults[env]);
</script>

<span
	class={[
		'inline-flex items-center rounded font-bold uppercase tracking-wider ring-1 ring-inset',
		tones[env],
		sizes[size],
		className
	]}
	title={`Environment: ${env}`}
>
	{text}
</span>
