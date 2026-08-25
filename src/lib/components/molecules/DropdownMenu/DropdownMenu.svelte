<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { on } from 'svelte/events';
	import { createId } from '$lib/utils/id.js';

	export interface DropdownItem {
		id: string;
		label: string;
		description?: string;
		/** Lucide (or any) Svelte icon component: `import { Pencil } from '@lucide/svelte'` */
		icon?: Component<{ class?: string; size?: number | string; strokeWidth?: number | string }>;
		disabled?: boolean;
		destructive?: boolean;
		separator?: boolean;
		shortcut?: string;
		checked?: boolean;
		children?: DropdownItem[];
	}

	type DropdownSize = 'sm' | 'md';
	type DropdownAlign = 'start' | 'end';
	type DropdownSide = 'bottom' | 'top';

	interface DropdownMenuProps {
		id?: string;
		items?: DropdownItem[];
		label?: string;
		align?: DropdownAlign;
		side?: DropdownSide;
		size?: DropdownSize;
		disabled?: boolean;
		open?: boolean;
		closeOnSelect?: boolean;
		matchTriggerWidth?: boolean;
		minWidth?: number;
		/** Soft cap — only applied when `scrollable` is true (default 320). */
		maxHeight?: number;
		/**
		 * Opt-in internal scrolling for long lists.
		 * Default false: action menus grow / flip, never show a scrollbar.
		 */
		scrollable?: boolean;
		/**
		 * On open, drill into the submenu path of the last selected item
		 * and highlight it.
		 */
		flyToSelected?: boolean;
		loop?: boolean;
		class?: string;
		trigger?: Snippet;
		onselect?: (id: string, item: DropdownItem) => void;
		onopenchange?: (open: boolean) => void;
	}

	let {
		id: idProp,
		items = [],
		label = 'Options',
		align = 'start',
		side = 'bottom',
		size = 'md',
		disabled = false,
		open = $bindable(false),
		closeOnSelect = true,
		matchTriggerWidth = false,
		minWidth = 180,
		maxHeight = 320,
		scrollable = false,
		flyToSelected = false,
		loop = true,
		class: className = '',
		trigger,
		onselect,
		onopenchange
	}: DropdownMenuProps = $props();

	let autoId = $state<string | undefined>(undefined);
	$effect(() => {
		if (idProp == null) autoId ??= createId('menu');
	});
	const id = $derived(idProp ?? autoId);
	const menuId = $derived(id ? `${id}-list` : undefined);

	let triggerEl = $state<HTMLButtonElement | null>(null);
	let menuEl = $state<HTMLDivElement | null>(null);
	let listEl = $state<HTMLDivElement | null>(null);
	let menuStyle = $state('');
	let highlighted = $state(-1);
	/** Ancestor item ids from root → current submenu */
	let path = $state<string[]>([]);
	let lastSelectedId = $state<string | null>(null);

	function findPathToItem(
		list: DropdownItem[],
		targetId: string,
		parents: string[] = []
	): string[] | null {
		for (const item of list) {
			if (item.id === targetId) return parents;
			if (item.children?.length) {
				const found = findPathToItem(item.children, targetId, [...parents, item.id]);
				if (found) return found;
			}
		}
		return null;
	}

	function levelFromPath(
		root: DropdownItem[],
		pathIds: string[]
	): { title: string; items: DropdownItem[] } {
		let current = root;
		let title = label;
		for (const id of pathIds) {
			const next = current.find((item) => item.id === id);
			if (!next?.children?.length) break;
			title = next.label;
			current = next.children;
		}
		return { title, items: current };
	}

	const current = $derived(levelFromPath(items, path));
	const depth = $derived(path.length);
	const canGoBack = $derived(depth > 0);
	const showIconColumn = $derived(
		current.items.some((item) => item.icon || item.checked !== undefined)
	);

	const sizePad = $derived(size === 'sm' ? 'px-2 py-1.5 text-xs' : 'px-2.5 py-2 text-sm');
	const iconSize = $derived(size === 'sm' ? 14 : 16);

	const enabledIndexes = $derived(
		current.items
			.map((item, index) => (item.separator || item.disabled ? -1 : index))
			.filter((i) => i !== -1)
	);

	function resetPath() {
		path = [];
		highlighted = -1;
	}

	function applyFlyToSelected() {
		if (!flyToSelected || !lastSelectedId) {
			resetPath();
			return;
		}
		const nextPath = findPathToItem(items, lastSelectedId);
		if (!nextPath) {
			resetPath();
			return;
		}
		path = nextPath;
		const level = levelFromPath(items, nextPath);
		const idx = level.items.findIndex((item) => item.id === lastSelectedId);
		highlighted =
			idx >= 0 ? idx : (level.items.findIndex((i) => !i.separator && !i.disabled) ?? -1);
	}

	/** Measure natural height without expanding the positioned popover (avoids jump). */
	function measureNaturalHeight(): number {
		if (!menuEl || !listEl) return 120;
		const cs = getComputedStyle(menuEl);
		const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
		let chrome = 0;
		for (const child of menuEl.children) {
			if (child === listEl) continue;
			chrome += (child as HTMLElement).offsetHeight;
		}
		return Math.max(chrome + listEl.scrollHeight + padY, 1);
	}

	function positionMenu() {
		if (!triggerEl || !menuEl) return;
		if (!menuEl.matches(':popover-open')) return;

		const rect = triggerEl.getBoundingClientRect();
		const gap = 6;
		const margin = 8;
		const vv = window.visualViewport;
		const viewW = vv?.width ?? window.innerWidth;
		const viewH = vv?.height ?? window.innerHeight;
		const viewLeft = vv?.offsetLeft ?? 0;
		const viewTop = vv?.offsetTop ?? 0;

		const width = Math.min(
			matchTriggerWidth ? rect.width : Math.max(rect.width, minWidth),
			viewW - margin * 2
		);

		const rawContent = measureNaturalHeight();
		// Soft cap only when scrollable; otherwise grow naturally (no internal scroll)
		const preferredHeight = scrollable ? Math.min(maxHeight, rawContent) : rawContent;

		const spaceBelow = viewTop + viewH - rect.bottom - gap - margin;
		const spaceAbove = rect.top - viewTop - gap - margin;

		let place: 'top' | 'bottom' = side;
		if (side === 'bottom' && preferredHeight > spaceBelow && spaceAbove > spaceBelow) {
			place = 'top';
		} else if (side === 'top' && preferredHeight > spaceAbove && spaceBelow > spaceAbove) {
			place = 'bottom';
		}

		const available = Math.max(120, place === 'bottom' ? spaceBelow : spaceAbove);

		// Scroll only with explicit `scrollable` — never for compact action menus
		const height = scrollable ? Math.min(preferredHeight, available) : preferredHeight;
		const needsScroll = scrollable && rawContent > height + 1;

		let top: number;
		if (place === 'bottom') {
			top = rect.bottom + gap;
			if (top + height > viewTop + viewH - margin) {
				top = Math.max(viewTop + margin, viewTop + viewH - margin - height);
			}
		} else {
			top = rect.top - gap - height;
			if (top < viewTop + margin) {
				top = viewTop + margin;
			}
		}

		let left = align === 'end' ? rect.right - width : rect.left;
		left = Math.min(Math.max(left, viewLeft + margin), viewLeft + viewW - margin - width);

		menuStyle = [
			`top:${top}px`,
			'bottom:auto',
			`left:${left}px`,
			'right:auto',
			`width:${width}px`,
			`min-width:${Math.min(minWidth, width)}px`,
			needsScroll ? `height:${height}px` : 'height:auto',
			needsScroll ? `max-height:${height}px` : 'max-height:none',
			`--dropdown-scroll:${needsScroll ? 'auto' : 'visible'}`
		].join(';');
	}

	function openMenu() {
		if (disabled || !menuEl) return;
		applyFlyToSelected();
		if (!menuEl.matches(':popover-open')) menuEl.showPopover();
	}

	function closeMenu() {
		if (menuEl?.matches(':popover-open')) menuEl.hidePopover();
	}

	$effect(() => {
		const btn = triggerEl;
		if (!btn) return;
		const onClick = (event: MouseEvent) => {
			event.stopPropagation();
			if (disabled) return;
			const el = menuEl;
			if (!el) return;
			const isOpen = el.matches(':popover-open');
			setTimeout(() => {
				if (isOpen) closeMenu();
				else openMenu();
			}, 0);
		};
		btn.addEventListener('click', onClick);
		return () => btn.removeEventListener('click', onClick);
	});

	function handleBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open') {
			if (disabled) {
				event.preventDefault();
				return;
			}
			applyFlyToSelected();
		}
	}

	function handleToggle(event: ToggleEvent) {
		open = event.newState === 'open';
		onopenchange?.(open);
		if (open) {
			if (highlighted < 0) highlighted = enabledIndexes[0] ?? -1;
			queueMicrotask(() => {
				positionMenu();
				requestAnimationFrame(() => positionMenu());
				menuEl?.focus();
			});
		} else {
			path = [];
			highlighted = -1;
		}
	}

	$effect(() => {
		if (!open) return;

		let frame = 0;
		const reposition = (event?: Event) => {
			const target = event?.target;
			if (target instanceof Node && menuEl?.contains(target)) return;
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => positionMenu());
		};

		const offScroll = on(window, 'scroll', reposition, { capture: true, passive: true });
		const offResize = on(window, 'resize', reposition);
		const offVisual =
			typeof window.visualViewport !== 'undefined' && window.visualViewport
				? on(window.visualViewport, 'resize', reposition)
				: () => {};

		return () => {
			cancelAnimationFrame(frame);
			offScroll();
			offResize();
			offVisual();
		};
	});

	function enterSubmenu(item: DropdownItem) {
		if (!item.children?.length || item.disabled) return;
		path = [...path, item.id];
		queueMicrotask(() => {
			highlighted = current.items.findIndex((i) => !i.separator && !i.disabled);
			positionMenu();
			menuEl?.focus();
		});
	}

	function goBack() {
		if (!canGoBack) return;
		path = path.slice(0, -1);
		highlighted = enabledIndexes[0] ?? -1;
		queueMicrotask(() => {
			positionMenu();
			menuEl?.focus();
		});
	}

	function selectItem(item: DropdownItem) {
		if (item.disabled || item.separator) return;
		if (item.children?.length) {
			enterSubmenu(item);
			return;
		}
		lastSelectedId = item.id;
		onselect?.(item.id, item);
		if (closeOnSelect) closeMenu();
	}

	function move(direction: 1 | -1) {
		if (!enabledIndexes.length) return;
		const pos = enabledIndexes.indexOf(highlighted);
		let nextPos: number;
		if (pos === -1) {
			nextPos = direction === 1 ? 0 : enabledIndexes.length - 1;
		} else if (loop) {
			nextPos = (pos + direction + enabledIndexes.length) % enabledIndexes.length;
		} else {
			nextPos = Math.min(enabledIndexes.length - 1, Math.max(0, pos + direction));
		}
		highlighted = enabledIndexes[nextPos];
	}

	function onTriggerKeydown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openMenu();
		} else if (event.key === 'ArrowUp' && side === 'top') {
			event.preventDefault();
			openMenu();
		}
	}

	function onMenuKeydown(event: KeyboardEvent) {
		const item = highlighted >= 0 ? current.items[highlighted] : undefined;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				move(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				move(-1);
				break;
			case 'ArrowRight':
				if (item?.children?.length) {
					event.preventDefault();
					enterSubmenu(item);
				}
				break;
			case 'ArrowLeft':
			case 'Backspace':
				if (canGoBack) {
					event.preventDefault();
					goBack();
				}
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (item) selectItem(item);
				break;
			case 'Escape':
				event.preventDefault();
				if (canGoBack) goBack();
				else {
					closeMenu();
					triggerEl?.focus();
				}
				break;
			case 'Tab':
				closeMenu();
				break;
			case 'Home':
				event.preventDefault();
				highlighted = enabledIndexes[0] ?? -1;
				break;
			case 'End':
				event.preventDefault();
				highlighted = enabledIndexes[enabledIndexes.length - 1] ?? -1;
				break;
		}
	}
</script>

<div class={['relative inline-flex', className]}>
	<button
		bind:this={triggerEl}
		{id}
		type="button"
		{disabled}
		onkeydown={onTriggerKeydown}
		class={[
			'gap-2 rounded-lg border-border bg-surface-elevated font-medium text-primary inline-flex items-center border transition-colors',
			'hover:bg-surface-overlay focus-visible:ring-brand-500/30 focus-visible:ring-2 focus-visible:outline-none',
			size === 'sm' ? 'min-h-8 px-2.5 text-xs' : 'min-h-9 px-3 text-sm',
			disabled && 'cursor-not-allowed opacity-50',
			trigger && 'p-0 border-0 bg-transparent hover:bg-transparent'
		]}
		aria-label={trigger ? label : undefined}
		aria-haspopup="menu"
		aria-expanded={open}
		aria-controls={menuId}
	>
		{#if trigger}
			{@render trigger()}
		{:else}
			{label}
			<svg
				class={['h-4 w-4 text-secondary transition-transform', open && 'rotate-180']}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		{/if}
	</button>

	<!-- Native Popover API -->
	<div
		bind:this={menuEl}
		id={menuId}
		popover="auto"
		role="menu"
		tabindex={-1}
		aria-labelledby={id}
		aria-label={current.title || label}
		style={menuStyle}
		ontoggle={handleToggle}
		onbeforetoggle={handleBeforeToggle}
		onkeydown={onMenuKeydown}
		class="dropdown-menu m-0 rounded-xl border-border bg-surface-elevated p-1.5 shadow-xl inset-auto flex-col overflow-hidden border text-left outline-none"
	>
		{#if canGoBack}
			<button
				type="button"
				onclick={goBack}
				class={[
					'mb-0.5 gap-2 rounded-lg font-medium text-primary flex w-full items-center text-left transition-colors',
					'hover:bg-surface-overlay focus-visible:ring-brand-500/30 focus-visible:ring-2 focus-visible:outline-none',
					sizePad
				]}
			>
				<svg
					class="text-secondary shrink-0"
					width={iconSize}
					height={iconSize}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
				<span class="truncate">{current.title}</span>
			</button>
			<div class="mb-1 bg-border h-px" role="separator"></div>
		{/if}

		<div bind:this={listEl} class="dropdown-menu-list min-h-0 flex-1">
			{#each current.items as item, index (item.id)}
				{#if item.separator}
					<div class="my-1 bg-border h-px" role="separator"></div>
				{:else}
					{@const Icon = item.icon}
					{@const hasChildren = Boolean(item.children?.length)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						role="menuitem"
						tabindex={-1}
						aria-disabled={item.disabled || undefined}
						aria-checked={item.checked !== undefined ? item.checked : undefined}
						aria-haspopup={hasChildren ? 'menu' : undefined}
						onclick={() => selectItem(item)}
						onpointerenter={() => {
							if (!item.disabled) highlighted = index;
						}}
						class={[
							'gap-2 rounded-lg flex w-full cursor-pointer text-left transition-colors',
							item.description ? 'items-start' : 'items-center',
							sizePad,
							item.disabled && 'cursor-not-allowed opacity-40',
							highlighted === index && !item.disabled && 'bg-surface-overlay',
							item.destructive ? 'text-red-600 dark:text-red-400' : 'text-primary'
						]}
					>
						{#if item.checked !== undefined}
							<span
								class={[
									'h-4 w-4 flex shrink-0 items-center justify-center',
									item.description && 'mt-0.5'
								]}
								aria-hidden="true"
							>
								{#if item.checked}
									<svg
										width={iconSize}
										height={iconSize}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								{/if}
							</span>
						{:else if showIconColumn}
							<span
								class={[
									'h-4 w-4 flex shrink-0 items-center justify-center',
									item.description && 'mt-0.5'
								]}
								aria-hidden="true"
							>
								{#if Icon}
									<Icon class="text-secondary" size={iconSize} strokeWidth={2} />
								{/if}
							</span>
						{/if}

						<span class="min-w-0 leading-tight flex-1">
							<span class="font-medium leading-tight block truncate">{item.label}</span>
							{#if item.description}
								<span class="font-normal leading-snug text-secondary block truncate text-[11px]">
									{item.description}
								</span>
							{/if}
						</span>

						{#if item.shortcut && !hasChildren}
							<kbd
								class="ml-2 rounded border-border bg-surface-overlay px-1.5 py-0.5 font-mono text-secondary shrink-0 border text-[10px]"
							>
								{item.shortcut}
							</kbd>
						{/if}

						{#if hasChildren}
							<svg
								class={['ml-1 text-secondary shrink-0', item.description && 'mt-0.5']}
								width={iconSize}
								height={iconSize}
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
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.dropdown-menu {
		position: fixed;
	}

	.dropdown-menu-list {
		overflow-x: hidden;
		overflow-y: var(--dropdown-scroll, visible);
		overscroll-behavior: contain;
	}

	.dropdown-menu:popover-open {
		display: flex;
	}
</style>
