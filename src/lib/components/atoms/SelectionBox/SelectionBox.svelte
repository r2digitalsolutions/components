<script lang="ts">
	export type SelectionBoxSize = 'sm' | 'md' | 'lg';
	export type SelectionBoxTone = 'brand' | 'primary' | 'success';
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
			'checked:bg-green-500 checked:border-green-500 indeterminate:bg-green-500 indeterminate:border-green-500 hover:border-green-400 focus-visible:ring-green-500'
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
	<input
		id={inputId}
		type="checkbox"
		{name}
		{value}
		{disabled}
		bind:checked
		{@attach setIndeterminate}
		class={[
			'shrink-0 cursor-pointer border-2 border-border bg-surface-elevated appearance-none transition-all duration-150',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
			'disabled:cursor-not-allowed disabled:opacity-50',
			sizeClasses[size],
			radiusClasses[radius],
			toneChecked[tone]
		]}
		style="
			background-image: {checked
			? `url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")`
			: indeterminate
				? `url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M3 8a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z'/%3e%3c/svg%3e\")`
				: 'none'};
			background-size: 100% 100%;
			background-position: center;
			background-repeat: no-repeat;
		"
		onchange={handleChange}
		aria-label={showLabel ? undefined : label}
	/>
	{#if label && showLabel}
		<span class={['font-medium text-primary', labelSizeClasses[size]]}>{label}</span>
	{:else if label}
		<span class="sr-only">{label}</span>
	{/if}
</label>
