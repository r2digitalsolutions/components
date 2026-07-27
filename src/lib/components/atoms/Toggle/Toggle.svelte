<script lang="ts">
	interface ToggleProps {
		checked?: boolean;
		disabled?: boolean;
		label?: string;
		labelPosition?: 'left' | 'right';
		size?: 'sm' | 'md' | 'lg';
		id?: string;
		class?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		label,
		labelPosition = 'right',
		size = 'md',
		id,
		class: className = '',
		onchange
	}: ToggleProps = $props();

	const inputId = $derived(id ?? `toggle-${Math.random().toString(36).slice(2, 9)}`);

	const trackClasses = {
		sm: 'h-4 w-7',
		md: 'h-5 w-9',
		lg: 'h-6 w-11'
	};

	const thumbClasses = {
		sm: 'h-3 w-3',
		md: 'h-4 w-4',
		lg: 'h-5 w-5'
	};

	const thumbTranslate = {
		sm: 'translate-x-3',
		md: 'translate-x-4',
		lg: 'translate-x-5'
	};

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		checked = target.checked;
		onchange?.(checked);
	}
</script>

<label
	class={[
		'inline-flex items-center gap-2.5 cursor-pointer select-none',
		labelPosition === 'left' && 'flex-row-reverse',
		disabled && 'opacity-50 cursor-not-allowed',
		className
	]}
	for={inputId}
>
	<input
		id={inputId}
		type="checkbox"
		class="sr-only"
		checked={checked}
		{disabled}
		onchange={handleChange}
	/>

	<!-- Track -->
	<span
		class={[
			'relative inline-flex items-center shrink-0 rounded-full transition-colors duration-200 ease-in-out',
			trackClasses[size],
			checked
				? 'bg-brand-500'
				: 'bg-border-strong dark:bg-surface-overlay'
		]}
		aria-hidden="true"
	>
		<!-- Thumb -->
		<span
			class={[
				'absolute left-0.5 inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out',
				thumbClasses[size],
				checked ? thumbTranslate[size] : 'translate-x-0'
			]}
		></span>
	</span>

	{#if label}
		<span class="text-sm font-medium text-primary">{label}</span>
	{/if}
</label>
