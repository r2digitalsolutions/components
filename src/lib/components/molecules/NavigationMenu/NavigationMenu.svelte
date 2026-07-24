<script lang="ts">
	export interface NavMenuChild {
		id: string;
		label: string;
		href?: string;
		description?: string;
	}

	export interface NavMenuItem {
		id: string;
		label: string;
		href?: string;
		description?: string;
		children?: NavMenuChild[];
	}

	interface NavigationMenuProps {
		items?: NavMenuItem[];
		class?: string;
		onselect?: (id: string) => void;
	}

	let {
		items = [],
		class: className = '',
		onselect
	}: NavigationMenuProps = $props();

	let openId = $state<string | null>(null);
	let navEl = $state<HTMLElement | null>(null);

	function toggle(id: string) {
		openId = openId === id ? null : id;
	}

	function close() {
		openId = null;
	}

	function handleSelect(id: string) {
		onselect?.(id);
		close();
	}

	$effect(() => {
		if (!openId) return;
		function onPointerDown(e: PointerEvent) {
			if (navEl && !navEl.contains(e.target as Node)) close();
		}
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	});
</script>

<nav bind:this={navEl} class={['flex items-center gap-1', className]} role="navigation">
	{#each items as item (item.id)}
		{@const isOpen = openId === item.id}
		{@const hasChildren = Boolean(item.children?.length)}

		<div class="relative">
			{#if hasChildren}
				<button
					type="button"
					onclick={() => toggle(item.id)}
					aria-expanded={isOpen}
					aria-haspopup="menu"
					class={[
						'flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors outline-none',
						'focus-visible:ring-2 focus-visible:ring-brand-500/30',
						isOpen ? 'bg-surface-overlay text-primary' : 'text-secondary hover:text-primary hover:bg-surface-overlay'
					]}
				>
					{item.label}
					<svg
						class={['h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180']}
						viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			{:else}
				<a
					href={item.href ?? '#'}
					onclick={() => handleSelect(item.id)}
					class="flex h-9 items-center rounded-lg px-3 text-sm font-medium text-secondary transition-colors hover:text-primary hover:bg-surface-overlay outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
				>
					{item.label}
				</a>
			{/if}

			{#if hasChildren && isOpen}
				<div
					class="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-surface-elevated p-2 shadow-xl"
					role="menu"
				>
					{#if item.description}
						<p class="px-3 pb-2 pt-1 text-xs text-muted border-b border-border mb-1">{item.description}</p>
					{/if}
					{#each item.children ?? [] as child (child.id)}
						<a
							href={child.href ?? '#'}
							role="menuitem"
							onclick={() => handleSelect(child.id)}
							class="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-overlay outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
						>
							<div class="text-sm font-medium text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
								{child.label}
							</div>
							{#if child.description}
								<div class="mt-0.5 text-xs text-muted">{child.description}</div>
							{/if}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</nav>
