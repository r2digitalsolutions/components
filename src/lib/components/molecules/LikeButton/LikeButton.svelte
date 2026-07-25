<script lang="ts">
	interface LikeButtonProps {
		liked?: boolean;
		count?: number;
		showCount?: boolean;
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		label?: string;
		class?: string;
		onchange?: (liked: boolean, count: number) => void;
	}

	let {
		liked = $bindable(false),
		count = $bindable(0),
		showCount = true,
		size = 'md',
		disabled = false,
		label = 'Like',
		class: className = '',
		onchange
	}: LikeButtonProps = $props();

	const dims = {
		sm: { btn: 'h-8 gap-1 px-2 text-xs', icon: 'h-3.5 w-3.5' },
		md: { btn: 'h-9 gap-1.5 px-2.5 text-sm', icon: 'h-4 w-4' },
		lg: { btn: 'h-10 gap-2 px-3 text-sm', icon: 'h-5 w-5' }
	};

	function toggle() {
		if (disabled) return;
		liked = !liked;
		count = Math.max(0, count + (liked ? 1 : -1));
		onchange?.(liked, count);
	}
</script>

<button
	type="button"
	class={[
		'inline-flex items-center rounded-lg border font-medium transition-colors disabled:opacity-40',
		dims[size].btn,
		liked
			? 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400'
			: 'border-border bg-surface-elevated text-muted hover:bg-surface-overlay hover:text-primary',
		className
	]}
	aria-pressed={liked}
	aria-label={label}
	{disabled}
	onclick={toggle}
>
	<svg
		class={dims[size].icon}
		viewBox="0 0 24 24"
		fill={liked ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 21s-6.5-4.35-9.33-8.11C.74 10.36 1.1 6.9 3.9 5.2c2.1-1.28 4.7-.7 6.1 1.2 1.4-1.9 4-2.48 6.1-1.2 2.8 1.7 3.16 5.16 1.23 7.69C18.5 16.65 12 21 12 21z"
		/>
	</svg>
	{#if showCount}
		<span class="tabular-nums">{count}</span>
	{/if}
</button>
