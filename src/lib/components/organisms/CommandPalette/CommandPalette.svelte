<script lang="ts">
	import type { Component } from 'svelte';
	import { untrack } from 'svelte';
	import Kbd from '$lib/components/atoms/Kbd/Kbd.svelte';
	import { i18n } from '$lib/utils/i18n.svelte';

	export type CommandIcon = Component<{
		class?: string;
		size?: number | string;
		strokeWidth?: number | string;
	}>;

	export interface CommandItem {
		id: string;
		label: string;
		group?: string;
		shortcut?: string[];
		disabled?: boolean;
		subtitle?: string;
		keywords?: string;
		href?: string;
		icon?: CommandIcon;
	}

	interface CommandPaletteProps {
		open?: boolean;
		items?: CommandItem[];
		placeholder?: string;
		emptyLabel?: string;
		loading?: boolean;
		class?: string;
		onselect?: (item: CommandItem) => void;
		onclose?: () => void;
		onquery?: (query: string) => void;
	}

	let {
		open = $bindable(false),
		items = [],
		placeholder,
		emptyLabel,
		loading = false,
		class: className = '',
		onselect,
		onclose,
		onquery
	}: CommandPaletteProps = $props();

	let query = $state('');
	let activeIndex = $state(0);
	let dialogEl = $state<HTMLDialogElement | null>(null);
	let listEl = $state<HTMLDivElement | null>(null);
	/** El click que abre la paleta llega al ::backdrop y la cerraría al instante. */
	let ignoreBackdropUntil = 0;
	const listId = 'command-palette-list';

	const resolvedPlaceholder = $derived(placeholder ?? i18n.t('commandPalettePlaceholder'));
	const resolvedEmpty = $derived(emptyLabel ?? i18n.t('noResults'));
	const dialogLabel = $derived(i18n.t('commandPalette'));

	function normalize(value: string) {
		return value
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();
	}

	function matches(item: CommandItem, haystack: string) {
		if (!haystack) return true;
		const blob = normalize([item.label, item.subtitle ?? '', item.keywords ?? ''].join(' '));
		return blob.includes(haystack);
	}

	const filtered = $derived.by(() => {
		const haystack = normalize(query.trim());
		return items.filter((item) => matches(item, haystack));
	});

	const groups = $derived.by(() => {
		const map = new Map<string, { item: CommandItem; index: number }[]>();
		filtered.forEach((item, index) => {
			const key = item.group || dialogLabel;
			const list = map.get(key) ?? [];
			list.push({ item, index });
			map.set(key, list);
		});
		return [...map.entries()];
	});

	const flat = $derived(filtered);
	const showIconColumn = $derived(flat.some((item) => item.icon));
	const activeItem = $derived(flat[activeIndex] ?? null);
	const activeOptionId = $derived(activeItem ? optionId(activeItem.id) : undefined);

	function optionId(id: string) {
		return `${listId}-${id}`;
	}

	function firstEnabledIndex() {
		return flat.findIndex((item) => !item.disabled);
	}

	function nextEnabled(from: number, dir: 1 | -1) {
		if (!flat.length) return 0;
		let i = from;
		for (let n = 0; n < flat.length; n++) {
			i = (i + dir + flat.length) % flat.length;
			if (!flat[i]?.disabled) return i;
		}
		return from;
	}

	/** Desplaza solo el listado, no el <dialog> (scrollIntoView arrastra ancestros). */
	function keepVisible(node: HTMLElement) {
		const frame = requestAnimationFrame(() => {
			const list = listEl;
			if (!list) return;
			const listRect = list.getBoundingClientRect();
			const rect = node.getBoundingClientRect();
			if (rect.bottom > listRect.bottom) {
				list.scrollTop += rect.bottom - listRect.bottom;
			} else if (rect.top < listRect.top) {
				list.scrollTop -= listRect.top - rect.top;
			}
		});
		return () => cancelAnimationFrame(frame);
	}

	$effect(() => {
		if (!dialogEl) return;
		if (open && !dialogEl.open) {
			query = '';
			activeIndex = Math.max(0, firstEnabledIndex());
			untrack(() => onquery?.(''));
			ignoreBackdropUntil = Date.now() + 400;
			dialogEl.showModal();
		} else if (!open && dialogEl.open) {
			dialogEl.close();
		}
	});

	function close() {
		open = false;
		onclose?.();
	}

	function handleDialogClose() {
		if (open) close();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (!dialogEl) return;
		if (Date.now() < ignoreBackdropUntil) return;
		const rect = dialogEl.getBoundingClientRect();
		const inside =
			event.clientX >= rect.left &&
			event.clientX <= rect.right &&
			event.clientY >= rect.top &&
			event.clientY <= rect.bottom;
		if (!inside) close();
	}

	function choose(item: CommandItem) {
		if (item.disabled) return;
		onselect?.(item);
		close();
	}

	function onKeydown(e: KeyboardEvent) {
		if (!open || !flat.length) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = nextEnabled(activeIndex, 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = nextEnabled(activeIndex, -1);
		} else if (e.key === 'Home') {
			e.preventDefault();
			activeIndex = nextEnabled(-1, 1);
		} else if (e.key === 'End') {
			e.preventDefault();
			activeIndex = nextEnabled(flat.length, -1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const item = flat[activeIndex];
			if (item) choose(item);
		}
	}

	function onInput() {
		activeIndex = Math.max(0, firstEnabledIndex());
		onquery?.(query);
	}
</script>

<dialog
	bind:this={dialogEl}
	class={['command-palette', className]}
	aria-label={dialogLabel}
	onclose={handleDialogClose}
	onclick={handleBackdropClick}
>
	<div
		class="rounded-2xl border-border bg-surface-elevated shadow-2xl w-full overflow-hidden border"
	>
		<div class="gap-2 border-border px-3 flex items-center border-b">
			<svg
				class="h-4 w-4 text-muted shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
				/>
			</svg>
			<input
				bind:value={query}
				placeholder={resolvedPlaceholder}
				class="h-12 text-sm text-primary placeholder:text-muted w-full bg-transparent outline-none"
				autocomplete="off"
				spellcheck="false"
				role="combobox"
				aria-autocomplete="list"
				aria-expanded="true"
				aria-controls={listId}
				aria-activedescendant={activeOptionId}
				oninput={onInput}
				onkeydown={onKeydown}
			/>
			{#if loading}
				<span
					class="h-4 w-4 animate-spin border-border border-t-brand-500 shrink-0 rounded-full border-2"
					aria-hidden="true"
				></span>
			{/if}
			<Kbd keys={['Esc']} size="sm" />
		</div>

		<div bind:this={listEl} id={listId} class="max-h-80 p-2 overflow-y-auto" role="listbox">
			{#if flat.length === 0}
				<p class="px-3 py-6 text-sm text-muted text-center">{resolvedEmpty}</p>
			{:else}
				{#each groups as [groupName, groupItems] (groupName)}
					<p class="px-2 py-1.5 font-semibold tracking-wide text-muted text-[11px] uppercase">
						{groupName}
					</p>
					<ul class="mb-2 gap-0.5 flex flex-col">
						{#each groupItems as { item, index } (item.id)}
							{@const Icon = item.icon}
							{@const active = index === activeIndex}
							<li>
								<button
									id={optionId(item.id)}
									type="button"
									role="option"
									tabindex="-1"
									aria-selected={active}
									disabled={item.disabled}
									onclick={() => choose(item)}
									onmouseenter={() => {
										if (!item.disabled) activeIndex = index;
									}}
									{@attach active ? keepVisible : undefined}
									class={[
										'gap-3 rounded-xl px-3 py-2 text-sm flex w-full items-center justify-between text-left transition-colors',
										active
											? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
											: 'text-primary hover:bg-surface-overlay',
										item.disabled && 'cursor-not-allowed opacity-40'
									]}
								>
									<span class="gap-3 min-w-0 flex flex-1 items-center">
										{#if showIconColumn}
											<span
												class={[
													'h-8 w-8 rounded-lg flex shrink-0 items-center justify-center',
													active
														? 'bg-brand-100/80 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
														: 'bg-surface-overlay text-muted'
												]}
												aria-hidden="true"
											>
												{#if Icon}
													<Icon size={16} strokeWidth={2} />
												{/if}
											</span>
										{/if}
										<span class="min-w-0 flex-1">
											<span class="block truncate">{item.label}</span>
											{#if item.subtitle}
												<span class="mt-0.5 text-xs text-muted block truncate">{item.subtitle}</span
												>
											{/if}
										</span>
									</span>
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
</dialog>

<style>
	.command-palette {
		margin: 12vh auto auto;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
		width: calc(100% - 2rem);
		max-width: 36rem;
		overflow: visible;
	}

	.command-palette::backdrop {
		background: oklch(15% 0.02 265 / 0.45);
		backdrop-filter: blur(6px);
	}

	:global(.dark) .command-palette::backdrop {
		background: oklch(0% 0 0 / 0.65);
	}

	.command-palette[open] {
		animation: palette-in 140ms ease-out;
	}

	.command-palette[open]::backdrop {
		animation: palette-backdrop-in 140ms ease-out;
	}

	@keyframes palette-in {
		from {
			opacity: 0;
			transform: translateY(6px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes palette-backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
