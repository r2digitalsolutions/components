<script lang="ts">
	import SplitPane from './SplitPane.svelte';
	import Panel from '$lib/components/molecules/Panel/Panel.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	let {
		example = 'ide',
		orientation = 'horizontal',
		sizePane = 'start',
		minSize = 15,
		maxSize = 70,
		revealOnHover = false
	}: {
		example?: 'ide' | 'horizontal' | 'vertical' | 'sizeEnd' | 'code' | 'hover';
		orientation?: 'horizontal' | 'vertical';
		sizePane?: 'start' | 'end';
		minSize?: number;
		maxSize?: number;
		revealOnHover?: boolean;
	} = $props();

	let sidebar = $state(28);
	let bottom = $state(35);
	let simple = $state(40);
	let endSize = $state(32);
	let explorer = $state(22);
	let terminal = $state(28);
	let hoverSize = $state(30);
	let hoverBottom = $state(32);

	const files = ['main.ts', 'SplitPane.svelte', 'Panel.svelte', 'index.ts', 'app.css'];
	const logs = [
		'[12:01] Build started…',
		'[12:01] Compiling 42 modules',
		'[12:02] ✓ Ready on :6006',
		'[12:03] HMR update /Panel.svelte'
	];
</script>

<div class="w-full space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Split pane</p>
		<p class="text-xs text-secondary">
			Arrastra el handle, o haz clic en él y usa las flechas. Con
			<code class="rounded bg-surface-overlay px-1 text-[11px]">revealOnHover</code>
			solo queda un acento fino hasta que pasas el ratón.
		</p>
	</div>

	{#if example === 'hover'}
		<div class="h-[min(70vh,32rem)] w-full overflow-hidden rounded-xl border border-border shadow-sm">
			<SplitPane
				orientation="horizontal"
				bind:size={hoverSize}
				minSize={18}
				maxSize={45}
				revealOnHover
				class="h-full"
			>
				{#snippet start()}
					<Panel title="Sidebar" chrome={false}>
						{#snippet actions()}
							<span class="pr-1 text-[10px] tabular-nums text-muted">{Math.round(hoverSize)}%</span>
						{/snippet}
						<ul class="space-y-0.5">
							{#each files as file, i}
								<li
									class={[
										'rounded-md px-2 py-1.5 text-xs',
										i === 1
											? 'bg-brand-50 font-medium text-brand-800 dark:bg-brand-950/40 dark:text-brand-200'
											: 'text-secondary hover:bg-surface-overlay'
									]}
								>
									{file}
								</li>
							{/each}
						</ul>
					</Panel>
				{/snippet}
				{#snippet end()}
					<SplitPane
						orientation="vertical"
						bind:size={hoverBottom}
						sizePane="end"
						minSize={18}
						maxSize={50}
						revealOnHover
						class="h-full"
					>
						{#snippet start()}
							<Panel title="Canvas" chrome={false} padding="md">
								<div
									class="flex h-full min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-xs text-muted"
								>
									Idle = thin accent · hover the edge = full grip
								</div>
							</Panel>
						{/snippet}
						{#snippet end()}
							<Panel title="Console" chrome={false}>
								{#snippet actions()}
									<span class="pr-1 text-[10px] tabular-nums text-muted"
										>{Math.round(hoverBottom)}%</span
									>
								{/snippet}
								<div class="space-y-1 font-mono text-[11px] text-secondary">
									{#each logs as line}
										<p>{line}</p>
									{/each}
								</div>
							</Panel>
						{/snippet}
					</SplitPane>
				{/snippet}
			</SplitPane>
		</div>
		<p class="text-xs text-muted">
			Pass the cursor over the split — the grip fades in. While dragging or focused it stays expanded.
		</p>
	{:else if example === 'ide'}
		<div class="h-[min(70vh,32rem)] w-full overflow-hidden rounded-xl border border-border shadow-sm">
			<SplitPane
				orientation="horizontal"
				bind:size={sidebar}
				minSize={18}
				maxSize={42}
				{revealOnHover}
				class="h-full"
			>
				{#snippet start()}
					<Panel title="Explorer" chrome={false}>
						{#snippet actions()}
							<span class="pr-1 text-[10px] tabular-nums text-muted">{Math.round(sidebar)}%</span>
						{/snippet}
						<ul class="space-y-0.5">
							{#each files as file, i}
								<li
									class={[
										'rounded-md px-2 py-1.5 text-xs',
										i === 1
											? 'bg-brand-50 font-medium text-brand-800 dark:bg-brand-950/40 dark:text-brand-200'
											: 'text-secondary hover:bg-surface-overlay'
									]}
								>
									{file}
								</li>
							{/each}
						</ul>
					</Panel>
				{/snippet}
				{#snippet end()}
					<SplitPane
						orientation="vertical"
						bind:size={bottom}
						sizePane="end"
						minSize={18}
						maxSize={55}
						{revealOnHover}
						class="h-full"
					>
						{#snippet start()}
							<Panel title="Viewport" chrome={false} padding="md">
								<div
									class="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-xs text-muted"
								>
									Main canvas · drag edges to resize
								</div>
							</Panel>
						{/snippet}
						{#snippet end()}
							<Panel title="Content browser" chrome={false}>
								{#snippet actions()}
									<span class="pr-1 text-[10px] tabular-nums text-muted"
										>{Math.round(bottom)}%</span
									>
								{/snippet}
								<div class="grid grid-cols-3 gap-2">
									{#each ['Mesh', 'Material', 'Texture', 'Blueprint', 'Sound', 'Anim'] as asset}
										<div
											class="rounded-lg border border-border bg-surface px-2 py-3 text-center text-[11px] text-secondary"
										>
											{asset}
										</div>
									{/each}
								</div>
							</Panel>
						{/snippet}
					</SplitPane>
				{/snippet}
			</SplitPane>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Badge size="sm" variant="primary">Sidebar {Math.round(sidebar)}%</Badge>
			<Badge size="sm" variant="secondary">Bottom {Math.round(bottom)}%</Badge>
			<Button size="xs" variant="outline" onclick={() => (sidebar = 28)}>Reset sidebar</Button>
			<Button size="xs" variant="outline" onclick={() => (bottom = 35)}>Reset bottom</Button>
		</div>
	{:else if example === 'horizontal'}
		<div class="h-64 w-full overflow-hidden rounded-xl border border-border">
			<SplitPane
				{orientation}
				bind:size={simple}
				{minSize}
				{maxSize}
				{sizePane}
				{revealOnHover}
				class="h-full"
			>
				{#snippet start()}
					<Panel title="Start pane" chrome={false} padding="md">
						<p class="text-xs text-secondary">
							Sized pane · <span class="font-medium text-primary">{Math.round(simple)}%</span>
						</p>
						<p class="mt-2 text-xs text-muted">min {minSize}% · max {maxSize}%</p>
					</Panel>
				{/snippet}
				{#snippet end()}
					<Panel title="End pane" chrome={false} padding="md">
						<p class="text-xs text-secondary">Flexes to fill the remaining space.</p>
					</Panel>
				{/snippet}
			</SplitPane>
		</div>
	{:else if example === 'vertical'}
		<div class="h-80 w-full overflow-hidden rounded-xl border border-border">
			<SplitPane
				orientation="vertical"
				bind:size={simple}
				minSize={20}
				maxSize={75}
				{revealOnHover}
				class="h-full"
			>
				{#snippet start()}
					<Panel title="Top" chrome={false} padding="md">
						<p class="text-xs text-secondary">Top · {Math.round(simple)}%</p>
					</Panel>
				{/snippet}
				{#snippet end()}
					<Panel title="Bottom" chrome={false} padding="md">
						<p class="text-xs text-secondary">Bottom fills the rest.</p>
					</Panel>
				{/snippet}
			</SplitPane>
		</div>
	{:else if example === 'sizeEnd'}
		<div class="h-64 w-full overflow-hidden rounded-xl border border-border">
			<SplitPane
				orientation="horizontal"
				bind:size={endSize}
				sizePane="end"
				minSize={20}
				maxSize={50}
				{revealOnHover}
				class="h-full"
			>
				{#snippet start()}
					<Panel title="Main (flex)" chrome={false} padding="md">
						<p class="text-xs text-secondary">
							`sizePane="end"` applies the percentage to the right pane.
						</p>
					</Panel>
				{/snippet}
				{#snippet end()}
					<Panel title="Aside" chrome={false} padding="md">
						{#snippet actions()}
							<span class="pr-1 text-[10px] tabular-nums text-muted">{Math.round(endSize)}%</span>
						{/snippet}
						<p class="text-xs text-secondary">Fixed-size end pane.</p>
					</Panel>
				{/snippet}
			</SplitPane>
		</div>
	{:else}
		<div class="h-[min(70vh,28rem)] w-full overflow-hidden rounded-xl border border-border shadow-sm">
			<SplitPane
				orientation="horizontal"
				bind:size={explorer}
				minSize={16}
				maxSize={40}
				{revealOnHover}
				class="h-full"
			>
				{#snippet start()}
					<Panel title="Files" chrome={false}>
						<ul class="space-y-0.5 text-xs text-secondary">
							{#each files as file}
								<li class="rounded-md px-2 py-1 hover:bg-surface-overlay">{file}</li>
							{/each}
						</ul>
					</Panel>
				{/snippet}
				{#snippet end()}
					<SplitPane
						orientation="vertical"
						bind:size={terminal}
						sizePane="end"
						minSize={15}
						maxSize={50}
						{revealOnHover}
						class="h-full"
					>
						{#snippet start()}
							<Panel title="Editor" chrome={false} padding="none">
								<pre
									class="h-full overflow-auto bg-[#0f1419] p-3 font-mono text-[11px] leading-relaxed text-emerald-300/90"
								><code>{`export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Drag the split handles ↓
const size = $state(28);`}</code></pre>
							</Panel>
						{/snippet}
						{#snippet end()}
							<Panel title="Terminal" chrome={false} padding="sm">
								{#snippet actions()}
									<span class="pr-1 text-[10px] tabular-nums text-muted"
										>{Math.round(terminal)}%</span
									>
								{/snippet}
								<div class="space-y-1 font-mono text-[11px] text-secondary">
									{#each logs as line}
										<p>{line}</p>
									{/each}
									<p class="text-brand-600 dark:text-brand-400">➜ _</p>
								</div>
							</Panel>
						{/snippet}
					</SplitPane>
				{/snippet}
			</SplitPane>
		</div>
	{/if}
</div>
