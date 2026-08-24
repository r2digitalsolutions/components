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

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;
		event.preventDefault();
		toggle();
	}
</script>

<button
	type="button"
	id={id}
	role="switch"
	aria-checked={checked}
	aria-label={label}
	{disabled}
	class={[
		'inline-flex items-center gap-2.5 select-none',
		labelPosition === 'left' && 'flex-row-reverse',
		disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
		className
	]}
	onclick={toggle}
	onkeydown={handleKeydown}
>
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
</button>
