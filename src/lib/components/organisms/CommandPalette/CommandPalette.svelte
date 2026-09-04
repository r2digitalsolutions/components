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
		const map = new Map<string, CommandItem[]>();
		for (const item of filtered) {
			const key = item.group || dialogLabel;
			const list = map.get(key) ?? [];
			list.push(item);
			map.set(key, list);
		}
		return [...map.entries()];
	});

	const flat = $derived(filtered);
	const showIconColumn = $derived(flat.some((item) => item.icon));

	$effect(() => {
		if (open) {
			query = '';
			activeIndex = 0;
			untrack(() => onquery?.(''));
		}
	});

	function focusInput(node: HTMLInputElement) {
		queueMicrotask(() => node.focus());
	}

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
			activeIndex = Math.min(Math.max(flat.length - 1, 0), activeIndex + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = Math.max(0, activeIndex - 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const item = flat[activeIndex];
			if (item) choose(item);
		}
	}

	function onInput() {
		activeIndex = 0;
		onquery?.(query);
	}
</script>

{#if open}
	<button
		type="button"
		class="inset-0 bg-black/60 p-0 dark:bg-black/70 backdrop-blur-sm fixed z-50 border-0"
		aria-label={i18n.t('close')}
		onclick={close}
	></button>

	<div
		class="px-4 inset-0 pointer-events-none fixed z-[51] flex items-start justify-center pt-[12vh]"
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={dialogLabel}
			tabindex="-1"
			class={[
				'max-w-xl rounded-2xl border-border bg-surface-elevated shadow-2xl pointer-events-auto w-full overflow-hidden border',
				className
			]}
			onkeydown={onKeydown}
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
					{@attach focusInput}
					placeholder={resolvedPlaceholder}
					class="h-12 text-sm text-primary placeholder:text-muted w-full bg-transparent outline-none"
					autocomplete="off"
					spellcheck="false"
					aria-autocomplete="list"
					oninput={onInput}
				/>
				{#if loading}
					<span
						class="h-4 w-4 animate-spin border-border border-t-brand-500 shrink-0 rounded-full border-2"
						aria-hidden="true"
					></span>
				{/if}
				<Kbd keys={['Esc']} size="sm" />
			</div>

			<div class="max-h-80 p-2 overflow-y-auto">
				{#if flat.length === 0}
					<p class="px-3 py-6 text-sm text-muted text-center">{resolvedEmpty}</p>
				{:else}
					{#each groups as [groupName, groupItems] (groupName)}
						<p class="px-2 py-1.5 font-semibold tracking-wide text-muted text-[11px] uppercase">
							{groupName}
						</p>
						<ul class="mb-2 gap-0.5 flex flex-col">
							{#each groupItems as item (item.id)}
								{@const index = flat.findIndex((f) => f.id === item.id)}
								{@const Icon = item.icon}
								<li>
									<button
										type="button"
										disabled={item.disabled}
										onclick={() => choose(item)}
										onmouseenter={() => (activeIndex = index)}
										class={[
											'gap-3 rounded-xl px-3 py-2 text-sm flex w-full items-center justify-between text-left transition-colors',
											index === activeIndex
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
														index === activeIndex
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
													<span class="mt-0.5 text-xs text-muted block truncate"
														>{item.subtitle}</span
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
	</div>
{/if}
