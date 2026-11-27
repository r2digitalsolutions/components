<script lang="ts">
	import { tick } from 'svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import VerifiedBadge from '$lib/components/atoms/VerifiedBadge/VerifiedBadge.svelte';
	import { createId } from '$lib/utils/id.js';
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import Plus from '@lucide/svelte/icons/plus';
	import Search from '@lucide/svelte/icons/search';
	import Building2 from '@lucide/svelte/icons/building-2';

	export type OrgStatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

	export interface OrgItem {
		id: string;
		name: string;
		plan?: string;
		initials?: string;
		/** Soft accent for the avatar tile */
		tone?: 'brand' | 'sky' | 'emerald' | 'amber' | 'rose';
		/** Logo/avatar image; falls back to initials. */
		src?: string;
		/** Second line (role, category…). Replaces the «plan» line when set. */
		subtitle?: string;
		/** Small state at the end of the second line (e.g. «Pública», «Privada») with a coloured dot. */
		status?: { label: string; tone?: OrgStatusTone };
		/** Pending count shown at the end of the row. Hidden when 0. */
		badge?: string | number;
		/** Verified organization: seal on the avatar corner and next to the name. */
		verified?: boolean;
		/** Extra words the search matches (city, category, slug…). */
		keywords?: string;
	}

	interface OrgSwitcherProps {
		orgs?: OrgItem[];
		value?: string;
		/** Compact trigger for sidebars */
		compact?: boolean;
		/** Small heading above the list. */
		title?: string;
		/** Label of the create row (shown when `oncreate` is set). */
		createLabel?: string;
		/** Small note under the create row (e.g. «Linked to your account»). */
		footerNote?: string;
		/** Accessible name of the verified seal. */
		verifiedLabel?: string;
		/** Show the search box when there are more than this many orgs. 0 = always, `Infinity` = never. */
		searchThreshold?: number;
		searchPlaceholder?: string;
		/** Shown when the search finds nothing. */
		emptyLabel?: string;
		/** Keep the current org first in the list. */
		pinCurrent?: boolean;
		class?: string;
		onchange?: (id: string) => void;
		oncreate?: () => void;
	}

	const TONE: Record<NonNullable<OrgItem['tone']>, string> = {
		brand: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
		sky: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
		emerald: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
		amber: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
		rose: 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
	};

	const DOT: Record<OrgStatusTone, string> = {
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500',
		info: 'bg-sky-500',
		neutral: 'bg-zinc-400 dark:bg-zinc-500'
	};

	let {
		orgs = [
			{ id: 'acme', name: 'Acme Corp', plan: 'Pro', tone: 'brand' },
			{ id: 'north', name: 'Northwind', plan: 'Starter', tone: 'sky' },
			{ id: 'globex', name: 'Globex Labs', plan: 'Team', tone: 'emerald' }
		],
		value = $bindable('acme'),
		compact = false,
		title,
		createLabel = 'Create organization',
		footerNote,
		verifiedLabel = 'Verified',
		searchThreshold = 5,
		searchPlaceholder = 'Search…',
		emptyLabel = 'No results',
		pinCurrent = true,
		class: className = '',
		onchange,
		oncreate
	}: OrgSwitcherProps = $props();

	let open = $state(false);
	let query = $state('');
	let active = $state(0);
	let rootEl: HTMLDivElement | undefined = $state();
	let triggerEl: HTMLButtonElement | undefined = $state();
	let panelEl: HTMLDivElement | undefined = $state();
	let listEl: HTMLUListElement | undefined = $state();

	let uid = $state('');
	$effect(() => {
		if (!uid) uid = createId('org');
	});

	const current = $derived(orgs.find((o) => o.id === value) ?? orgs[0]);
	const searchable = $derived(orgs.length > searchThreshold);

	const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

	const ordered = $derived(
		pinCurrent && current ? [current, ...orgs.filter((o) => o.id !== current.id)] : orgs
	);

	const results = $derived.by(() => {
		const q = fold(query);
		if (!q) return ordered;
		const words = q.split(/\s+/);
		const scored = ordered
			.map((o) => {
				const name = fold(o.name);
				const hay = fold(
					[o.name, o.subtitle, o.status?.label, o.plan, o.keywords].filter(Boolean).join(' ')
				);
				if (!words.every((w) => hay.includes(w))) return null;
				// Names that start with the query first, then names that contain it, then the rest.
				const score = name.startsWith(q) ? 0 : name.includes(q) ? 1 : 2;
				return { o, score };
			})
			.filter((x): x is { o: OrgItem; score: number } => x !== null);
		return scored.sort((a, b) => a.score - b.score).map((x) => x.o);
	});

	const optionId = (i: number) => `${uid}-opt-${i}`;
	const initialsOf = (o: OrgItem) => o.initials ?? o.name.slice(0, 2).toUpperCase();
	const hasBadge = (o: OrgItem) =>
		o.badge !== undefined && o.badge !== '' && o.badge !== 0 && o.id !== value;

	// A new search starts at the first match.
	let lastQuery = '';
	$effect(() => {
		if (query !== lastQuery) {
			lastQuery = query;
			active = 0;
		}
	});

	async function show() {
		query = lastQuery = '';
		open = true;
		active = Math.max(
			0,
			results.findIndex((o) => o.id === value)
		);
		await tick();
		const input = panelEl?.querySelector('input');
		if (input) input.focus();
		else panelEl?.focus();
		scrollActive();
	}

	function close(refocus = false) {
		open = false;
		if (refocus) triggerEl?.focus();
	}

	function select(id: string) {
		value = id;
		onchange?.(id);
		close(true);
	}

	function scrollActive() {
		listEl?.querySelector(`#${CSS.escape(optionId(active))}`)?.scrollIntoView({ block: 'nearest' });
	}

	function move(to: number) {
		if (!results.length) return;
		active = (to + results.length) % results.length;
		tick().then(scrollActive);
	}

	function onPanelKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				move(active + 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				move(active - 1);
				break;
			case 'Home':
				if (!searchable || !query) {
					e.preventDefault();
					move(0);
				}
				break;
			case 'End':
				if (!searchable || !query) {
					e.preventDefault();
					move(results.length - 1);
				}
				break;
			case 'Enter': {
				const org = results[active];
				if (org) {
					e.preventDefault();
					select(org.id);
				}
				break;
			}
			case 'Escape':
				e.preventDefault();
				e.stopPropagation();
				close(true);
				break;
			case 'Tab':
				close();
				break;
		}
	}

	function onTriggerKeydown(e: KeyboardEvent) {
		if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
			e.preventDefault();
			show();
		}
	}

	function onDocClick(e: MouseEvent) {
		if (!open || !rootEl) return;
		if (!rootEl.contains(e.target as Node)) open = false;
	}
</script>

<svelte:document onclick={onDocClick} />

{#snippet cornerSeal()}
	<span
		class="-right-1.5 -bottom-1.5 bg-surface-elevated absolute flex rounded-full"
		aria-hidden="true"
	>
		<VerifiedBadge size="xs" />
	</span>
{/snippet}

{#snippet searchIcon()}
	<Search class="h-4 w-4" strokeWidth={2} />
{/snippet}

<div class={['relative', className]} bind:this={rootEl}>
	<button
		type="button"
		bind:this={triggerEl}
		aria-haspopup="listbox"
		aria-expanded={open}
		title={current?.name}
		onclick={() => (open ? close() : show())}
		onkeydown={onTriggerKeydown}
		class={[
			'gap-2 rounded-xl border-border bg-surface-elevated flex w-full items-center border text-left transition-colors',
			'hover:border-border-strong focus-visible:ring-brand-500/30 focus-visible:ring-2 focus-visible:outline-none',
			compact ? 'px-2 py-1.5' : 'px-3 py-2'
		]}
	>
		<span
			class={[
				'rounded-lg text-xs font-bold relative flex shrink-0 items-center justify-center',
				compact ? 'h-7 w-7' : 'h-8 w-8',
				TONE[current?.tone ?? 'brand']
			]}
		>
			{#if current?.src}<img
					src={current.src}
					alt=""
					class="rounded-lg h-full w-full object-cover"
				/>{:else}{current ? initialsOf(current) : '?'}{/if}
			{#if current?.verified}{@render cornerSeal()}{/if}
		</span>
		{#if !compact}
			<span class="min-w-0 flex-1">
				<span class="gap-1 flex items-center">
					<span class="text-sm font-semibold text-primary truncate">{current?.name}</span>
					{#if current?.verified}<VerifiedBadge size="xs" title={verifiedLabel} />{/if}
				</span>
				{#if current?.subtitle}
					<span class="text-muted block truncate text-[11px]">{current.subtitle}</span>
				{:else if current?.plan}
					<span class="text-muted block truncate text-[11px]">{current.plan} plan</span>
				{/if}
			</span>
		{:else}
			<span class="min-w-0 text-sm font-medium text-primary flex-1 truncate">{current?.name}</span>
		{/if}
		<ChevronsUpDown class="h-4 w-4 text-muted shrink-0" strokeWidth={2} />
	</button>

	{#if open}
		<div
			bind:this={panelEl}
			tabindex="-1"
			onkeydown={onPanelKeydown}
			role="dialog"
			aria-label={title ?? 'Organizations'}
			class="left-0 mt-1.5 rounded-xl border-border bg-surface-elevated shadow-lg absolute z-50 flex w-[19rem] max-w-[calc(100vw-1rem)] min-w-full flex-col overflow-hidden border outline-none"
		>
			{#if title}
				<p
					class="px-3 pb-1 pt-2.5 font-semibold tracking-wider text-muted gap-1.5 flex items-center text-[11px] uppercase"
				>
					{title}
					{#if orgs.length > 1}<span class="font-medium normal-case tabular-nums opacity-80"
							>· {orgs.length}</span
						>{/if}
				</p>
			{/if}
			{#if searchable}
				<div class="px-2 pb-1 pt-1.5">
					<Input
						type="search"
						size="sm"
						clearable
						autocomplete="off"
						placeholder={searchPlaceholder}
						bind:value={query}
						leadIcon={searchIcon}
					/>
				</div>
			{/if}
			<ul
				bind:this={listEl}
				role="listbox"
				aria-label={title ?? 'Organizations'}
				tabindex="-1"
				aria-activedescendant={results.length ? optionId(active) : undefined}
				class="p-1 max-h-[min(22rem,55dvh)] overflow-y-auto overscroll-contain"
			>
				{#each results as org, i (org.id)}
					<!-- Keys are handled by the panel (arrows + Enter), like a combobox. -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<li
						id={optionId(i)}
						role="option"
						aria-selected={org.id === value}
						title={org.name}
						onclick={() => select(org.id)}
						onmousemove={() => (active = i)}
						class={[
							'gap-2.5 rounded-lg px-2 py-2 flex w-full cursor-pointer items-center text-left transition-colors',
							i === active ? 'bg-surface-overlay' : org.id === value ? 'bg-brand-500/10' : '',
							i === active && org.id === value && 'bg-brand-500/15'
						]}
					>
						<span
							class={[
								'h-8 w-8 rounded-lg text-xs font-bold relative flex shrink-0 items-center justify-center',
								TONE[org.tone ?? 'brand']
							]}
						>
							{#if org.src}<img
									src={org.src}
									alt=""
									class="rounded-lg h-full w-full object-cover"
								/>{:else}{initialsOf(org)}{/if}
							{#if org.verified}{@render cornerSeal()}{/if}
						</span>
						<span class="min-w-0 flex-1">
							<span class="gap-1 flex items-center">
								<span class="text-sm font-medium text-primary truncate">{org.name}</span>
								{#if org.verified}<VerifiedBadge size="xs" title={verifiedLabel} />{/if}
							</span>
							{#if org.subtitle || org.status}
								<span class="text-muted gap-1 flex items-center text-[11px]">
									{#if org.subtitle}<span class="min-w-0 truncate">{org.subtitle}</span>{/if}
									{#if org.status}
										<span class="gap-1 inline-flex shrink-0 items-center">
											{#if org.subtitle}<span aria-hidden="true">·</span>{/if}
											<span
												class={['h-1.5 w-1.5 rounded-full', DOT[org.status.tone ?? 'neutral']]}
												aria-hidden="true"
											></span>
											{org.status.label}
										</span>
									{/if}
								</span>
							{/if}
						</span>
						{#if org.plan}
							<Badge size="sm" variant="secondary">{org.plan}</Badge>
						{/if}
						{#if hasBadge(org)}
							<span
								class="h-5 min-w-5 bg-brand-600 px-1.5 font-bold text-white flex shrink-0 items-center justify-center rounded-full text-[11px]"
								>{org.badge}</span
							>
						{/if}
						{#if org.id === value}
							<Check
								class="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0"
								strokeWidth={2.5}
							/>
						{:else}
							<span class="h-4 w-4 shrink-0" aria-hidden="true"></span>
						{/if}
					</li>
				{:else}
					<li class="px-3 py-6 text-sm text-muted text-center" role="presentation">
						{emptyLabel}
					</li>
				{/each}
			</ul>
			{#if oncreate}
				<div class="border-border p-1 border-t">
					<button
						type="button"
						onclick={() => {
							close();
							oncreate?.();
						}}
						class="gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-secondary hover:bg-surface-overlay focus-visible:bg-surface-overlay flex w-full items-center transition-colors focus-visible:outline-none"
					>
						<span
							class="h-8 w-8 rounded-lg border-border text-muted flex shrink-0 items-center justify-center border border-dashed"
						>
							<Plus class="h-4 w-4" strokeWidth={2} />
						</span>
						{createLabel}
					</button>
					{#if footerNote}
						<p class="px-2 pb-1.5 pt-1 text-muted text-[11px]">{footerNote}</p>
					{/if}
				</div>
			{:else}
				<div class="border-border px-3 py-2 border-t">
					<p class="gap-1.5 text-muted inline-flex items-center text-[11px]">
						<Building2 class="h-3 w-3" strokeWidth={2} />
						{orgs.length} workspaces
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
