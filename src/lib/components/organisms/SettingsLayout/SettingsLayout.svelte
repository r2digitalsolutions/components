<script module lang="ts">
	export interface SettingsNavItem {
		id: string;
		label: string;
		description?: string;
		disabled?: boolean;
		href?: string;
	}

	export interface SettingsNavGroup {
		id: string;
		label?: string;
		items: SettingsNavItem[];
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tabs from '$lib/components/molecules/Tabs/Tabs.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface SettingsLayoutProps {
		/** Flat nav list (single implicit group) */
		items?: SettingsNavItem[];
		/** Grouped nav; takes precedence over `items` when non-empty */
		groups?: SettingsNavGroup[];
		value?: string;
		/** Aside / page label */
		title?: string;
		description?: string;
		/** Show content PageHeader for the active section */
		showHeader?: boolean;
		stickyHeader?: boolean;
		class?: string;
		children?: Snippet;
		header?: Snippet;
		actions?: Snippet;
		footer?: Snippet;
		onchange?: (id: string) => void;
	}

	let {
		items = [],
		groups = [],
		value = $bindable(''),
		title = 'Settings',
		description,
		showHeader = true,
		stickyHeader = false,
		class: className = '',
		children,
		header,
		actions: actionsSlot,
		footer,
		onchange
	}: SettingsLayoutProps = $props();

	const resolvedGroups = $derived<SettingsNavGroup[]>(
		groups.length > 0 ? groups : [{ id: 'main', items }]
	);

	const flatItems = $derived(resolvedGroups.flatMap((g) => g.items));

	const active = $derived(
		flatItems.find((i) => i.id === value) ?? flatItems.find((i) => !i.disabled) ?? null
	);

	$effect(() => {
		if (!flatItems.length) return;
		if (value && flatItems.some((i) => i.id === value && !i.disabled)) return;
		const first = flatItems.find((i) => !i.disabled);
		if (first) value = first.id;
	});

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}

	const tabItems = $derived(
		flatItems.map((i) => ({ id: i.id, label: i.label, disabled: i.disabled }))
	);
</script>

{#snippet navButton(item: SettingsNavItem)}
	{#if item.href && !item.disabled}
		<a
			href={item.href}
			aria-current={value === item.id ? 'page' : undefined}
			onclick={() => select(item.id)}
			class={[
				'rounded-lg px-3 py-2 block w-full text-left transition-colors',
				'focus-visible:ring-brand-500/30 focus-visible:ring-2 focus-visible:outline-none',
				value === item.id
					? 'bg-surface-overlay font-medium text-primary'
					: 'text-secondary hover:bg-surface-overlay hover:text-primary'
			]}
		>
			<span class="text-sm font-medium block">{item.label}</span>
			{#if item.description}
				<span class="mt-0.5 text-xs text-muted block">{item.description}</span>
			{/if}
		</a>
	{:else}
		<button
			type="button"
			disabled={item.disabled}
			aria-current={value === item.id ? 'page' : undefined}
			onclick={() => select(item.id, item.disabled)}
			class={[
				'rounded-lg px-3 py-2 w-full text-left transition-colors',
				'focus-visible:ring-brand-500/30 focus-visible:ring-2 focus-visible:outline-none',
				value === item.id
					? 'bg-surface-overlay font-medium text-primary'
					: 'text-secondary hover:bg-surface-overlay hover:text-primary',
				item.disabled && 'cursor-not-allowed opacity-40'
			]}
		>
			<span class="text-sm font-medium block">{item.label}</span>
			{#if item.description}
				<span class="mt-0.5 text-xs text-muted block">{item.description}</span>
			{/if}
		</button>
	{/if}
{/snippet}

<div
	class={[
		'rounded-2xl border-border bg-surface-elevated lg:min-h-112 lg:flex-row flex w-full flex-col overflow-hidden border',
		className
	]}
>
	<!-- Desktop aside -->
	<aside
		class="w-56 border-border bg-surface lg:flex hidden shrink-0 flex-col border-r"
		aria-label={title}
	>
		<div class="border-border px-4 py-4 border-b">
			<p class="text-sm font-semibold text-primary">{title}</p>
			{#if description}
				<p class="mt-0.5 text-xs text-muted">{description}</p>
			{/if}
		</div>

		<nav class="px-2 py-3 flex-1 overflow-y-auto" aria-label={`${title} sections`}>
			{#each resolvedGroups as group, gi (group.id)}
				{#if group.label}
					<p
						class={[
							'mb-1 px-2 font-semibold tracking-wide text-muted text-[11px] uppercase',
							gi > 0 && 'mt-4'
						]}
					>
						{group.label}
					</p>
				{:else if gi > 0}
					<div class="my-2 border-border border-t" aria-hidden="true"></div>
				{/if}
				<ul class="gap-0.5 flex flex-col">
					{#each group.items as item (item.id)}
						<li>{@render navButton(item)}</li>
					{/each}
				</ul>
			{/each}
		</nav>

		{#if footer}
			<div class="border-border p-3 mt-auto border-t">
				{@render footer()}
			</div>
		{/if}
	</aside>

	<!-- Main panel -->
	<section class="min-w-0 flex flex-1 flex-col">
		<!-- Mobile top bar -->
		<div class="space-y-3 border-border px-4 py-3 lg:hidden border-b">
			<div>
				<p class="text-sm font-semibold text-primary">{title}</p>
				{#if description}
					<p class="text-xs text-muted">{description}</p>
				{/if}
			</div>
			<Tabs items={tabItems} bind:value variant="underline" onchange={(id) => onchange?.(id)} />
		</div>

		{#if showHeader || header}
			<div
				class={[
					'border-border px-4 py-4 sm:px-6 border-b',
					stickyHeader && 'top-0 bg-surface-elevated/95 backdrop-blur sticky z-10'
				]}
			>
				{#if header}
					{@render header()}
				{:else if showHeader && active}
					<div class="gap-3 sm:flex-row sm:items-start sm:justify-between flex flex-col">
						<div class="min-w-0 space-y-1">
							<Heading level={2} size="lg">{active.label}</Heading>
							{#if active.description}
								<Text size="sm" tone="muted">{active.description}</Text>
							{/if}
						</div>
						{#if actionsSlot}
							<div class="gap-2 flex shrink-0 flex-wrap items-center">
								{@render actionsSlot()}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}

		<div class="min-w-0 px-4 py-5 sm:px-6 sm:py-6 flex-1">
			{#if children}{@render children()}{/if}
		</div>
	</section>
</div>
