<script lang="ts">
	interface VoteControlProps {
		score?: number;
		value?: 'up' | 'down' | null;
		disabled?: boolean;
		size?: 'sm' | 'md';
		class?: string;
		onchange?: (value: 'up' | 'down' | null, score: number) => void;
	}

	let {
		score = $bindable(0),
		value = $bindable(null as 'up' | 'down' | null),
		disabled = false,
		size = 'md',
		class: className = '',
		onchange
	}: VoteControlProps = $props();

	const iconClass = $derived(size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4');
	const btnClass = $derived(
		size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'
	);

	function vote(next: 'up' | 'down') {
		if (disabled) return;
		let delta = 0;
		if (value === next) {
			delta = next === 'up' ? -1 : 1;
			value = null;
		} else {
			if (value === 'up') delta -= 1;
			if (value === 'down') delta += 1;
			delta += next === 'up' ? 1 : -1;
			value = next;
		}
		score += delta;
		onchange?.(value, score);
	}
</script>

<div
	class={['inline-flex flex-col items-center gap-0.5', className]}
	role="group"
	aria-label="Vote"
>
	<button
		type="button"
		class={[
			'inline-flex items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-overlay hover:text-primary disabled:opacity-40',
			btnClass,
			value === 'up' && 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
		]}
		aria-pressed={value === 'up'}
		aria-label="Upvote"
		{disabled}
		onclick={() => vote('up')}
	>
		<svg class={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 5l7 10H5L12 5z" />
		</svg>
	</button>
	<span class="min-w-6 text-center text-xs font-semibold tabular-nums text-primary">{score}</span>
	<button
		type="button"
		class={[
			'inline-flex items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-overlay hover:text-primary disabled:opacity-40',
			btnClass,
			value === 'down' && 'bg-red-500/10 text-red-600 dark:text-red-400'
		]}
		aria-pressed={value === 'down'}
		aria-label="Downvote"
		{disabled}
		onclick={() => vote('down')}
	>
		<svg class={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 19l-7-10h14l-7 10z" />
		</svg>
	</button>
</div>
