<script lang="ts">
	import { on } from 'svelte/events';
	import { createId } from '$lib/utils/id.js';
	import { popoverInvokerToggle } from '$lib/utils/popoverInvoker.js';

	export interface SelectOption {
		value: string;
		label: string;
		/** Secondary line under the label (e.g. email). Also included in search. */
		hint?: string;
		disabled?: boolean;
		children?: SelectOption[];
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
		/**
		 * On open, drill into the submenu that contains the current value
		 * and highlight it. Defaults to true.
		 */
		flyToSelected?: boolean;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		/**
		 * Minimum width (px) for the open listbox. Defaults to the trigger width.
		 * Useful when option labels are longer than the field (e.g. contribution groups).
		 */
		listboxMinWidth?: number;
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
		flyToSelected = true,
		size = 'md',
		listboxMinWidth,
		class: className = '',
		onchange
	}: SelectProps = $props();

	let isOpen = $state(false);
	let searchQuery = $state('');
	let highlightedIndex = $state(-1);
	let path = $state<string[]>([]);
	let triggerEl = $state<HTMLButtonElement | null>(null);
	let listboxEl = $state<HTMLDivElement | null>(null);
	let searchInputEl = $state<HTMLInputElement | null>(null);
	let optionsContainerEl = $state<HTMLDivElement | null>(null);
	let listboxStyle = $state('');
	let listOverflow = $state(false);
	let listHeightCeiling = $state(240);
	/** After keyboard nav, ignore hover until the mouse actually moves */
	let ignoreHover = $state(false);

	let autoId = $state<string | undefined>(undefined);
	$effect(() => {
		if (id == null) autoId ??= createId('select');
	});
	const selectId = $derived(id ?? autoId);
	const listboxId = $derived(selectId ? `${selectId}-listbox` : undefined);
	const helperId = $derived(selectId ? `${selectId}-helper` : undefined);

	function findPathToValue(
		list: SelectOption[],
		target: string,
		parents: string[] = []
	): string[] | null {
		for (const option of list) {
			if (option.value === target) return parents;
			if (option.children?.length) {
				const found = findPathToValue(option.children, target, [...parents, option.value]);
				if (found) return found;
			}
		}
		return null;
	}

	function findOptionByValue(list: SelectOption[], target: string): SelectOption | null {
		for (const option of list) {
			if (option.value === target) return option;
			if (option.children?.length) {
				const found = findOptionByValue(option.children, target);
				if (found) return found;
			}
		}
		return null;
	}

	function levelFromPath(
		root: SelectOption[],
		pathIds: string[]
	): { title: string; options: SelectOption[] } {
		let current = root;
		let title = label || 'Options';
		for (const id of pathIds) {
			const next = current.find((option) => option.value === id);
			if (!next?.children?.length) break;
			title = next.label;
			current = next.children;
		}
		return { title, options: current };
	}

	function flattenLeaves(
		list: SelectOption[],
		trail: string[] = []
	): Array<SelectOption & { breadcrumb?: string }> {
		const out: Array<SelectOption & { breadcrumb?: string }> = [];
		for (const option of list) {
			if (option.children?.length) {
				out.push(...flattenLeaves(option.children, [...trail, option.label]));
			} else {
				out.push({
					...option,
					breadcrumb: trail.length ? trail.join(' / ') : undefined
				});
			}
		}
		return out;
	}

	const leafOptions = $derived(flattenLeaves(options));
	const selectedOption = $derived(findOptionByValue(options, value));
	const currentLevel = $derived(levelFromPath(options, path));
	const canGoBack = $derived(path.length > 0);
	const isSearching = $derived(Boolean(searchQuery.trim()));

	const visibleOptions = $derived.by(() => {
		if (isSearching) {
			const q = searchQuery.toLowerCase();
			return leafOptions.filter(
				(o) =>
					o.label.toLowerCase().includes(q) ||
					(o.hint?.toLowerCase().includes(q) ?? false) ||
					(o.breadcrumb?.toLowerCase().includes(q) ?? false)
			);
		}
		return currentLevel.options;
	});

	const enabledIndexes = $derived(
		visibleOptions
			.map((option, index) => (option.disabled ? -1 : index))
			.filter((index) => index !== -1)
	);

	const activeOptionId = $derived(
		listboxId && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
	);

	const sizeClasses = {
		xs: 'h-7 text-xs px-2 gap-1.5 rounded-lg',
		sm: 'h-8 text-sm px-3',
		md: 'h-10 text-sm px-3.5',
		lg: 'h-12 text-base px-4'
	};

	const statusRingClasses: Record<string, string> = {
		default:
			'border-border focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20',
		error:
			'border-red-400 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20',
		success:
			'border-green-400 focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/20',
		warning:
			'border-amber-400 focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/20'
	};

	function applyFlyToSelected() {
		searchQuery = '';
		if (flyToSelected && value) {
			const nextPath = findPathToValue(options, value);
			path = nextPath ?? [];
		} else {
			path = [];
		}
	}

	function syncListOverflow(ceiling: number) {
		if (!listboxEl) {
			listOverflow = false;
			return;
		}
		const fits = listboxEl.scrollHeight <= ceiling;
		listOverflow = !fits;
		if (fits) {
			listboxStyle = listboxStyle.replace(/max-height:[^;]+/, 'max-height:none');
		}
	}

	function positionListbox() {
		if (!triggerEl) return;

		const rect = triggerEl.getBoundingClientRect();
		const gap = 6;
		const margin = 8;
		const maxHeight = 240;
		const vv = window.visualViewport;
		const viewW = vv?.width ?? window.innerWidth;
		const viewH = vv?.height ?? window.innerHeight;
		const viewLeft = vv?.offsetLeft ?? 0;
		const viewTop = vv?.offsetTop ?? 0;

		const spaceBelow = viewTop + viewH - rect.bottom - gap - margin;
		const spaceAbove = rect.top - viewTop - gap - margin;
		const openUp = spaceBelow < Math.min(maxHeight, 160) && spaceAbove > spaceBelow;
		const available = Math.max(120, openUp ? spaceAbove : spaceBelow);
		const ceiling = Math.min(maxHeight, available);
		listHeightCeiling = ceiling;

		// Prefer trigger width; optionally grow for long labels (never past viewport).
		const minW = Math.max(rect.width, listboxMinWidth ?? 0);
		const width = Math.min(minW, viewW - margin * 2);

		let left = rect.left;
		if (left + width > viewLeft + viewW - margin) {
			left = rect.right - width;
		}
		left = Math.min(Math.max(left, viewLeft + margin), viewLeft + viewW - margin - width);

		listboxStyle = [
			`top:${openUp ? 'auto' : `${rect.bottom + gap}px`}`,
			`bottom:${openUp ? `${viewTop + viewH - rect.top + gap}px` : 'auto'}`,
			`left:${left}px`,
			'right:auto',
			`width:${width}px`,
			`min-width:${width}px`,
			`max-width:${width}px`,
			`max-height:${ceiling}px`
		].join('; ');

		syncListOverflow(ceiling);
	}

	function openListbox() {
		if (disabled || !listboxEl) return;
		applyFlyToSelected();
		positionListbox();
		if (!listboxEl.matches(':popover-open')) listboxEl.showPopover();
	}

	function closeListbox() {
		if (listboxEl?.matches(':popover-open')) listboxEl.hidePopover();
	}

	function handleBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open') {
			if (disabled) {
				event.preventDefault();
				return;
			}
			applyFlyToSelected();
			positionListbox();
		}
	}

	function handleToggle(event: ToggleEvent) {
		isOpen = event.newState === 'open';

		if (isOpen) {
			const selectedIndex = visibleOptions.findIndex((o) => o.value === value && !o.disabled);
			highlightedIndex = selectedIndex >= 0 ? selectedIndex : (enabledIndexes[0] ?? -1);
			ignoreHover = true;
			requestAnimationFrame(() => {
				positionListbox();
				syncListOverflow(listHeightCeiling);
				if (searchable) searchInputEl?.focus();
				else listboxEl?.focus();
				scrollHighlightedIntoView();
			});
		} else {
			searchQuery = '';
			path = [];
			highlightedIndex = -1;
			ignoreHover = false;
			requestAnimationFrame(() => triggerEl?.focus());
		}
	}

	function enterGroup(option: SelectOption) {
		if (!option.children?.length || option.disabled) return;
		path = [...path, option.value];
		searchQuery = '';
		queueMicrotask(() => {
			highlightedIndex = visibleOptions.findIndex((o) => !o.disabled);
			scrollHighlightedIntoView();
			listboxEl?.focus();
		});
	}

	function goBack() {
		if (!canGoBack || isSearching) return;
		path = path.slice(0, -1);
		highlightedIndex = enabledIndexes[0] ?? -1;
		queueMicrotask(() => {
			scrollHighlightedIntoView();
			listboxEl?.focus();
		});
	}

	function selectOption(option: SelectOption) {
		if (option.disabled) return;
		if (option.children?.length && !isSearching) {
			enterGroup(option);
			return;
		}
		value = option.value;
		onchange?.(option.value);
		closeListbox();
	}

	/** Prevent options from stealing focus from the combobox / search input */
	function handleOptionPointerDown(event: PointerEvent, option: SelectOption) {
		event.preventDefault();
		if (!option.disabled) highlightedIndex = visibleOptions.indexOf(option);
	}

	function handleListboxPointerMove() {
		ignoreHover = false;
	}

	function moveHighlight(direction: 1 | -1) {
		if (enabledIndexes.length === 0) return;

		ignoreHover = true;
		const currentPos = enabledIndexes.indexOf(highlightedIndex);
		let nextPos: number;

		if (currentPos === -1) {
			nextPos = direction === 1 ? 0 : enabledIndexes.length - 1;
		} else {
			nextPos = (currentPos + direction + enabledIndexes.length) % enabledIndexes.length;
		}

		highlightedIndex = enabledIndexes[nextPos];
		scrollHighlightedIntoView();
	}

	function jumpHighlight(to: 'start' | 'end') {
		if (!enabledIndexes.length) return;
		ignoreHover = true;
		highlightedIndex =
			to === 'start' ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1];
		scrollHighlightedIntoView();
	}

	function scrollHighlightedIntoView() {
		if (highlightedIndex < 0 || !optionsContainerEl) return;
		const optionEl = document.getElementById(`${listboxId}-option-${highlightedIndex}`);
		if (!optionEl) return;

		const containerRect = optionsContainerEl.getBoundingClientRect();
		const optionRect = optionEl.getBoundingClientRect();

		if (optionRect.top < containerRect.top) {
			optionsContainerEl.scrollTop -= containerRect.top - optionRect.top;
		} else if (optionRect.bottom > containerRect.bottom) {
			optionsContainerEl.scrollTop += optionRect.bottom - containerRect.bottom;
		}
	}

	function handleTriggerKeydown(event: KeyboardEvent) {
		if (disabled) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				if (!isOpen) openListbox();
				else moveHighlight(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (!isOpen) openListbox();
				else moveHighlight(-1);
				break;
			case 'Enter':
			case ' ':
				if (isOpen) {
					event.preventDefault();
					if (highlightedIndex >= 0) selectOption(visibleOptions[highlightedIndex]);
				}
				break;
			case 'Home':
				if (isOpen) {
					event.preventDefault();
					jumpHighlight('start');
				}
				break;
			case 'End':
				if (isOpen) {
					event.preventDefault();
					jumpHighlight('end');
				}
				break;
			case 'Escape':
				if (isOpen) {
					event.preventDefault();
					closeListbox();
				}
				break;
		}
	}

	function handleListboxKeydown(event: KeyboardEvent) {
		const fromSearch = event.currentTarget === searchInputEl;
		const current = highlightedIndex >= 0 ? visibleOptions[highlightedIndex] : undefined;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				event.stopPropagation();
				moveHighlight(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				event.stopPropagation();
				moveHighlight(-1);
				break;
			case 'ArrowRight':
				if (current?.children?.length && !isSearching) {
					event.preventDefault();
					event.stopPropagation();
					enterGroup(current);
				}
				break;
			case 'ArrowLeft':
			case 'Backspace':
				if (!fromSearch && canGoBack && !isSearching) {
					event.preventDefault();
					event.stopPropagation();
					goBack();
				}
				break;
			case 'Home':
				event.preventDefault();
				event.stopPropagation();
				jumpHighlight('start');
				break;
			case 'End':
				event.preventDefault();
				event.stopPropagation();
				jumpHighlight('end');
				break;
			case 'Enter':
				event.preventDefault();
				event.stopPropagation();
				if (highlightedIndex >= 0) selectOption(visibleOptions[highlightedIndex]);
				break;
			case ' ':
				if (fromSearch) return;
				event.preventDefault();
				event.stopPropagation();
				if (highlightedIndex >= 0) selectOption(visibleOptions[highlightedIndex]);
				break;
			case 'Escape':
				event.preventDefault();
				event.stopPropagation();
				if (canGoBack && !isSearching) goBack();
				else closeListbox();
				break;
			case 'Tab':
				closeListbox();
				break;
		}
	}

	function handleSearchInput() {
		ignoreHover = true;
		path = [];
		highlightedIndex = enabledIndexes[0] ?? -1;
		scrollHighlightedIntoView();
	}

	$effect(() => {
		if (!isOpen) return;

		const reposition = (event?: Event) => {
			const target = event?.target;
			if (target instanceof Node && listboxEl?.contains(target)) return;
			positionListbox();
		};

		const offResize = on(window, 'resize', reposition);
		const offScroll = on(window, 'scroll', reposition, { capture: true });

		return () => {
			offResize();
			offScroll();
		};
	});
</script>

<div class={['gap-1.5 flex w-full flex-col', className]}>
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
			bind:this={triggerEl}
			id={selectId}
			type="button"
			role="combobox"
			{disabled}
			popovertarget={listboxId}
			popovertargetaction="toggle"
			{@attach popoverInvokerToggle(() => listboxEl)}
			onkeydown={handleTriggerKeydown}
			class={[
				'gap-2 rounded-lg flex w-full items-center justify-between border bg-transparent text-left transition-colors duration-150 outline-none select-none',
				sizeClasses[size],
				statusRingClasses[status],
				isOpen && 'border-brand-500 ring-brand-500/20 ring-2',
				disabled && 'bg-surface cursor-not-allowed opacity-50'
			]}
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			aria-controls={listboxId}
			aria-activedescendant={isOpen ? activeOptionId : undefined}
			aria-invalid={status === 'error' || undefined}
			aria-describedby={helperText ? helperId : undefined}
			aria-required={required || undefined}
		>
			<span class={['truncate', selectedOption ? 'text-primary font-medium' : 'text-muted']}>
				{selectedOption ? selectedOption.label : placeholder}
			</span>

			<svg
				class={[
					'h-4 w-4 text-muted shrink-0 transition-transform duration-200',
					isOpen && 'rotate-180'
				]}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<!-- Hidden native select for form submission -->
		<select {name} {value} class="sr-only" tabindex={-1} aria-hidden="true">
			{#each leafOptions as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>

		<!-- Popover listbox (top layer + light dismiss). Not <dialog>: Select is non-modal. -->
		<div
			bind:this={listboxEl}
			id={listboxId}
			popover="auto"
			onbeforetoggle={handleBeforeToggle}
			ontoggle={handleToggle}
			onkeydown={handleListboxKeydown}
			onpointermove={handleListboxPointerMove}
			role="listbox"
			tabindex={-1}
			aria-labelledby={selectId}
			aria-activedescendant={isOpen ? activeOptionId : undefined}
			style={listboxStyle}
			class={[
				'select-listbox m-0 p-0 inset-auto overflow-x-hidden overflow-y-hidden',
				'bg-surface-elevated border-border rounded-xl shadow-xl border',
				'flex flex-col outline-none'
			]}
		>
			{#if searchable}
				<div class="p-2 border-border bg-surface shrink-0 border-b">
					<input
						bind:this={searchInputEl}
						type="text"
						placeholder="Search options..."
						bind:value={searchQuery}
						oninput={handleSearchInput}
						onkeydown={handleListboxKeydown}
						class="px-3 py-1.5 text-xs bg-surface-elevated border-border rounded-md text-primary focus:border-brand-500 focus:ring-brand-500/20 w-full border outline-none focus:ring-2"
						role="searchbox"
						aria-controls={listboxId}
						aria-autocomplete="list"
						aria-activedescendant={activeOptionId}
					/>
				</div>
			{/if}

			{#if canGoBack && !isSearching}
				<button
					type="button"
					onclick={goBack}
					class="gap-2 text-primary hover:bg-surface-overlay mx-1.5 mt-1.5 rounded-lg px-2.5 py-2 text-sm font-medium flex shrink-0 items-center text-left transition-colors"
				>
					<svg
						class="text-secondary h-4 w-4 shrink-0"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
					<span class="whitespace-nowrap">{currentLevel.title}</span>
				</button>
				<div class="border-border mx-1.5 mb-0.5 h-px border-b" role="separator"></div>
			{/if}

			<div
				bind:this={optionsContainerEl}
				class={[
					'p-1.5 min-h-0 overflow-x-hidden overscroll-contain',
					listOverflow ? 'overflow-y-auto' : 'overflow-y-hidden'
				]}
			>
				{#if visibleOptions.length === 0}
					<div class="px-3 py-2.5 text-xs text-muted text-center">No options found</div>
				{:else}
					{#each visibleOptions as option, index (option.value)}
						{@const isSelected = value === option.value}
						{@const isHighlighted = highlightedIndex === index}
						{@const hasChildren = Boolean(option.children?.length) && !isSearching}
						{@const breadcrumb = 'breadcrumb' in option ? option.breadcrumb : undefined}
						{@const hint = option.hint?.trim() || undefined}
						{@const secondary = hint ?? breadcrumb}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							id={listboxId ? `${listboxId}-option-${index}` : undefined}
							role="option"
							aria-selected={isSelected}
							aria-disabled={option.disabled || undefined}
							aria-haspopup={hasChildren ? 'listbox' : undefined}
							tabindex={-1}
							onpointerdown={(e) => handleOptionPointerDown(e, option)}
							onclick={() => selectOption(option)}
							onpointerenter={() => {
								if (option.disabled) return;
								ignoreHover = false;
								highlightedIndex = index;
							}}
							class={[
								'group gap-2.5 rounded-lg px-2.5 py-2 text-sm relative flex w-full items-center text-left outline-none select-none',
								'transition-[background-color,color,box-shadow] duration-75',
								option.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
								isHighlighted && !option.disabled
									? 'bg-brand-500 text-white shadow-sm'
									: isSelected && !option.disabled
										? 'font-medium text-primary'
										: 'text-primary hover:bg-surface-overlay'
							]}
						>
							{#if !hasChildren}
								<span
									class={[
										'h-4 w-4 flex shrink-0 items-center justify-center rounded-full border transition-colors duration-75',
										isSelected && !option.disabled
											? isHighlighted
												? 'border-white bg-white'
												: 'border-brand-500 bg-brand-500'
											: isHighlighted && !option.disabled
												? 'border-white/80 bg-transparent'
												: 'border-border-strong bg-transparent'
									]}
									aria-hidden="true"
								>
									{#if isSelected}
										<svg
											class={[
												'h-2.5 w-2.5',
												isHighlighted && !option.disabled ? 'text-brand-500' : 'text-white'
											]}
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									{/if}
								</span>
							{/if}

							<span class="min-w-0 flex-1">
								<span class="block break-words">{option.label}</span>
								{#if secondary}
									<span
										class={[
											'mt-0.5 block text-[11px] break-words',
											isHighlighted && !option.disabled ? 'text-white/80' : 'text-secondary'
										]}
									>
										{secondary}
									</span>
								{/if}
							</span>

							{#if hasChildren}
								<svg
									class={[
										'h-4 w-4 shrink-0',
										isHighlighted && !option.disabled ? 'text-white/80' : 'text-secondary'
									]}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	{#if helperText}
		<p
			id={helperId}
			class={['text-xs leading-relaxed', status === 'error' ? 'text-red-500' : 'text-muted']}
		>
			{helperText}
		</p>
	{/if}
</div>

<style>
	.select-listbox[popover] {
		position: fixed;
		inset: unset;
		margin: 0;
	}

	.select-listbox:popover-open {
		display: flex;
		overflow-x: hidden;
		overflow-y: hidden;
	}

	.select-listbox:not(:popover-open) {
		display: none;
	}
</style>
