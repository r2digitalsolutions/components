<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
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
	}

	interface OrgSwitcherProps {
		orgs?: OrgItem[];
		value?: string;
		/** Compact trigger for sidebars */
		compact?: boolean;
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

<div class={['relative', className]} bind:this={rootEl}>
	<button
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={() => (open = !open)}
		class={[
			'flex w-full items-center gap-2 rounded-xl border border-border bg-surface-elevated text-left transition-colors',
			'hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			compact ? 'px-2 py-1.5' : 'px-3 py-2'
		]}
	>
		<span
			class={[
				'flex shrink-0 items-center justify-center rounded-lg text-xs font-bold',
				compact ? 'h-7 w-7' : 'h-8 w-8',
				TONE[current?.tone ?? 'brand']
			]}
		>
			{current?.initials ?? (current?.name ?? '?').slice(0, 2).toUpperCase()}
		</span>
		{#if !compact}
			<span class="min-w-0 flex-1">
				<span class="block truncate text-sm font-semibold text-primary">{current?.name}</span>
				{#if current?.plan}
					<span class="block truncate text-[11px] text-muted">{current.plan} plan</span>
				{/if}
			</span>
		{:else}
			<span class="min-w-0 flex-1 truncate text-sm font-medium text-primary">{current?.name}</span>
		{/if}
		<ChevronsUpDown class="h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
	</button>

	{#if open}
		<div
			role="listbox"
			aria-label="Organizations"
			class="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-lg"
		>
			<ul class="max-h-64 overflow-y-auto p-1">
				{#each orgs as org (org.id)}
					<li>
						<button
							type="button"
							role="option"
							aria-selected={org.id === value}
							onclick={() => select(org.id)}
							class={[
								'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors',
								org.id === value ? 'bg-brand-500/10' : 'hover:bg-surface-overlay'
							]}
						>
							<span
								class={[
									'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
									TONE[org.tone ?? 'brand']
								]}
							>
								{org.initials ?? org.name.slice(0, 2).toUpperCase()}
							</span>
							<span class="min-w-0 flex-1">
								<span class="flex items-center gap-2">
									<span class="truncate text-sm font-medium text-primary">{org.name}</span>
									{#if org.plan}
										<Badge size="sm" variant="secondary">{org.plan}</Badge>
									{/if}
								</span>
							</span>
							{#if org.id === value}
								<Check class="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" strokeWidth={2.5} />
							{/if}
						</button>
					</li>
				{/each}
			</ul>
			{#if oncreate}
				<div class="border-t border-border p-1">
					<button
						type="button"
						onclick={() => {
							open = false;
							oncreate?.();
						}}
						class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-secondary transition-colors hover:bg-surface-overlay"
					>
						<span
							class="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-border text-muted"
						>
							<Plus class="h-4 w-4" strokeWidth={2} />
						</span>
						Create organization
					</button>
				</div>
			{:else}
				<div class="border-t border-border px-3 py-2">
					<p class="inline-flex items-center gap-1.5 text-[11px] text-muted">
						<Building2 class="h-3 w-3" strokeWidth={2} />
						{orgs.length} workspaces
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
