<script lang="ts">
	import PanelHeader from './PanelHeader.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Layers from '@lucide/svelte/icons/layers';
	import Box from '@lucide/svelte/icons/box';
	import Settings from '@lucide/svelte/icons/settings';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Plus from '@lucide/svelte/icons/plus';
	import Pin from '@lucide/svelte/icons/pin';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';

	let {
		example = 'gallery',
		variant = 'subtle',
		size = 'sm',
		collapsible = true
	}: {
		example?: 'gallery' | 'dock' | 'variants';
		variant?: 'subtle' | 'solid' | 'ghost';
		size?: 'sm' | 'md';
		collapsible?: boolean;
	} = $props();

	let collapsed = $state(false);
	let outlinerCollapsed = $state(false);
	let subtleCollapsed = $state(false);
	let solidCollapsed = $state(false);
	let ghostCollapsed = $state(false);

	const actionBtn =
		'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted transition-colors hover:bg-surface-elevated hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30';
</script>

<div class="w-full max-w-2xl space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Panel header</p>
		<p class="text-xs text-secondary">
			Clic en la barra para colapsar. Los iconos de acción son compactos (20px).
		</p>
	</div>

	{#if example === 'gallery'}
		<div class="space-y-3">
			<div class="overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm">
				<PanelHeader
					title="Outliner"
					description="Scene hierarchy"
					{variant}
					{size}
					{collapsible}
					bind:collapsed={outlinerCollapsed}
				>
					{#snippet icon()}
						<Layers class="h-3 w-3" strokeWidth={2} />
					{/snippet}
					{#snippet actions()}
						<button type="button" class={actionBtn} aria-label="Add">
							<Plus class="h-3 w-3" strokeWidth={2} />
						</button>
						<button type="button" class={actionBtn} aria-label="More">
							<MoreHorizontal class="h-3 w-3" strokeWidth={2} />
						</button>
					{/snippet}
				</PanelHeader>
				{#if !outlinerCollapsed}
					<ul class="space-y-0.5 p-2 text-xs text-secondary">
						<li
							class="rounded-md bg-brand-50 px-2 py-1.5 text-brand-800 dark:bg-brand-950/40 dark:text-brand-200"
						>
							Character_Hero
						</li>
						<li class="rounded-md px-2 py-1.5 hover:bg-surface-overlay">Camera_Main</li>
						<li class="rounded-md px-2 py-1.5 hover:bg-surface-overlay">DirectionalLight</li>
					</ul>
				{/if}
			</div>

			<div class="overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm">
				<PanelHeader title="Details" description="Transform & properties" {variant} size="md">
					{#snippet icon()}
						<Box class="h-3.5 w-3.5" strokeWidth={2} />
					{/snippet}
					{#snippet actions()}
						<Badge size="sm" variant="primary">Live</Badge>
						<button type="button" class={actionBtn} aria-label="Pin">
							<Pin class="h-3 w-3" strokeWidth={2} />
						</button>
						<button type="button" class={actionBtn} aria-label="Refresh">
							<RefreshCw class="h-3 w-3" strokeWidth={2} />
						</button>
					{/snippet}
				</PanelHeader>
				<div class="grid grid-cols-[4.5rem_1fr] gap-2 p-3 text-xs">
					<span class="text-muted">Location</span>
					<span class="rounded-md border border-border bg-surface px-2 py-1 font-mono text-primary"
						>120, 0, -40</span
					>
					<span class="text-muted">Rotation</span>
					<span class="rounded-md border border-border bg-surface px-2 py-1 font-mono text-primary"
						>0, 90, 0</span
					>
				</div>
			</div>
		</div>
	{:else if example === 'dock'}
		<div class="overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm">
			<PanelHeader
				title="Settings"
				{variant}
				{size}
				{collapsible}
				bind:collapsed
			>
				{#snippet icon()}
					<Settings class="h-3 w-3" strokeWidth={2} />
				{/snippet}
				{#snippet actions()}
					<button type="button" class={actionBtn} aria-label="More">
						<MoreHorizontal class="h-3 w-3" strokeWidth={2} />
					</button>
				{/snippet}
			</PanelHeader>
			{#if !collapsed}
				<div class="space-y-2 p-3 text-xs text-secondary">
					<p>Collapsed: {collapsed ? 'yes' : 'no'}</p>
					<p>Click anywhere on the header bar to toggle.</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="space-y-3">
			{#each [
				{ id: 'subtle', collapsed: subtleCollapsed, set: (v: boolean) => (subtleCollapsed = v) },
				{ id: 'solid', collapsed: solidCollapsed, set: (v: boolean) => (solidCollapsed = v) },
				{ id: 'ghost', collapsed: ghostCollapsed, set: (v: boolean) => (ghostCollapsed = v) }
			] as item}
				<div
					class={[
						'overflow-hidden rounded-xl border border-border',
						item.id === 'ghost' ? 'bg-surface' : 'bg-surface-elevated'
					]}
				>
					<PanelHeader
						title={`Variant · ${item.id}`}
						description="Click header to collapse"
						variant={item.id as 'subtle' | 'solid' | 'ghost'}
						size="sm"
						collapsible
						collapsed={item.collapsed}
						ontoggle={item.set}
					>
						{#snippet icon()}
							<Layers class="h-3 w-3" strokeWidth={2} />
						{/snippet}
						{#snippet actions()}
							<button type="button" class={actionBtn} aria-label="Add">
								<Plus class="h-3 w-3" strokeWidth={2} />
							</button>
						{/snippet}
					</PanelHeader>
					{#if !item.collapsed}
						<div class="px-3 py-2 text-[11px] text-muted">Body under a {item.id} header</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
