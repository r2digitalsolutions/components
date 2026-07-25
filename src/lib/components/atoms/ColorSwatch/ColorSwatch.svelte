<script lang="ts">
	export type ColorSwatchSize = 'sm' | 'md' | 'lg';

	interface ColorSwatchProps {
		color: string;
		label?: string;
		size?: ColorSwatchSize;
		selected?: boolean;
		disabled?: boolean;
		showValue?: boolean;
		class?: string;
		onclick?: () => void;
	}

	const {
		color,
		label,
		size = 'md',
		selected = false,
		disabled = false,
		showValue = false,
		class: className = '',
		onclick
	}: ColorSwatchProps = $props();

	const box: Record<ColorSwatchSize, string> = {
		sm: 'h-6 w-6',
		md: 'h-8 w-8',
		lg: 'h-10 w-10'
	};
</script>

<button
	type="button"
	class={[
		'group inline-flex flex-col items-center gap-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40',
		className
	]}
	aria-label={label ?? color}
	aria-pressed={selected}
	{disabled}
	onclick={() => !disabled && onclick?.()}
>
	<span
		class={[
			'rounded-lg border-2 shadow-sm transition-transform group-hover:scale-105 group-active:scale-95',
			box[size],
			selected ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-border'
		]}
		style:background-color={color}
		aria-hidden="true"
	></span>
	{#if label || showValue}
		<span class="max-w-16 truncate text-[10px] font-medium text-secondary">
			{label ?? color}
		</span>
	{/if}
</button>
