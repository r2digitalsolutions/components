<script lang="ts">
	import type { Snippet } from 'svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';

	export interface SidebarItem {
		id: string;
		label: string;
		href?: string;
		disabled?: boolean;
	}

	export interface SidebarGroup {
		id: string;
		label?: string;
		items: SidebarItem[];
	}

	interface SidebarProps {
		brand?: string;
		groups?: SidebarGroup[];
		value?: string;
		collapsed?: boolean;
		class?: string;
		footer?: Snippet;
		onchange?: (id: string) => void;
	}

	let {
		brand = 'App',
		groups = [],
		value = $bindable(''),
		collapsed = $bindable(false),
		class: className = '',
		footer,
		onchange
	}: SidebarProps = $props();

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}
</script>

<aside
	class={[
		'flex h-full flex-col border-r border-border bg-surface-elevated transition-[width] duration-200',
		collapsed ? 'w-[4.25rem]' : 'w-60',
		className
	]}
>
	<div class="flex items-center justify-between gap-2 px-3 py-4">
		{#if !collapsed}
			<span class="truncate text-sm font-semibold text-primary">{brand}</span>
		{/if}
		<button
			type="button"
			onclick={() => (collapsed = !collapsed)}
			class="rounded-lg p-2 text-secondary hover:bg-surface-overlay hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
			aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				{#if collapsed}
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h10M4 18h16" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				{/if}
			</svg>
		</button>
	</div>

	<nav class="flex-1 overflow-y-auto px-2 pb-3">
		{#each groups as group, gi (group.id)}
			{#if group.label && !collapsed}
				<p class="mb-1 mt-3 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
					{group.label}
				</p>
			{:else if gi > 0}
				<div class="my-2 px-2"><Divider /></div>
			{/if}
			<ul class="flex flex-col gap-0.5">
				{#each group.items as item (item.id)}
					<li>
						<button
							type="button"
							disabled={item.disabled}
							onclick={() => select(item.id, item.disabled)}
							title={collapsed ? item.label : undefined}
							class={[
								'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
								value === item.id
									? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
									: 'text-secondary hover:bg-surface-overlay hover:text-primary',
								item.disabled && 'cursor-not-allowed opacity-40',
								collapsed && 'justify-center'
							]}
						>
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-overlay text-[11px] font-semibold"
							>
								{item.label.slice(0, 1)}
							</span>
							{#if !collapsed}
								<span class="truncate">{item.label}</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{/each}
	</nav>

	{#if footer}
		<div class={['border-t border-border p-3', collapsed && 'flex justify-center']}>
			{@render footer()}
		</div>
	{/if}
</aside>
