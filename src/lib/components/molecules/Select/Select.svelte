<script lang="ts">
	interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface SelectProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		options?: SelectOption[];
		value?: string;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		disabled?: boolean;
		required?: boolean;
		searchable?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		id,
		name,
		label,
		placeholder = 'Select an option...',
		options = [],
		value = $bindable(''),
		status = 'default',
		helperText,
		disabled = false,
		required = false,
		searchable = false,
		size = 'md',
		class: className = '',
		onchange
	}: SelectProps = $props();

	let isOpen = $state(false);
	let searchQuery = $state('');

	const selectId = $derived(id ?? `select-${Math.random().toString(36).slice(2, 9)}`);
	const selectedOption = $derived(options.find((o) => o.value === value));

	const filteredOptions = $derived(
		searchQuery
			? options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
			: options
	);

	const sizeClasses = {
		sm: 'h-8 text-sm px-3',
		md: 'h-10 text-sm px-3.5',
		lg: 'h-12 text-base px-4'
	};

	const statusRingClasses: Record<string, string> = {
		default: 'border-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
		error: 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
		success: 'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
		warning: 'border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
	};

	function selectOption(option: SelectOption) {
		if (option.disabled) return;
		value = option.value;
		isOpen = false;
		searchQuery = '';
		onchange?.(option.value);
	}

	function toggleOpen() {
		if (!disabled) {
			isOpen = !isOpen;
			if (!isOpen) searchQuery = '';
		}
	}

	function handleOutsideClick(node: HTMLElement) {
		function handleClick(e: MouseEvent) {
			if (isOpen && !node.contains(e.target as Node)) {
				isOpen = false;
				searchQuery = '';
			}
		}
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}
</script>

<div class={['flex flex-col gap-1.5 w-full relative', className]} {@attach handleOutsideClick}>
	{#if label}
		<label for={selectId} class="text-sm font-medium text-primary">
			{label}
			{#if required}
				<span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative w-full">
		<button
			id={selectId}
			type="button"
			{disabled}
			onclick={toggleOpen}
			class={[
				'w-full flex items-center justify-between gap-2 bg-surface-elevated border rounded-lg text-left transition-all duration-200 outline-none select-none',
				sizeClasses[size],
				statusRingClasses[status],
				disabled && 'opacity-50 cursor-not-allowed bg-surface'
			]}
			aria-expanded={isOpen}
			aria-haspopup="listbox"
		>
			<span class={selectedOption ? 'text-primary font-medium' : 'text-muted'}>
				{selectedOption ? selectedOption.label : placeholder}
			</span>

			<svg
				class={['h-4 w-4 text-muted transition-transform duration-200 shrink-0', isOpen && 'rotate-180']}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<!-- Hidden native select for form submission -->
		<select {name} {value} class="sr-only" tabindex={-1} aria-hidden="true">
			{#each options as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>

		{#if isOpen}
			<div
				class="absolute z-50 left-0 right-0 mt-1.5 bg-surface-elevated border border-border rounded-xl shadow-xl overflow-hidden max-h-60 flex flex-col transition-all duration-150"
				role="listbox"
			>
				{#if searchable}
					<div class="p-2 border-b border-border bg-surface">
						<input
							type="text"
							placeholder="Search options..."
							bind:value={searchQuery}
							class="w-full px-3 py-1.5 text-xs bg-surface-elevated border border-border rounded-md text-primary outline-none focus:border-brand-500"
							onclick={(e) => e.stopPropagation()}
						/>
					</div>
				{/if}

				<div class="overflow-y-auto py-1">
					{#if filteredOptions.length === 0}
						<div class="px-4 py-3 text-xs text-muted text-center">No options found</div>
					{:else}
						{#each filteredOptions as option (option.value)}
							<button
								type="button"
								role="option"
								aria-selected={value === option.value}
								disabled={option.disabled}
								onclick={() => selectOption(option)}
								class={[
									'w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors cursor-pointer',
									value === option.value
										? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
										: 'text-primary hover:bg-surface-overlay',
									option.disabled && 'opacity-40 cursor-not-allowed'
								]}
							>
								<span>{option.label}</span>
								{#if value === option.value}
									<svg class="h-4 w-4 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								{/if}
							</button>
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if helperText}
		<p class={['text-xs leading-relaxed', status === 'error' ? 'text-red-500' : 'text-muted']}>
			{helperText}
		</p>
	{/if}
</div>
