<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Minus from '@lucide/svelte/icons/minus';

	export type SelectionBoxSize = 'sm' | 'md' | 'lg';
	export type SelectionBoxTone = 'brand' | 'primary' | 'success' | 'neutral';
	export type SelectionBoxRadius = 'sm' | 'md' | 'none';

	interface SelectionBoxProps {
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		size?: SelectionBoxSize;
		tone?: SelectionBoxTone;
		radius?: SelectionBoxRadius;
		/** Accessible name; also rendered when showLabel is true */
		label?: string;
		showLabel?: boolean;
		id?: string;
		name?: string;
		value?: string;
		class?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		indeterminate = false,
		disabled = false,
		size = 'md',
		tone = 'brand',
		radius = 'sm',
		label,
		showLabel = false,
		id,
		name,
		value,
		class: className = '',
		onchange
	}: SelectionBoxProps = $props();

	const inputId = $derived(id ?? `selection-box-${Math.random().toString(36).slice(2, 9)}`);

	const sizeClasses: Record<SelectionBoxSize, string> = {
		sm: 'h-3.5 w-3.5',
		md: 'h-4 w-4',
		lg: 'h-5 w-5'
	};

	const iconSizeClasses: Record<SelectionBoxSize, string> = {
		sm: 'h-2.5 w-2.5',
		md: 'h-3 w-3',
		lg: 'h-3.5 w-3.5'
	};

	const radiusClasses: Record<SelectionBoxRadius, string> = {
		none: 'rounded-none',
		sm: 'rounded',
		md: 'rounded-md'
	};

	const labelSizeClasses: Record<SelectionBoxSize, string> = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base'
	};

	const toneChecked: Record<SelectionBoxTone, string> = {
		brand: 'checked:bg-brand-500 checked:border-brand-500 indeterminate:bg-brand-500 indeterminate:border-brand-500 hover:border-brand-400 focus-visible:ring-brand-500',
		primary:
			'checked:bg-primary checked:border-primary indeterminate:bg-primary indeterminate:border-primary hover:border-primary/60 focus-visible:ring-primary',
		success:
			'checked:bg-green-500 checked:border-green-500 indeterminate:bg-green-500 indeterminate:border-green-500 hover:border-green-400 focus-visible:ring-green-500',
		neutral:
			'checked:bg-neutral-800 checked:border-neutral-800 indeterminate:bg-neutral-800 indeterminate:border-neutral-800 hover:border-neutral-500 focus-visible:ring-neutral-500 dark:checked:bg-neutral-200 dark:checked:border-neutral-200 dark:indeterminate:bg-neutral-200 dark:indeterminate:border-neutral-200 dark:hover:border-neutral-400 dark:focus-visible:ring-neutral-400'
	};

	const toneIconColors: Record<SelectionBoxTone, string> = {
		brand: 'text-white',
		success: 'text-white',
		primary: 'text-white dark:text-neutral-900',
		neutral: 'text-white dark:text-neutral-900'
	};

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		checked = target.checked;
		onchange?.(checked);
	}

	function setIndeterminate(node: HTMLInputElement) {
		$effect(() => {
			node.indeterminate = indeterminate;
		});
	}
</script>

<label
	class={[
		'inline-flex cursor-pointer items-center gap-2',
		disabled && 'cursor-not-allowed opacity-50',
		className
	]}
>
	<span class={['relative inline-flex shrink-0', sizeClasses[size]]}>
		<input
			id={inputId}
			type="checkbox"
			{name}
			{value}
			{disabled}
			bind:checked
			{@attach setIndeterminate}
			class={[
				'absolute inset-0 cursor-pointer border-2 border-border bg-surface-elevated appearance-none transition-all duration-150',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
				'disabled:cursor-not-allowed disabled:opacity-50',
				radiusClasses[radius],
				toneChecked[tone]
			]}
			onchange={handleChange}
			aria-label={showLabel ? undefined : label}
		/>
		{#if indeterminate || checked}
			<span
				class={[
					'pointer-events-none absolute inset-0 z-10 flex items-center justify-center',
					toneIconColors[tone]
				]}
				aria-hidden="true"
			>
				{#if indeterminate}
					<Minus class={iconSizeClasses[size]} strokeWidth={3} />
				{:else}
					<Check class={iconSizeClasses[size]} strokeWidth={3} />
				{/if}
			</span>
		{/if}
	</span>
	{#if label && showLabel}
		<span class={['font-medium text-primary', labelSizeClasses[size]]}>{label}</span>
	{/if}
</label>
