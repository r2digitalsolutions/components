<script lang="ts">
	export interface CascaderOption {
		value: string;
		label: string;
		children?: CascaderOption[];
		disabled?: boolean;
	}

	interface CascaderProps {
		options?: CascaderOption[];
		value?: string[];
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		changeOnSelect?: boolean;
		class?: string;
		onchange?: (value: string[], labels: string[]) => void;
	}

	let {
		options = [],
		value = $bindable([]),
		label = '',
		placeholder = 'Select...',
		disabled = false,
		changeOnSelect = false,
		class: className = '',
		onchange
	}: CascaderProps = $props();

	let isOpen = $state(false);
	let triggerEl = $state<HTMLButtonElement | null>(null);
	let popoverEl = $state<HTMLDivElement | null>(null);
	let popoverStyle = $state('');
	/** Columns hovered/activated path (may differ from committed value) */
	let activePath = $state<string[]>([]);

	function findOption(opts: CascaderOption[], val: string): CascaderOption | null {
		for (const opt of opts) {
			if (opt.value === val) return opt;
			if (opt.children) {
				const found = findOption(opt.children, val);
				if (found) return found;
			}
		}
		return null;
	}

	function getLabels(path: string[]): string[] {
		const labels: string[] = [];
		let current = options;
		for (const v of path) {
			const opt = current.find((o) => o.value === v);
			if (!opt) break;
			labels.push(opt.label);
			current = opt.children ?? [];
		}
		return labels;
	}

	const displayLabel = $derived(value.length ? getLabels(value).join(' / ') : '');

	/** Build columns from activePath */
	const columns = $derived.by(() => {
		const cols: CascaderOption[][] = [options];
		let current = options;
		for (const v of activePath) {
			const opt = current.find((o) => o.value === v);
			if (!opt?.children?.length) break;
			cols.push(opt.children);
			current = opt.children;
		}
		return cols;
	});

	function positionPopover() {
		if (!triggerEl) return;
		const rect = triggerEl.getBoundingClientRect();
		const gap = 6;
		const spaceBelow = window.innerHeight - rect.bottom - gap;
		const spaceAbove = rect.top - gap;
		const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
		popoverStyle = [
			`left: ${rect.left}px`,
			`top: ${openUp ? 'auto' : `${rect.bottom + gap}px`}`,
			`bottom: ${openUp ? `${window.innerHeight - rect.top + gap}px` : 'auto'}`
		].join('; ');
	}

	function open() {
		if (disabled) return;
		activePath = [...value];
		positionPopover();
		if (popoverEl && !popoverEl.matches(':popover-open')) popoverEl.showPopover();
	}

	function close() {
		if (popoverEl?.matches(':popover-open')) popoverEl.hidePopover();
	}

	function handleToggle(e: ToggleEvent) {
		isOpen = e.newState === 'open';
		if (!isOpen) activePath = [];
	}

	function handleOptionClick(colIndex: number, opt: CascaderOption) {
		if (opt.disabled) return;

		const newPath = [...activePath.slice(0, colIndex), opt.value];
		activePath = newPath;

		const isLeaf = !opt.children?.length;

		if (isLeaf || changeOnSelect) {
			value = newPath;
			onchange?.(newPath, getLabels(newPath));
			if (isLeaf) close();
		}
	}

	function handleOptionHover(colIndex: number, opt: CascaderOption) {
		if (opt.disabled) return;
		if (opt.children?.length) {
			activePath = [...activePath.slice(0, colIndex), opt.value];
		}
	}
</script>

<div class={['w-full', className]}>
	{#if label}
		<label class="mb-1.5 block text-sm font-medium text-primary">{label}</label>
	{/if}

	<button
		bind:this={triggerEl}
		type="button"
		{disabled}
		onclick={open}
		popovertarget="cascader-popover"
		class={[
			'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-elevated px-3.5 text-sm text-left transition-colors outline-none',
			isOpen && 'border-brand-500 ring-2 ring-brand-500/20',
			disabled && 'cursor-not-allowed opacity-50'
		]}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<span class={['truncate', displayLabel ? 'text-primary font-medium' : 'text-muted']}>
			{displayLabel || placeholder}
		</span>
		<svg
			class={['h-4 w-4 text-muted shrink-0 transition-transform duration-200', isOpen && 'rotate-180']}
			viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	<div
		bind:this={popoverEl}
		id="cascader-popover"
		popover="auto"
		ontoggle={handleToggle}
		style={popoverStyle}
		class="cascader-panel m-0 flex rounded-xl border border-border bg-surface-elevated shadow-xl outline-none"
	>
		{#each columns as colOptions, colIndex (colIndex)}
			<div
				class={[
					'flex w-44 flex-col py-1.5',
					colIndex < columns.length - 1 && 'border-r border-border'
				]}
			>
				{#each colOptions as opt (opt.value)}
					{@const isActive = activePath[colIndex] === opt.value}
					{@const isSelected = value[colIndex] === opt.value}
					{@const hasChildren = Boolean(opt.children?.length)}
					<button
						type="button"
						disabled={opt.disabled}
						onclick={() => handleOptionClick(colIndex, opt)}
						onpointerenter={() => handleOptionHover(colIndex, opt)}
						class={[
							'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-75 outline-none',
							opt.disabled && 'cursor-not-allowed opacity-40',
							!opt.disabled && isActive && 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400',
							!opt.disabled && !isActive && 'text-primary hover:bg-surface-overlay',
						]}
					>
						<span class="min-w-0 flex-1 truncate font-medium">{opt.label}</span>
						{#if isSelected && !hasChildren}
							<svg class="h-3.5 w-3.5 shrink-0 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						{:else if hasChildren}
							<svg class={['h-3.5 w-3.5 shrink-0', isActive ? 'text-brand-500' : 'text-muted']} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.cascader-panel {
		position: fixed;
	}
	.cascader-panel:not(:popover-open) {
		display: none;
	}
</style>
