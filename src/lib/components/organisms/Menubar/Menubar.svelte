<script lang="ts">
	export interface MenubarSubItem {
		id: string;
		label: string;
		disabled?: boolean;
		separator?: boolean;
		shortcut?: string;
		destructive?: boolean;
		/** Show a leading check column (macOS / Cursor style). */
		checked?: boolean;
		/** Nested flyout submenu. */
		children?: MenubarSubItem[];
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
	let flyoutId = $state<string | null>(null);
	let menubarEl = $state<HTMLElement | null>(null);
	let menuEl = $state<HTMLDivElement | null>(null);
	let menuStyle = $state('');
	let highlightedId = $state<string | null>(null);

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
		flyoutId = null;
		highlightedId = null;
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
		const menuW = Math.max(220, menuEl.offsetWidth || 220);
		if (left + menuW > window.innerWidth - pad) {
			left = Math.max(pad, window.innerWidth - menuW - pad);
		}
		// inset:auto must come BEFORE top/left — shorthand would clear them
		if (openUp) {
			menuStyle = `position:fixed;margin:0;inset:auto;bottom:${Math.round(window.innerHeight - rect.top + 2)}px;left:${Math.round(left)}px;`;
		} else {
			menuStyle = `position:fixed;margin:0;inset:auto;top:${Math.round(rect.bottom + 2)}px;left:${Math.round(left)}px;`;
		}
	}

	function open(id: string) {
		openId = id;
		flyoutId = null;
		highlightedId = null;
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
		if (subItem.children?.length) return;
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
			flyoutId = null;
			highlightedId = null;
			menuStyle = '';
		}
	}

	function levelHasChecks(list: MenubarSubItem[]) {
		return list.some((i) => !i.separator && i.checked !== undefined);
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

{#snippet menuRows(list: MenubarSubItem[], parentId: string)}
	{@const checks = levelHasChecks(list)}
	{#each list as sub (sub.id)}
		{#if sub.separator}
			<div class="menubar-sep" role="separator"></div>
		{:else}
			{@const hasChildren = Boolean(sub.children?.length)}
			{@const isHot = highlightedId === sub.id || flyoutId === sub.id}
			<div
				class="relative"
				role="presentation"
				onmouseenter={() => {
					if (sub.disabled) return;
					highlightedId = sub.id;
					flyoutId = hasChildren ? sub.id : null;
				}}
			>
				<button
					type="button"
					role={sub.checked !== undefined ? 'menuitemcheckbox' : 'menuitem'}
					disabled={sub.disabled}
					aria-disabled={sub.disabled || undefined}
					aria-checked={sub.checked !== undefined ? sub.checked : undefined}
					aria-haspopup={hasChildren ? 'menu' : undefined}
					aria-expanded={hasChildren ? flyoutId === sub.id : undefined}
					onclick={() => select(sub, parentId)}
					class={[
						'menubar-item',
						isHot && !sub.disabled && 'menubar-item-hot',
						sub.disabled && 'menubar-item-disabled',
						!sub.disabled && sub.destructive && 'menubar-item-danger',
						!sub.disabled && !sub.destructive && 'menubar-item-default'
					]}
				>
					{#if checks}
						<span class="menubar-check" aria-hidden="true">
							{#if sub.checked}
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							{/if}
						</span>
					{/if}
					<span class="menubar-label">{sub.label}</span>
					{#if sub.shortcut && !hasChildren}
						<span class="menubar-shortcut">{sub.shortcut}</span>
					{:else if hasChildren}
						<svg
							class="menubar-chevron"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.25"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					{/if}
				</button>

				{#if hasChildren && flyoutId === sub.id && sub.children?.length}
					<div
						class="menubar-panel menubar-flyout"
						role="menu"
						tabindex="-1"
						onmouseenter={() => {
							flyoutId = sub.id;
							highlightedId = sub.id;
						}}
					>
						{@render menuRows(sub.children, parentId)}
					</div>
				{/if}
			</div>
		{/if}
	{/each}
{/snippet}

<div bind:this={menubarEl} class={['menubar-bar flex items-center gap-px', className]} role="menubar">
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
				'menubar-trigger',
				isOpen ? 'menubar-trigger-open' : 'menubar-trigger-idle'
			]}
		>
			{item.label}
		</button>
	{/each}
</div>

<!-- Single shared menu in the top layer (native Popover) -->
<div
	bind:this={menuEl}
	id={openId ? menuDomId(openId) : 'menubar-menu'}
	popover="auto"
	role="menu"
	tabindex="-1"
	ontoggle={onToggle}
	style={menuStyle}
	class="menubar-popover menubar-panel m-0 outline-none"
>
	{#if openItem?.items?.length}
		{@render menuRows(openItem.items, openItem.id)}
	{/if}
</div>

<style>
	/* UA popover defaults to inset:0 — force anchor via inline style */
	.menubar-popover:popover-open {
		inset: unset;
	}

	.menubar-trigger {
		display: flex;
		align-items: center;
		height: 1.5rem;
		padding: 0 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.8125rem;
		line-height: 1;
		font-weight: 400;
		letter-spacing: -0.01em;
		outline: none;
		transition: background-color 80ms ease, color 80ms ease;
	}

	.menubar-trigger:focus-visible {
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-brand-500, #3b82f6) 35%, transparent);
	}

	.menubar-trigger-idle {
		color: var(--text-secondary, var(--color-text-secondary, #737373));
	}

	.menubar-trigger-idle:hover {
		/* text-primary is light in dark mode → soft white wash (never surface-overlay #171717) */
		background: color-mix(in oklab, var(--text-primary, var(--color-text-primary, CanvasText)) 14%, transparent);
		color: var(--text-primary, var(--color-text-primary, CanvasText));
	}

	.menubar-trigger-open {
		background: color-mix(in oklab, var(--color-brand-500, #3b82f6) 22%, transparent);
		color: var(--text-primary, var(--color-text-primary, CanvasText));
	}

	:global(.dark) .menubar-trigger-idle:hover,
	:global(html.dark) .menubar-trigger-idle:hover,
	:global(:root.dark) .menubar-trigger-idle:hover {
		background: color-mix(in oklab, #fff 14%, transparent);
		color: #fff;
	}

	:global(.dark) .menubar-trigger-open,
	:global(html.dark) .menubar-trigger-open,
	:global(:root.dark) .menubar-trigger-open {
		background: color-mix(in oklab, var(--color-brand-500, #3b82f6) 32%, transparent);
		color: #fff;
	}

	:global(.menubar-panel) {
		min-width: 13.75rem;
		padding: 0.25rem;
		border-radius: 0.5rem;
		border: 1px solid color-mix(in oklab, var(--color-border, #e5e5e5) 90%, transparent);
		background: color-mix(in oklab, var(--color-surface-elevated, #fff) 88%, transparent);
		backdrop-filter: blur(20px) saturate(1.4);
		-webkit-backdrop-filter: blur(20px) saturate(1.4);
		box-shadow:
			0 0 0 0.5px color-mix(in oklab, #000 8%, transparent),
			0 10px 40px -8px color-mix(in oklab, #000 35%, transparent),
			0 4px 12px -4px color-mix(in oklab, #000 18%, transparent);
	}

	:global(.dark) :global(.menubar-panel),
	:global([data-theme='dark']) :global(.menubar-panel) {
		border-color: color-mix(in oklab, #fff 12%, transparent);
		background: color-mix(in oklab, #1c1c1e 82%, transparent);
		box-shadow:
			0 0 0 0.5px color-mix(in oklab, #fff 8%, transparent),
			0 16px 48px -12px color-mix(in oklab, #000 65%, transparent),
			0 4px 16px -4px color-mix(in oklab, #000 40%, transparent);
	}

	:global(.menubar-flyout) {
		position: absolute;
		left: calc(100% - 2px);
		top: -0.25rem;
		z-index: 2;
	}

	:global(.menubar-sep) {
		height: 1px;
		margin: 0.25rem 0.5rem;
		background: color-mix(in oklab, var(--color-border, #e5e5e5) 85%, transparent);
	}

	:global(.dark) :global(.menubar-sep) {
		background: color-mix(in oklab, #fff 12%, transparent);
	}

	:global(.menubar-item) {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 0.5rem;
		min-height: 1.375rem;
		padding: 0.2rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.8125rem;
		line-height: 1.2;
		letter-spacing: -0.01em;
		text-align: left;
		outline: none;
		transition: background-color 60ms ease, color 60ms ease;
	}

	:global(.menubar-item-default) {
		color: var(--text-primary, var(--color-text-primary, #171717));
	}

	:global(.dark) :global(.menubar-item-default) {
		color: #f5f5f5;
	}

	:global(.menubar-item-hot) {
		background: var(--color-brand-500, #007aff) !important;
		color: #fff !important;
	}

	:global(.menubar-item-hot) :global(.menubar-shortcut),
	:global(.menubar-item-hot) :global(.menubar-chevron),
	:global(.menubar-item-hot) :global(.menubar-check) {
		color: color-mix(in oklab, #fff 78%, transparent) !important;
	}

	:global(.menubar-item-danger):not(:global(.menubar-item-hot)) {
		color: #ef4444;
	}

	:global(.menubar-item-disabled) {
		cursor: not-allowed;
		opacity: 0.38;
	}

	:global(.menubar-check) {
		display: flex;
		width: 0.875rem;
		height: 0.875rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
	}

	:global(.menubar-label) {
		min-width: 0;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.menubar-shortcut) {
		margin-left: 1.5rem;
		flex-shrink: 0;
		font-size: 0.75rem;
		letter-spacing: 0.02em;
		color: var(--color-muted, #a3a3a3);
		font-variant-numeric: tabular-nums;
	}

	:global(.menubar-chevron) {
		margin-left: 0.75rem;
		flex-shrink: 0;
		opacity: 0.7;
	}
</style>
