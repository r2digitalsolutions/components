<script lang="ts">
	export type AccessLevel = 'read' | 'write' | 'admin';

	interface AccessLevelToggleProps {
		value?: AccessLevel[];
		levels?: AccessLevel[];
		disabled?: boolean;
		size?: 'sm' | 'md';
		/** Show short labels (R / W / A) vs full */
		compact?: boolean;
		class?: string;
		onchange?: (value: AccessLevel[]) => void;
	}

	const LABELS: Record<AccessLevel, { short: string; full: string }> = {
		read: { short: 'R', full: 'Read' },
		write: { short: 'W', full: 'Write' },
		admin: { short: 'A', full: 'Admin' }
	};

	let {
		value = $bindable<AccessLevel[]>([]),
		levels = ['read', 'write', 'admin'],
		disabled = false,
		size = 'sm',
		compact = true,
		class: className = '',
		onchange
	}: AccessLevelToggleProps = $props();

	const set = $derived(new Set(value));

	function toggle(level: AccessLevel) {
		if (disabled) return;
		const next = new Set(value);
		if (next.has(level)) next.delete(level);
		else next.add(level);
		value = levels.filter((l) => next.has(l));
		onchange?.(value);
	}

	const btn = $derived(
		size === 'sm' ? 'h-6 min-w-6 px-1.5 text-[10px]' : 'h-7 min-w-7 px-2 text-xs'
	);
</script>

<div
	class={[
		'inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface-overlay p-0.5',
		className
	]}
	role="group"
	aria-label="Access levels"
>
	{#each levels as level (level)}
		{@const on = set.has(level)}
		<button
			type="button"
			disabled={disabled}
			aria-pressed={on}
			title={LABELS[level].full}
			onclick={() => toggle(level)}
			class={[
				'inline-flex items-center justify-center rounded-md font-semibold uppercase tracking-wide transition-colors',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
				'disabled:cursor-not-allowed disabled:opacity-40',
				btn,
				on
					? level === 'admin'
						? 'bg-brand-500 text-white shadow-sm'
						: level === 'write'
							? 'bg-sky-500 text-white shadow-sm'
							: 'border border-border bg-surface-elevated text-primary shadow-sm'
					: 'text-muted hover:bg-surface-elevated/70 hover:text-secondary'
			]}
		>
			{compact ? LABELS[level].short : LABELS[level].full}
		</button>
	{/each}
</div>
