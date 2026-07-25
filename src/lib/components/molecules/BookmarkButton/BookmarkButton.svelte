<script lang="ts">
	interface BookmarkButtonProps {
		active?: boolean;
		label?: string;
		size?: 'sm' | 'md';
		disabled?: boolean;
		class?: string;
		onchange?: (active: boolean) => void;
	}

	let {
		active = $bindable(false),
		label = 'Bookmark',
		size = 'md',
		disabled = false,
		class: className = '',
		onchange
	}: BookmarkButtonProps = $props();

	const dims = $derived(size === 'sm' ? 'h-8 w-8' : 'h-9 w-9');
	const icon = $derived(size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4');

	function toggle() {
		if (disabled) return;
		active = !active;
		onchange?.(active);
	}
</script>

<button
	type="button"
	class={[
		'inline-flex items-center justify-center rounded-lg border transition-colors disabled:opacity-40',
		dims,
		active
			? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
			: 'border-border bg-surface-elevated text-muted hover:bg-surface-overlay hover:text-primary',
		className
	]}
	aria-pressed={active}
	aria-label={label}
	{disabled}
	onclick={toggle}
>
	<svg
		class={icon}
		viewBox="0 0 24 24"
		fill={active ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M6 4h12v17l-6-3.5L6 21V4z" />
	</svg>
</button>
