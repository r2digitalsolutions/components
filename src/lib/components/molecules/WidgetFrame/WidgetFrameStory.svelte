<script lang="ts">
	import WidgetFrame from './WidgetFrame.svelte';
	import type { WidgetRect } from './WidgetFrame.svelte';
	import WidgetCanvas from '$lib/components/molecules/WidgetCanvas/WidgetCanvas.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	interface Props {
		example?: 'gallery' | 'freeform' | 'collapse' | 'reload' | 'editable';
	}

	let { example = 'gallery' }: Props = $props();

	let log = $state('');
	let revenueCollapsed = $state(false);
	let teamCollapsed = $state(true);
	let reloadCount = $state(0);
	let revenue = $state(48240);

	let widgets = $state([
		{ id: 'a', title: 'Revenue', description: 'Last 30 days' },
		{ id: 'b', title: 'Active users', description: 'Realtime' },
		{ id: 'c', title: 'Conversion', description: 'Funnel' }
	]);

	let freeA = $state<WidgetRect>({ x: 24, y: 24, w: 288, h: 192 });
	let freeB = $state<WidgetRect>({ x: 312, y: 24, w: 288, h: 192 });
	let freeC = $state<WidgetRect>({ x: 24, y: 240, w: 576, h: 168 });

	let showGrid = $state(true);
	let snap = $state(true);
	let cellSize = $state(24);

	function delay(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	async function reloadRevenue() {
		log = 'Reloading…';
		await delay(900);
		revenue = 45000 + Math.round(Math.random() * 8000);
		reloadCount += 1;
		log = `Reloaded ×${reloadCount}`;
	}

	async function reloadNamed(name: string) {
		log = `Reloading ${name}…`;
		await delay(700);
		log = `Reloaded ${name}`;
	}
</script>

{#if example === 'gallery'}
	<div class="grid max-w-3xl gap-4 sm:grid-cols-2">
		<WidgetFrame title="Revenue" description="Last 30 days">
			<div class="space-y-1">
				<p class="text-2xl font-semibold tabular-nums text-primary">$48,240</p>
				<p class="text-xs text-muted">
					<span class="font-medium text-brand-600 dark:text-brand-400">+12.4%</span> vs prior
					period
				</p>
			</div>
		</WidgetFrame>

		<WidgetFrame title="Pipeline" description="Loading snapshot" loading />

		<WidgetFrame
			title="Alerts"
			description="No open items"
			empty
			emptyTitle="All clear"
			emptyDescription="New alerts will appear here when triggered."
		/>

		<WidgetFrame title="Team" description="Presence" collapsible>
			{#snippet actions()}
				<Badge size="sm" variant="success" rounded>Online</Badge>
			{/snippet}
			<ul class="space-y-2 text-sm text-secondary">
				<li>Maya Chen</li>
				<li>Alex Rivera</li>
				<li>Jordan Lee</li>
			</ul>
		</WidgetFrame>
	</div>
{:else if example === 'freeform'}
	<div class="w-full max-w-5xl space-y-2">
		<p class="text-xs text-muted">
			Tablero grande con scroll · rejilla / snap / celda en la barra
			<span class="tabular-nums text-primary">
				· A {freeA.x},{freeA.y} {freeA.w}×{freeA.h}
			</span>
		</p>

		<WidgetCanvas
			bind:showGrid
			bind:snap
			bind:cellSize
			width={1600}
			height={1000}
			viewportHeight={520}
		>
			<WidgetFrame
				bind:rect={freeA}
				freeform
				draggable
				resizable
				collapsible
				title="Notes"
				description="Freeform widget"
			>
				<p class="text-sm leading-relaxed text-secondary">
					Drag and resize across the full board. Scroll to reach the rest of the grid.
				</p>
			</WidgetFrame>

			<WidgetFrame
				bind:rect={freeB}
				freeform
				draggable
				resizable
				title="Metrics"
				description="KPIs"
				onreload={() => reloadNamed('Metrics')}
			>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<p class="text-[11px] text-muted">MRR</p>
						<p class="text-lg font-semibold tabular-nums text-primary">$12.4k</p>
					</div>
					<div>
						<p class="text-[11px] text-muted">Churn</p>
						<p class="text-lg font-semibold tabular-nums text-primary">1.8%</p>
					</div>
				</div>
			</WidgetFrame>

			<WidgetFrame
				bind:rect={freeC}
				freeform
				draggable
				resizable
				editable
				title="Inbox"
				description="3 unread"
				onremove={() => (log = 'Inbox removed')}
			>
				<ul class="space-y-1.5 text-sm text-secondary">
					<li>Design review invite</li>
					<li>Invoice reminder</li>
					<li>API quota warning</li>
				</ul>
			</WidgetFrame>
		</WidgetCanvas>

		{#if log}
			<p class="text-[11px] text-muted">{log}</p>
		{/if}
	</div>
{:else if example === 'collapse'}
	<div class="mx-auto flex max-w-md flex-col gap-3">
		<WidgetFrame
			title="Revenue"
			description="Collapsible panel"
			collapsible
			bind:collapsed={revenueCollapsed}
			oncollapse={(v) => (log = v ? 'Revenue collapsed' : 'Revenue expanded')}
		>
			<p class="text-2xl font-semibold tabular-nums text-primary">$48,240</p>
		</WidgetFrame>

		<WidgetFrame
			title="Team activity"
			description="Starts collapsed"
			collapsible
			bind:collapsed={teamCollapsed}
		>
			<ul class="space-y-2 text-sm text-secondary">
				<li>Maya commented on Lead #42</li>
				<li>Alex closed deal Acme</li>
			</ul>
		</WidgetFrame>

		<p class="text-[11px] text-muted">
			Revenue: {revenueCollapsed ? 'collapsed' : 'open'} · Team: {teamCollapsed
				? 'collapsed'
				: 'open'}
			{#if log}
				· {log}
			{/if}
		</p>
	</div>
{:else if example === 'reload'}
	<div class="mx-auto max-w-sm">
		<WidgetFrame
			title="Revenue"
			description="Click reload in the header"
			onreload={reloadRevenue}
			collapsible
		>
			<div class="space-y-1">
				<p class="text-2xl font-semibold tabular-nums text-primary">
					${revenue.toLocaleString()}
				</p>
				<p class="text-xs text-muted">Refresh count: {reloadCount}</p>
			</div>
		</WidgetFrame>
		{#if log}
			<p class="mt-2 text-[11px] text-muted">{log}</p>
		{/if}
	</div>
{:else}
	<div class="grid max-w-3xl items-start gap-4 sm:grid-cols-2">
		{#each widgets as w (w.id)}
			<WidgetFrame
				title={w.title}
				description={w.description}
				editable
				draggable
				resizable
				collapsible
				onreload={() => reloadNamed(w.title)}
				ondragstart={() => (log = `Drag ${w.title}`)}
				onchange={(r) => (log = `Resize ${w.title} → ${Math.round(r.w)}×${Math.round(r.h)}`)}
				onremove={() => {
					widgets = widgets.filter((x) => x.id !== w.id);
					log = `Removed ${w.title}`;
				}}
			>
				{#snippet actions()}
					<button
						type="button"
						class="rounded-md px-2 py-1 text-[11px] font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40"
					>
						Export
					</button>
				{/snippet}
				<p class="text-sm text-secondary">
					Editable chrome — drag / resize / reload / collapse / remove.
				</p>
			</WidgetFrame>
		{/each}

		{#if log}
			<p class="col-span-full text-[11px] text-muted">{log}</p>
		{/if}
	</div>
{/if}
