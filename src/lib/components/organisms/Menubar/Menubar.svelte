<script lang="ts">
	export interface MenubarSubItem {
		id: string;
		label: string;
		disabled?: boolean;
		separator?: boolean;
		shortcut?: string;
		destructive?: boolean;
	}

	export interface MenubarItem {
		id: string;
		label: string;
		items?: MenubarSubItem[];
	}

	interface MenubarProps {
		items?: MenubarItem[];
		class?: string;
		onselect?: (itemId: string, parentId: string) => void;
	}

	let {
		items = [],
		class: className = '',
		onselect
	}: MenubarProps = $props();

	let openId = $state<string | null>(null);
	let menubarEl = $state<HTMLElement | null>(null);
	let menuEl = $state<HTMLDivElement | null>(null);
	let menuStyle = $state('');

	function menuDomId(id: string) {
		return `menubar-menu-${id}`;
	}

	function close() {
		if (menuEl?.matches(':popover-open')) {
			try {
				menuEl.hidePopover();
			} catch {
				/* ignore */
			}
		}
		openId = null;
		menuStyle = '';
	}

	function positionMenu(id: string) {
		const btn = menubarEl?.querySelector(
			`[data-menubar-trigger="${id}"]`
		) as HTMLElement | null;
		if (!btn || !menuEl) return;
		const rect = btn.getBoundingClientRect();
		const pad = 8;
		const menuH = menuEl.offsetHeight || 200;
		const spaceBelow = window.innerHeight - rect.bottom - pad;
		const openUp = spaceBelow < menuH && rect.top > spaceBelow;
		let left = rect.left;
		const menuW = Math.max(200, menuEl.offsetWidth || 200);
		if (left + menuW > window.innerWidth - pad) {
			left = Math.max(pad, window.innerWidth - menuW - pad);
		}
		if (openUp) {
			menuStyle = `position:fixed;bottom:${Math.round(window.innerHeight - rect.top + 6)}px;left:${Math.round(left)}px;margin:0;inset:auto;`;
		} else {
			menuStyle = `position:fixed;top:${Math.round(rect.bottom + 6)}px;left:${Math.round(left)}px;margin:0;inset:auto;`;
		}
	}

	function open(id: string) {
		openId = id;
		queueMicrotask(() => {
			if (!menuEl) return;
			try {
				if (!menuEl.matches(':popover-open')) menuEl.showPopover();
			} catch {
				/* ignore */
			}
			positionMenu(id);
			requestAnimationFrame(() => positionMenu(id));
		});
	}

	function toggle(id: string) {
		if (openId === id) close();
		else open(id);
	}

	function select(subItem: MenubarSubItem, parentId: string) {
		if (subItem.disabled || subItem.separator) return;
		onselect?.(subItem.id, parentId);
		close();
	}

	function handleMenuKeydown(e: KeyboardEvent, item: MenubarItem) {
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
			return;
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			const idx = items.findIndex((i) => i.id === item.id);
			const prev = items[(idx - 1 + items.length) % items.length];
			open(prev.id);
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			const idx = items.findIndex((i) => i.id === item.id);
			const next = items[(idx + 1) % items.length];
			open(next.id);
		}
	}

	function onToggle(e: ToggleEvent) {
		if (e.newState === 'closed') {
			openId = null;
			menuStyle = '';
		}
	}

	$effect(() => {
		if (!openId) return;
		const onWin = () => {
			if (openId) positionMenu(openId);
		};
		window.addEventListener('resize', onWin);
		window.addEventListener('scroll', onWin, true);
		return () => {
			window.removeEventListener('resize', onWin);
			window.removeEventListener('scroll', onWin, true);
		};
	});

	const openItem = $derived(items.find((i) => i.id === openId) ?? null);
</script>

<nav bind:this={menubarEl} class={['flex items-center gap-0.5', className]} role="menubar">
	{#each items as item (item.id)}
		{@const isOpen = openId === item.id}
		<button
			type="button"
			role="menuitem"
			data-menubar-trigger={item.id}
			aria-haspopup="menu"
			aria-expanded={isOpen}
			aria-controls={menuDomId(item.id)}
			onclick={() => toggle(item.id)}
			onmouseenter={() => {
				if (openId !== null && openId !== item.id) open(item.id);
			}}
			onkeydown={(e) => handleMenuKeydown(e, item)}
			class={[
				'flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-medium transition-colors duration-100 outline-none sm:h-8 sm:px-3 sm:text-sm',
				'focus-visible:ring-2 focus-visible:ring-brand-500/30',
				isOpen
					? 'bg-surface-overlay text-primary'
					: 'text-secondary hover:bg-surface-overlay hover:text-primary'
			]}
		>
			{item.label}
			{#if item.items?.length}
				<svg
					class={['h-3 w-3 opacity-60 transition-transform duration-150', isOpen && 'rotate-180']}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			{/if}
		</button>
	{/each}
</nav>

<!-- Single shared menu in the top layer (native Popover) -->
<div
	bind:this={menuEl}
	id={openId ? menuDomId(openId) : 'menubar-menu'}
	popover="auto"
	role="menu"
	ontoggle={onToggle}
	style={menuStyle}
	class="menubar-popover m-0 min-w-[200px] rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl outline-none"
>
	{#if openItem?.items?.length}
		{#each openItem.items as sub (sub.id)}
			{#if sub.separator}
				<div class="my-1 h-px bg-border" role="separator"></div>
			{:else}
				<button
					type="button"
					role="menuitem"
					disabled={sub.disabled}
					onclick={() => select(sub, openItem.id)}
					class={[
						'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-75 outline-none',
						sub.disabled && 'cursor-not-allowed opacity-40',
						!sub.disabled &&
							sub.destructive &&
							'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40',
						!sub.disabled && !sub.destructive && 'text-primary hover:bg-surface-overlay',
						'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/30'
					]}
				>
					<span class="min-w-0 flex-1 truncate">{sub.label}</span>
					{#if sub.shortcut}
						<kbd
							class="ml-auto shrink-0 rounded bg-surface-overlay px-1.5 py-0.5 font-mono text-[10px] text-muted"
						>
							{sub.shortcut}
						</kbd>
					{/if}
				</button>
			{/if}
		{/each}
	{/if}
</div>
