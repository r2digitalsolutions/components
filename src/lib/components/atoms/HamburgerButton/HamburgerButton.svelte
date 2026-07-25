<script lang="ts">
	interface HamburgerButtonProps {
		open?: boolean;
		label?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		onchange?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		label = 'Menu',
		size = 'md',
		class: className = '',
		onchange
	}: HamburgerButtonProps = $props();

	const box = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-11 w-11' };
	const bar = { sm: 'h-0.5 w-3.5', md: 'h-0.5 w-4', lg: 'h-[3px] w-5' };

	function toggle() {
		open = !open;
		onchange?.(open);
	}
</script>

<button
	type="button"
	class={[
		'relative inline-flex items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
		box[size],
		className
	]}
	aria-label={label}
	aria-expanded={open}
	onclick={toggle}
>
	<span class="relative flex h-3.5 w-4 flex-col items-center justify-center">
		<span
			class={[
				'absolute rounded-full bg-current transition-transform duration-200',
				bar[size],
				open ? 'translate-y-0 rotate-45' : '-translate-y-1.5'
			]}
		></span>
		<span
			class={[
				'absolute rounded-full bg-current transition-opacity duration-150',
				bar[size],
				open && 'opacity-0'
			]}
		></span>
		<span
			class={[
				'absolute rounded-full bg-current transition-transform duration-200',
				bar[size],
				open ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'
			]}
		></span>
	</span>
</button>
