<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import VerifiedBadge from '$lib/components/atoms/VerifiedBadge/VerifiedBadge.svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import Plus from '@lucide/svelte/icons/plus';
	import Building2 from '@lucide/svelte/icons/building-2';

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
		/** Pending count shown at the end of the row. Hidden when 0. */
		badge?: string | number;
		/** Verified organization: seal on the avatar corner and next to the name. */
		verified?: boolean;
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
		class: className = '',
		onchange,
		oncreate
	}: OrgSwitcherProps = $props();

	let open = $state(false);
	let rootEl: HTMLDivElement | undefined = $state();

	const current = $derived(orgs.find((o) => o.id === value) ?? orgs[0]);

	function select(id: string) {
		value = id;
		onchange?.(id);
		open = false;
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

<div class={['relative', className]} bind:this={rootEl}>
	<button
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={() => (open = !open)}
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
				/>{:else}{current?.initials ?? (current?.name ?? '?').slice(0, 2).toUpperCase()}{/if}
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
			role="listbox"
			aria-label="Organizations"
			class="left-0 right-0 mt-1.5 rounded-xl border-border bg-surface-elevated shadow-lg absolute z-50 overflow-hidden border"
		>
			{#if title}
				<p class="px-3 pb-1 pt-2.5 font-semibold tracking-wider text-muted text-[11px] uppercase">
					{title}
				</p>
			{/if}
			<ul class="max-h-64 p-1 overflow-y-auto">
				{#each orgs as org (org.id)}
					<li>
						<button
							type="button"
							role="option"
							aria-selected={org.id === value}
							onclick={() => select(org.id)}
							class={[
								'gap-2 rounded-lg px-2 py-2 flex w-full items-center text-left transition-colors',
								org.id === value ? 'bg-brand-500/10' : 'hover:bg-surface-overlay'
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
									/>{:else}{org.initials ?? org.name.slice(0, 2).toUpperCase()}{/if}
								{#if org.verified}{@render cornerSeal()}{/if}
							</span>
							<span class="min-w-0 flex-1">
								<span class="gap-2 flex items-center">
									<span class="text-sm font-medium text-primary truncate">{org.name}</span>
									{#if org.verified}<VerifiedBadge size="xs" title={verifiedLabel} />{/if}
									{#if org.plan}
										<Badge size="sm" variant="secondary">{org.plan}</Badge>
									{/if}
								</span>
								{#if org.subtitle}
									<span class="text-muted block truncate text-[11px]">{org.subtitle}</span>
								{/if}
							</span>
							{#if org.badge !== undefined && org.badge !== '' && org.badge !== 0 && org.id !== value}
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
							{/if}
						</button>
					</li>
				{/each}
			</ul>
			{#if oncreate}
				<div class="border-border p-1 border-t">
					<button
						type="button"
						onclick={() => {
							open = false;
							oncreate?.();
						}}
						class="gap-2 rounded-lg px-2 py-2 text-sm font-medium text-secondary hover:bg-surface-overlay flex w-full items-center transition-colors"
					>
						<span
							class="h-8 w-8 rounded-lg border-border text-muted flex items-center justify-center border border-dashed"
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
