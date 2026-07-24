<script lang="ts">
	import Kbd from '$lib/components/atoms/Kbd/Kbd.svelte';

	export interface CommandItem {
		id: string;
		label: string;
		group?: string;
		shortcut?: string[];
		disabled?: boolean;
	}

	interface CommandPaletteProps {
		open?: boolean;
		items?: CommandItem[];
		placeholder?: string;
		class?: string;
		onselect?: (item: CommandItem) => void;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		items = [],
		placeholder = 'Type a command or search…',
		class: className = '',
		onselect,
		onclose
	}: CommandPaletteProps = $props();

	let query = $state('');
	let activeIndex = $state(0);
	let inputEl = $state<HTMLInputElement | null>(null);

	const filtered = $derived(
		items.filter((item) => {
			if (!query.trim()) return true;
			return item.label.toLowerCase().includes(query.trim().toLowerCase());
		})
	);

	const groups = $derived.by(() => {
		const map = new Map<string, CommandItem[]>();
		for (const item of filtered) {
			const key = item.group || 'Commands';
			const list = map.get(key) ?? [];
			list.push(item);
			map.set(key, list);
		}
		return [...map.entries()];
	});

	const flat = $derived(filtered);

	$effect(() => {
		if (open) {
			query = '';
			activeIndex = 0;
			queueMicrotask(() => inputEl?.focus());
		}
	});

	$effect(() => {
		query;
		activeIndex = 0;
	});

	function close() {
		open = false;
		onclose?.();
	}

	function choose(item: CommandItem) {
		if (item.disabled) return;
		onselect?.(item);
		close();
	}

	function onKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
			return;
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = Math.min(flat.length - 1, activeIndex + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = Math.max(0, activeIndex - 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const item = flat[activeIndex];
			if (item) choose(item);
		}
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
		<button
			type="button"
			class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
			aria-label="Close command palette"
			onclick={close}
		></button>

		<div
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
			class={[
				'relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl',
				className
			]}
			onkeydown={onKeydown}
		>
			<div class="flex items-center gap-2 border-b border-border px-3">
				<svg class="h-4 w-4 shrink-0 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
				</svg>
				<input
					bind:this={inputEl}
					bind:value={query}
					{placeholder}
					class="h-12 w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted"
				/>
				<Kbd keys={['Esc']} size="sm" />
			</div>

			<div class="max-h-80 overflow-y-auto p-2">
				{#if flat.length === 0}
					<p class="px-3 py-6 text-center text-sm text-muted">No results</p>
				{:else}
					{#each groups as [groupName, groupItems] (groupName)}
						<p class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
							{groupName}
						</p>
						<ul class="mb-2 flex flex-col gap-0.5">
							{#each groupItems as item (item.id)}
								{@const index = flat.findIndex((f) => f.id === item.id)}
								<li>
									<button
										type="button"
										disabled={item.disabled}
										onclick={() => choose(item)}
										onmouseenter={() => (activeIndex = index)}
										class={[
											'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors',
											index === activeIndex
												? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
												: 'text-primary hover:bg-surface-overlay',
											item.disabled && 'cursor-not-allowed opacity-40'
										]}
									>
										<span>{item.label}</span>
										{#if item.shortcut?.length}
											<Kbd keys={item.shortcut} size="sm" />
										{/if}
									</button>
								</li>
							{/each}
						</ul>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}
