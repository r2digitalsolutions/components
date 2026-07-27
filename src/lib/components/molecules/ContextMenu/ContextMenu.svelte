<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface ContextMenuItem {
		id: string;
		label: string;
		disabled?: boolean;
		destructive?: boolean;
		separator?: boolean;
		shortcut?: string;
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
		class?: string;
		children?: Snippet;
		onselect?: (id: string, item: ContextMenuItem) => void;
	}

	let {
		items = [],
		open = $bindable(false),
		anchor = $bindable<ContextMenuAnchor | null>(null),
		class: className = '',
		children,
		onselect
	}: ContextMenuProps = $props();

	let menuX = $state(0);
	let menuY = $state(0);
	let menuEl = $state<HTMLDivElement | null>(null);
	let highlighted = $state(-1);
	/** Ignore the click/pointer that browsers fire right after `contextmenu`. */
	let suppressOutsideUntil = $state(0);

	const enabledIndexes = $derived(
		items.map((item, i) => (item.separator || item.disabled ? -1 : i)).filter((i) => i !== -1)
	);

	function placeMenu(x: number, y: number) {
		menuX = x;
		menuY = y;
		requestAnimationFrame(() => {
			if (!menuEl) return;
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const { offsetWidth: mw, offsetHeight: mh } = menuEl;
			menuX = x + mw > vw - 8 ? Math.max(8, x - mw) : x;
			menuY = y + mh > vh - 8 ? Math.max(8, y - mh) : y;
		});
	}

	function openAt(x: number, y: number) {
		anchor = { x, y };
		open = true;
		highlighted = -1;
		suppressOutsideUntil = performance.now() + 500;
		placeMenu(x, y);
	}

	function close() {
		open = false;
		anchor = null;
		highlighted = -1;
	}

	function selectItem(item: ContextMenuItem) {
		if (item.disabled || item.separator) return;
		onselect?.(item.id, item);
		close();
	}

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		openAt(event.clientX, event.clientY);
	}

	function isOutsideEvent(event: Event) {
		if (!open) return false;
		if (performance.now() < suppressOutsideUntil) return false;
		const target = event.target as Node | null;
		if (menuEl && target && menuEl.contains(target)) return false;
		return true;
	}

	function handleOutsidePointer(event: PointerEvent) {
		if (event.button === 2) return;
		if (!isOutsideEvent(event)) return;
		close();
	}

	function handleOutsideClick(event: MouseEvent) {
		if (event.button === 2) return;
		if (!isOutsideEvent(event)) return;
		close();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open) return;
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
				event.preventDefault();
				const item = highlighted >= 0 ? items[highlighted] : undefined;
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

	/** Render menu in document.body so overflow/transform ancestors cannot clip it. */
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

	$effect(() => {
		if (!open || !anchor) return;
		suppressOutsideUntil = performance.now() + 500;
		placeMenu(anchor.x, anchor.y);
	});
</script>

<svelte:window
	onpointerdown={handleOutsidePointer}
	onclick={handleOutsideClick}
	onkeydown={handleKeydown}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={['h-full min-h-0 w-full', className]} oncontextmenu={handleContextMenu}>
	{#if children}
		{@render children()}
	{/if}
</div>

{#if open}
	<div
		use:portal
		bind:this={menuEl}
		role="menu"
		tabindex={-1}
		aria-label="Context menu"
		style="position:fixed;top:{menuY}px;left:{menuX}px;z-index:9999;"
		class="min-w-44 rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl outline-none"
	>
		{#each items as item, index (item.id)}
			{#if item.separator}
				<div class="my-1 h-px bg-border" role="separator"></div>
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
						'flex cursor-pointer items-center justify-between gap-4 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
						item.disabled && 'cursor-not-allowed opacity-40',
						highlighted === index && !item.disabled && 'bg-surface-overlay',
						item.destructive ? 'text-red-600 dark:text-red-400' : 'text-primary'
					]}
				>
					<span class="truncate">{item.label}</span>
					{#if item.shortcut}
						<kbd
							class="shrink-0 rounded border border-border bg-surface-overlay px-1.5 py-0.5 font-mono text-[10px] text-secondary"
						>
							{item.shortcut}
						</kbd>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
{/if}
