<script lang="ts">
	interface CheckboxProps {
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		label?: string;
		helperText?: string;
		id?: string;
		name?: string;
		value?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		/** Accessible name when no visible label is provided. */
		'aria-label'?: string;
		onchange?: (checked: boolean) => void;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		disabled = false,
		label,
		helperText,
		id,
		name,
		value,
		size = 'md',
		class: className = '',
		'aria-label': ariaLabel,
		onchange,
		onclick
	}: CheckboxProps = $props();

	const inputId = $derived(id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`);

	const sizeClasses = {
		sm: 'h-3.5 w-3.5 rounded',
		md: 'h-4 w-4 rounded',
		lg: 'h-5 w-5 rounded-md'
	};

	const labelSizeClasses = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base'
	};

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		checked = target.checked;
		indeterminate = false;
		onchange?.(checked);
	}

	/** Keep DOM indeterminate in sync without bind loops. */
	function setIndeterminate(node: HTMLInputElement) {
		$effect(() => {
			node.indeterminate = indeterminate;
		});
	}
</script>

<div class={['flex items-start gap-2.5', className]}>
	<div class="flex items-center" style="padding-top: 1px">
		<input
			id={inputId}
			type="checkbox"
			{name}
			{value}
			{disabled}
			checked={checked}
			aria-label={ariaLabel ?? label}
			{@attach setIndeterminate}
			class={[
				'shrink-0 cursor-pointer border-2 border-border bg-surface-elevated appearance-none transition-all duration-150',
				'checked:bg-brand-500 checked:border-brand-500',
				'indeterminate:bg-brand-500 indeterminate:border-brand-500',
				'hover:border-brand-400',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
				'disabled:cursor-not-allowed disabled:opacity-50',
				sizeClasses[size]
			]}
			style="
				background-image: {checked
				? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
				: indeterminate
					? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M3 8a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z'/%3e%3c/svg%3e")`
					: 'none'};
				background-size: 100% 100%;
				background-position: center;
				background-repeat: no-repeat;
			"
			onchange={handleChange}
			{onclick}
		/>
	</div>

	{#if label || helperText}
		<div class="flex flex-col gap-0.5">
			{#if label}
				<label
					for={inputId}
					class={[
						'font-medium text-primary cursor-pointer',
						labelSizeClasses[size],
						disabled && 'cursor-not-allowed opacity-50'
					]}
				>
					{label}
				</label>
			{/if}
			{#if helperText}
				<p class="text-xs text-muted">{helperText}</p>
			{/if}
		</div>
	{/if}
</div>
