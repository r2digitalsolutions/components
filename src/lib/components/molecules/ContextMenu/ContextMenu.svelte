<script lang="ts">
	import type { Snippet } from 'svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';

	export interface ContextMenuItem {
		id: string;
		label: string;
		disabled?: boolean;
		destructive?: boolean;
		separator?: boolean;
		/** Non-interactive section header (category title). */
		header?: boolean;
		shortcut?: string;
		/** Group label — items sharing a category are shown under one header. */
		category?: string;
		description?: string;
	}

	export interface ContextMenuAnchor {
		x: number;
		y: number;
	}

	interface ContextMenuProps {
		items?: ContextMenuItem[];
		open?: boolean;
		/** Screen coordinates for the menu (clientX / clientY). */
		anchor?: ContextMenuAnchor | null;
		/** Show a search field and filter items by label / description / category. */
		searchable?: boolean;
		searchPlaceholder?: string;
		class?: string;
		children?: Snippet;
		onselect?: (id: string, item: ContextMenuItem) => void;
		onclose?: () => void;
	}

	let {
		items = [],
		open = $bindable(false),
		anchor = $bindable<ContextMenuAnchor | null>(null),
		searchable = false,
		searchPlaceholder = 'Search…',
		class: className = '',
		children,
		onselect,
		onclose
	}: ContextMenuProps = $props();

	let menuX = $state(0);
	let menuY = $state(0);
	let menuEl = $state<HTMLDivElement | null>(null);
	let highlighted = $state(-1);
	let query = $state('');
	const menuId = `ctx-menu-${Math.random().toString(36).slice(2, 9)}`;

	const filteredItems = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter((item) => {
			if (item.separator || item.header) return false;
			return (
				item.label.toLowerCase().includes(q) ||
				item.description?.toLowerCase().includes(q) ||
				item.category?.toLowerCase().includes(q) ||
				item.id.toLowerCase().includes(q)
			);
		});
	});

	/** Flat list with auto category headers when items carry `category`. */
	const displayItems = $derived.by(() => {
		const src = filteredItems;
		const hasCategories = src.some((i) => i.category && !i.header && !i.separator);
		if (!hasCategories) return src;

		const actionable = src
			.filter((i) => !i.separator && !i.header)
			.slice()
			.sort((a, b) => {
				const ca = a.category ?? 'Other';
				const cb = b.category ?? 'Other';
				if (ca !== cb) return ca.localeCompare(cb);
				return a.label.localeCompare(b.label);
			});

		const out: ContextMenuItem[] = [];
		let lastCat = '';
		let seq = 0;
		for (const item of actionable) {
			const cat = item.category ?? 'Other';
			if (cat !== lastCat) {
				if (out.length) out.push({ id: `sep:${seq++}`, label: '', separator: true });
				out.push({ id: `hdr:${seq++}`, label: cat, header: true });
				lastCat = cat;
			}
			out.push(item);
		}
		return out;
	});

	const enabledIndexes = $derived(
		displayItems
			.map((item, i) => (item.separator || item.header || item.disabled ? -1 : i))
			.filter((i) => i !== -1)
	);

	function clampMenuPosition(x: number, y: number) {
		if (!menuEl) return;
		const pad = 8;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const mw = menuEl.offsetWidth;
		const mh = menuEl.offsetHeight;
		if (mw <= 0 || mh <= 0) {
			menuX = x;
			menuY = y;
			return;
		}
		let nextX = x;
		let nextY = y;
		// Flip if overflowing right / bottom
		if (nextX + mw > vw - pad) nextX = x - mw;
		if (nextY + mh > vh - pad) nextY = y - mh;
		// Always keep fully inside the viewport
		menuX = Math.min(Math.max(pad, nextX), Math.max(pad, vw - mw - pad));
		menuY = Math.min(Math.max(pad, nextY), Math.max(pad, vh - mh - pad));
	}

	function placeMenu(x: number, y: number) {
		menuX = x;
		menuY = y;
		requestAnimationFrame(() => {
			clampMenuPosition(x, y);
		});
	}

	function showMenu() {
		if (!menuEl) return;
		if (!menuEl.matches(':popover-open')) menuEl.showPopover();
	}

	function hideMenu() {
		if (menuEl?.matches(':popover-open')) menuEl.hidePopover();
	}

	function openAt(x: number, y: number) {
		anchor = { x, y };
		open = true;
		highlighted = -1;
		query = '';
		menuX = x;
		menuY = y;
		// Defer past the contextmenu/mouseup that would light-dismiss a popover=auto.
		// Measure after showPopover — closed popovers have display:none (0×0).
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!open) return;
				showMenu();
				requestAnimationFrame(() => clampMenuPosition(x, y));
			});
		});
	}

	function close() {
		if (menuEl?.matches(':popover-open')) {
			menuEl.hidePopover();
			return;
		}
		if (!open && !anchor) return;
		open = false;
		anchor = null;
		highlighted = -1;
		query = '';
		onclose?.();
	}

	function selectItem(item: ContextMenuItem) {
		if (item.disabled || item.separator || item.header) return;
		onselect?.(item.id, item);
		close();
	}

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		openAt(event.clientX, event.clientY);
	}

	function onToggle(event: ToggleEvent) {
		if (event.newState === 'open') {
			open = true;
			return;
		}
		open = false;
		anchor = null;
		highlighted = -1;
		query = '';
		onclose?.();
	}

	/** Manual popover: close on outside pointer. Keep open on scroll —
	 * the menu is position:fixed, and closing on scroll also kills scrolling
	 * inside a long/searchable menu.
	 * Right-click (button 2) is ignored so retargeting another item keeps the menu open. */
	function onDocPointerDown(event: PointerEvent) {
		if (!open) return;
		if (event.button === 2) return;
		const t = event.target;
		if (t instanceof Node && menuEl?.contains(t)) return;
		close();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open && !menuEl?.matches(':popover-open')) return;
		const tag = (event.target as HTMLElement)?.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA') {
			if (event.key === 'Escape') {
				event.preventDefault();
				close();
			}
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
				/* allow nav from search */
			} else {
				return;
			}
		}
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				close();
				break;
			case 'ArrowDown':
				event.preventDefault();
				move(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				move(-1);
				break;
			case 'Enter':
			case ' ': {
				if (tag === 'INPUT' && event.key === ' ') return;
				event.preventDefault();
				const item = highlighted >= 0 ? displayItems[highlighted] : undefined;
				if (item) selectItem(item);
				break;
			}
		}
	}

	function move(dir: 1 | -1) {
		const pos = enabledIndexes.indexOf(highlighted);
		if (pos === -1) {
			highlighted = enabledIndexes[dir === 1 ? 0 : enabledIndexes.length - 1] ?? -1;
		} else {
			const next = (pos + dir + enabledIndexes.length) % enabledIndexes.length;
			highlighted = enabledIndexes[next];
		}
	}

	$effect(() => {
		if (!open || !anchor) {
			if (!open) hideMenu();
			return;
		}
		const x = anchor.x;
		const y = anchor.y;
		highlighted = -1;
		menuX = x;
		menuY = y;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!open) return;
				showMenu();
				requestAnimationFrame(() => clampMenuPosition(x, y));
			});
		});
	});

	$effect(() => {
		if (!open) return;
		// Bind after current pointer gesture ends so the opening right-click doesn't close us.
		const timer = window.setTimeout(() => {
			document.addEventListener('pointerdown', onDocPointerDown, true);
		}, 0);
		return () => {
			window.clearTimeout(timer);
			document.removeEventListener('pointerdown', onDocPointerDown, true);
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if children}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class={['h-full min-h-0 w-full', className]} oncontextmenu={handleContextMenu}>
		{@render children()}
	</div>
{/if}

<!-- Manual popover — context menus must not light-dismiss on the opening mouseup -->
<div
	bind:this={menuEl}
	id={menuId}
	popover="manual"
	role="menu"
	tabindex={-1}
	aria-label="Context menu"
	ontoggle={onToggle}
	style={`top:${menuY}px;left:${menuX}px;margin:0;`}
	class={[
		'context-menu-popover flex max-h-[min(28rem,70vh)] min-w-52 max-w-72 flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-xl outline-none',
		!children && className
	]}
>
	{#if searchable}
		<div class="border-b border-border p-2">
			<SearchInput bind:value={query} placeholder={searchPlaceholder} size="sm" />
		</div>
	{/if}
	<div class="min-h-0 flex-1 overflow-auto p-1.5">
		{#each displayItems as item, index (item.id)}
			{#if item.separator}
				<div class="my-1 h-px bg-border" role="separator"></div>
			{:else if item.header}
				<p
					class="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted"
					role="presentation"
				>
					{item.label}
				</p>
			{:else}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					role="menuitem"
					tabindex={-1}
					aria-disabled={item.disabled || undefined}
					onclick={() => selectItem(item)}
					onpointerenter={() => {
						if (!item.disabled) highlighted = index;
					}}
					onpointerleave={() => {
						highlighted = -1;
					}}
					class={[
						'flex cursor-pointer items-start justify-between gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
						item.disabled && 'cursor-not-allowed opacity-40',
						highlighted === index && !item.disabled && 'bg-surface-overlay',
						item.destructive ? 'text-red-600 dark:text-red-400' : 'text-primary'
					]}
				>
					<span class="min-w-0">
						<span class="block truncate">{item.label}</span>
						{#if item.description}
							<span class="block truncate text-[11px] font-normal text-muted">{item.description}</span>
						{/if}
					</span>
					{#if item.shortcut}
						<kbd
							class="mt-0.5 shrink-0 rounded border border-border bg-surface-overlay px-1.5 py-0.5 font-mono text-[10px] text-secondary"
						>
							{item.shortcut}
						</kbd>
					{/if}
				</div>
			{/if}
		{:else}
			<p class="px-3 py-6 text-center text-xs text-muted">No matches</p>
		{/each}
	</div>
</div>

<style>
	/* UA popover defaults to inset:0 — position via top/left only.
	   Tailwind `flex` overrides UA display:none — hide until open. */
	.context-menu-popover {
		position: fixed;
	}
	.context-menu-popover:not(:popover-open) {
		display: none !important;
	}
	.context-menu-popover:popover-open {
		inset: unset;
		display: flex;
	}
</style>
