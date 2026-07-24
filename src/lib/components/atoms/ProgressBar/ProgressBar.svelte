<script lang="ts">
	interface ProgressBarProps {
		value?: number;
		max?: number;
		indeterminate?: boolean;
		variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
		size?: 'sm' | 'md' | 'lg';
		showValue?: boolean;
		label?: string;
		class?: string;
	}

	const {
		value = 0,
		max = 100,
		indeterminate = false,
		variant = 'primary',
		size = 'md',
		showValue = false,
		label,
		class: className = ''
	}: ProgressBarProps = $props();

	const percentage = $derived(
		indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100))
	);

	const heightClasses: Record<string, string> = {
		sm: 'h-1.5',
		md: 'h-2.5',
		lg: 'h-4'
	};

	const variantClasses: Record<string, string> = {
		primary: 'bg-brand-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500',
		info: 'bg-sky-500'
	};
</script>

<div class={['flex flex-col gap-1.5 w-full', className]}>
	{#if label || showValue}
		<div class="flex items-center justify-between text-xs font-medium">
			{#if label}
				<span class="text-primary">{label}</span>
			{:else}
				<span></span>
			{/if}

			{#if showValue && !indeterminate}
				<span class="text-muted font-mono">{Math.round(percentage)}%</span>
			{/if}
		</div>
	{/if}

	<div
		class={[
			'w-full bg-border-strong dark:bg-surface-overlay rounded-full overflow-hidden relative',
			heightClasses[size]
		]}
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : value}
		aria-valuemin={0}
		aria-valuemax={max}
		aria-label={label ?? 'Progress'}
	>
		{#if indeterminate}
			<div
				class={[
					'h-full w-1/3 rounded-full animate-[progress_1.5s_infinite_linear]',
					variantClasses[variant]
				]}
				style="animation: progress-indeterminate 1.5s infinite ease-in-out;"
			></div>
		{:else}
			<div
				class={[
					'h-full rounded-full transition-all duration-300 ease-out',
					variantClasses[variant]
				]}
				style="width: {percentage}%"
			></div>
		{/if}
	</div>
</div>

<style>
	@keyframes progress-indeterminate {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(350%);
		}
	}
</style>
