<script lang="ts">
	import Heart from '@lucide/svelte/icons/heart';

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
	<Heart
		class={dims[size].icon}
		fill={liked ? 'currentColor' : 'none'}
		stroke-width={2}
		aria-hidden="true"
	/>
	{#if showCount}
		<span class="tabular-nums">{count}</span>
	{/if}
</button>
