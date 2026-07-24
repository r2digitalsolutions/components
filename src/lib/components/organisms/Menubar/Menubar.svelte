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

	function open(id: string) {
		openId = id;
	}

	function close() {
		openId = null;
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
		if (e.key === 'Escape') { e.preventDefault(); close(); return; }
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

	$effect(() => {
		if (!openId) return;
		function onPointerDown(e: PointerEvent) {
			if (menubarEl && !menubarEl.contains(e.target as Node)) close();
		}
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	});
</script>

<nav bind:this={menubarEl} class={['flex items-center gap-0.5 rounded-xl border border-border bg-surface-elevated px-2 py-1.5', className]} role="menubar">
	{#each items as item (item.id)}
		{@const isOpen = openId === item.id}
		<div class="relative">
			<button
				type="button"
				role="menuitem"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				onclick={() => toggle(item.id)}
				onmouseenter={() => { if (openId !== null) open(item.id); }}
				onkeydown={(e) => handleMenuKeydown(e, item)}
				class={[
					'flex h-8 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors duration-100 outline-none',
					'focus-visible:ring-2 focus-visible:ring-brand-500/30',
					isOpen ? 'bg-surface-overlay text-primary' : 'text-secondary hover:bg-surface-overlay hover:text-primary'
				]}
			>
				{item.label}
				{#if item.items?.length}
					<svg class={['h-3 w-3 transition-transform duration-150', isOpen && 'rotate-180']} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				{/if}
			</button>

			{#if isOpen && item.items?.length}
				<div
					role="menu"
					class="absolute left-0 top-full z-50 mt-1.5 min-w-[200px] rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl"
					onkeydown={(e) => handleMenuKeydown(e, item)}
				>
					{#each item.items as sub (sub.id)}
						{#if sub.separator}
							<div class="my-1 h-px bg-border" role="separator"></div>
						{:else}
							<button
								type="button"
								role="menuitem"
								disabled={sub.disabled}
								onclick={() => select(sub, item.id)}
								class={[
									'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-75 outline-none',
									sub.disabled && 'cursor-not-allowed opacity-40',
									!sub.disabled && sub.destructive && 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40',
									!sub.disabled && !sub.destructive && 'text-primary hover:bg-surface-overlay',
									'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/30'
								]}
							>
								<span class="min-w-0 flex-1 truncate">{sub.label}</span>
								{#if sub.shortcut}
									<kbd class="ml-auto shrink-0 rounded bg-surface-overlay px-1.5 py-0.5 text-[10px] font-mono text-muted">
										{sub.shortcut}
									</kbd>
								{/if}
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</nav>
