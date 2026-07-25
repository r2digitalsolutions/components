<script lang="ts">
	import Panel from './Panel.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Plus from '@lucide/svelte/icons/plus';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import Pin from '@lucide/svelte/icons/pin';
	import Layers from '@lucide/svelte/icons/layers';
	import Box from '@lucide/svelte/icons/box';

	let {
		example = 'dock',
		padding = 'sm',
		chrome = true,
		fill = true,
		collapsible = true
	}: {
		example?: 'dock' | 'actions' | 'variants' | 'stack';
		padding?: 'none' | 'sm' | 'md';
		chrome?: boolean;
		fill?: boolean;
		collapsible?: boolean;
	} = $props();

	let collapsed = $state(false);
	let sceneCollapsed = $state(false);
	let detailsCollapsed = $state(false);

	const sceneItems = [
		'DirectionalLight',
		'Camera_Main',
		'Floor_01',
		'Character_Hero',
		'Particle_Dust',
		'PostProcess_Volume',
		'Audio_Ambient',
		'Trigger_Zone_A'
	];
</script>

<div class="w-full space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Panel</p>
		<p class="text-xs text-secondary">
			Chrome, padding, fill, colapsable y actions para docks de editor.
		</p>
	</div>

	{#if example === 'dock'}
		<div class="flex h-96 w-full flex-col overflow-hidden rounded-xl border border-border shadow-sm">
			<div class={collapsed ? 'shrink-0' : 'min-h-0 flex-1'}>
				<Panel
					title="Outliner"
					description="Scene hierarchy"
					{collapsible}
					bind:collapsed
					{padding}
					{chrome}
					{fill}
				>
					{#snippet icon()}
						<Layers class="h-3.5 w-3.5" strokeWidth={2} />
					{/snippet}
					{#snippet actions()}
						<button
							type="button"
							class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted hover:bg-surface-elevated hover:text-primary"
							aria-label="Add item"
						>
							<Plus class="h-3 w-3" strokeWidth={2} />
						</button>
						<button
							type="button"
							class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted hover:bg-surface-elevated hover:text-primary"
							aria-label="More"
						>
							<MoreHorizontal class="h-3 w-3" strokeWidth={2} />
						</button>
					{/snippet}
					<ul class="space-y-0.5">
						{#each sceneItems as item, i}
							<li
								class={[
									'flex items-center justify-between rounded-md px-2 py-1.5 text-xs',
									i === 3
										? 'bg-brand-50 text-brand-800 dark:bg-brand-950/40 dark:text-brand-200'
										: 'text-secondary hover:bg-surface-overlay'
								]}
							>
								<span>{item}</span>
								{#if i === 3}
									<Badge size="sm" variant="primary">Active</Badge>
								{/if}
							</li>
						{/each}
					</ul>
				</Panel>
			</div>
			<div class="min-h-0 flex-1 border-t border-border">
				<Panel title="Details" description="Selected actor" chrome={false} padding="md" collapsible={false}>
					{#snippet icon()}
						<Box class="h-3.5 w-3.5" strokeWidth={2} />
					{/snippet}
					<div class="space-y-2 text-xs text-secondary">
						<p>When Outliner collapses, it shrinks to the header and Details takes the remaining space.</p>
						<p class="font-mono text-primary">Collapsed: {collapsed ? 'yes' : 'no'}</p>
					</div>
				</Panel>
			</div>
		</div>
	{:else if example === 'actions'}
		<div class="h-72 overflow-hidden rounded-xl border border-border">
			<Panel title="Details" description="Transform & properties" collapsible={false} padding="md" headerSize="md">
				{#snippet icon()}
					<Box class="h-3.5 w-3.5" strokeWidth={2} />
				{/snippet}
				{#snippet actions()}
					<button
						type="button"
						class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted hover:bg-surface-elevated hover:text-primary"
						aria-label="Pin"
					>
						<Pin class="h-3 w-3" strokeWidth={2} />
					</button>
					<button
						type="button"
						class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted hover:bg-surface-elevated hover:text-primary"
						aria-label="Refresh"
					>
						<RefreshCw class="h-3 w-3" strokeWidth={2} />
					</button>
					<button
						type="button"
						class="h-5 rounded px-1.5 text-[11px] font-medium text-muted hover:bg-surface-elevated hover:text-primary"
					>
						Reset
					</button>
				{/snippet}
				<div class="space-y-3">
					<div class="grid grid-cols-[5rem_1fr] items-center gap-2 text-xs">
						<span class="text-muted">Name</span>
						<span class="rounded-md border border-border bg-surface px-2 py-1.5 text-primary"
							>Character_Hero</span
						>
						<span class="text-muted">Location</span>
						<span class="rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-primary"
							>120, 0, -40</span
						>
						<span class="text-muted">Rotation</span>
						<span class="rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-primary"
							>0, 90, 0</span
						>
						<span class="text-muted">Scale</span>
						<span class="rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-primary"
							>1, 1, 1</span
						>
					</div>
					<p class="text-xs leading-relaxed text-secondary">
						Use the header actions for pin, refresh, or reset without leaving the inspector.
					</p>
				</div>
			</Panel>
		</div>
	{:else if example === 'variants'}
		<div class="grid w-full gap-4 sm:grid-cols-2">
			<div class="min-h-64 overflow-hidden rounded-xl">
				<Panel title="With chrome" description="Default elevated shell" chrome padding="sm" fill>
					{#snippet icon()}
						<Layers class="h-3.5 w-3.5" strokeWidth={2} />
					{/snippet}
					<ul class="space-y-0.5">
						{#each sceneItems.slice(0, 6) as item, i}
							<li
								class={[
									'rounded-md px-2 py-1.5 text-xs',
									i === 0 ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/40 dark:text-brand-200' : 'text-secondary hover:bg-surface-overlay'
								]}
							>
								{item}
							</li>
						{/each}
					</ul>
				</Panel>
			</div>

			<div class="min-h-64 overflow-hidden rounded-xl border border-dashed border-border bg-surface p-1.5">
				<Panel title="No chrome" description="Host owns the shell" chrome={false} padding="sm" fill class="rounded-lg">
					{#snippet icon()}
						<Box class="h-3.5 w-3.5" strokeWidth={2} />
					{/snippet}
					<ul class="space-y-0.5">
						{#each sceneItems.slice(2, 8) as item}
							<li class="rounded-md px-2 py-1.5 text-xs text-secondary hover:bg-surface-overlay">{item}</li>
						{/each}
					</ul>
				</Panel>
			</div>

			<div class="min-h-64 overflow-hidden rounded-xl border border-border">
				<Panel title="Padding md" description="Roomier inspector" padding="md" fill>
					<div class="space-y-2">
						{#each [['Visibility', 'Visible'], ['Mobility', 'Static'], ['Cast shadows', 'Yes']] as [label, value]}
							<div class="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-xs">
								<span class="text-muted">{label}</span>
								<span class="font-medium text-primary">{value}</span>
							</div>
						{/each}
					</div>
				</Panel>
			</div>

			<div class="flex flex-col justify-start gap-2">
				<Panel title="Auto height" description="fill=false" padding="sm" fill={false} collapsible bind:collapsed={detailsCollapsed}>
					<p class="text-xs leading-relaxed text-secondary">
						Sizes to content. Collapse this one — it should shrink to the header only, with no empty shell.
					</p>
					<ul class="mt-2 space-y-1">
						{#each ['Compact for sidebars', 'Good for property groups'] as tip}
							<li class="flex items-center gap-2 text-xs text-secondary">
								<span class="h-1 w-1 rounded-full bg-brand-500"></span>
								{tip}
							</li>
						{/each}
					</ul>
				</Panel>
				<p class="text-[11px] text-muted">
					Collapsed: {detailsCollapsed ? 'yes — header only' : 'no — content height'}
				</p>
			</div>
		</div>
	{:else}
		<div class="flex h-96 w-full flex-col overflow-hidden rounded-xl border border-border">
			<div class={sceneCollapsed ? 'shrink-0' : 'min-h-0 flex-[1.1]'}>
				<Panel title="Scene" collapsible bind:collapsed={sceneCollapsed} chrome={false}>
					<ul class="space-y-0.5 text-xs text-secondary">
						{#each sceneItems.slice(0, 5) as item}
							<li class="rounded-md px-2 py-1 hover:bg-surface-overlay">{item}</li>
						{/each}
					</ul>
				</Panel>
			</div>
			<div class="min-h-0 flex-1 border-t border-border">
				<Panel title="Details" chrome={false} padding="md">
					<p class="text-xs text-secondary">Stacked panels sharing one outer chrome.</p>
				</Panel>
			</div>
		</div>
	{/if}
</div>
