<script lang="ts">
	interface SkeletonProps {
		variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
		width?: string;
		height?: string;
		animation?: 'pulse' | 'shimmer' | 'none';
		class?: string;
	}

	const {
		variant = 'text',
		width,
		height,
		animation = 'pulse',
		class: className = ''
	}: SkeletonProps = $props();

	const variantClasses: Record<string, string> = {
		text: 'h-4 w-full rounded',
		circular: 'rounded-full shrink-0',
		rectangular: 'rounded-none w-full h-32',
		rounded: 'rounded-xl w-full h-32'
	};

	const animationClasses: Record<string, string> = {
		pulse: 'animate-pulse bg-border-strong dark:bg-surface-overlay',
		shimmer:
			'relative overflow-hidden bg-border-strong dark:bg-surface-overlay after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.5s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent',
		none: 'bg-border-strong dark:bg-surface-overlay'
	};

	const customStyle = $derived(
		[width ? `width: ${width}` : '', height ? `height: ${height}` : ''].filter(Boolean).join('; ')
	);
</script>

<div
	class={[
		variantClasses[variant],
		animationClasses[animation],
		className
	]}
	style={customStyle || undefined}
	aria-hidden="true"
></div>
