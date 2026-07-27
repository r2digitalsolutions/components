<script lang="ts">
	import DesktopShell from './DesktopShell.svelte';
	import type {
		DesktopWindow,
		DesktopApp,
		DesktopWallpaper,
		DesktopWidget
	} from './DesktopShell.svelte';
	import List from '$lib/components/molecules/List/List.svelte';
	import StatCard from '$lib/components/molecules/StatCard/StatCard.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';

	interface Props {
		example?:
			| 'default'
			| 'dusk'
			| 'icons'
			| 'empty'
			| 'many'
			| 'widgets'
			| 'commands'
			| 'apps'
			| 'tall';
	}

	let { example = 'default' }: Props = $props();

	const catalog: DesktopApp[] = [
		{
			id: 'files',
			title: 'Files',
			icon: 'files',
			tone: 'amber',
			kind: 'files',
			description: 'Browse documents',
			defaultRect: { w: 360, h: 300 }
		},
		{
			id: 'mail',
			title: 'Mail',
			icon: 'mail',
			tone: 'sky',
			kind: 'mail',
			description: 'Inbox & drafts',
			defaultRect: { w: 420, h: 320 }
		},
		{
			id: 'music',
			title: 'Music',
			icon: 'music',
			tone: 'violet',
			kind: 'music',
			description: 'Now playing',
			defaultRect: { w: 320, h: 260 }
		},
		{
			id: 'notes',
			title: 'Notes',
			icon: 'notes',
			tone: 'emerald',
			kind: 'notes',
			description: 'Scratchpad',
			defaultRect: { w: 340, h: 280 }
		},
		{
			id: 'settings',
			title: 'Settings',
			icon: 'settings',
			tone: 'neutral',
			kind: 'settings',
			description: 'Preferences',
			defaultRect: { w: 380, h: 300 }
		},
		{
			id: 'stats',
			title: 'Analytics',
			icon: 'stats',
			tone: 'brand',
			kind: 'stats',
			description: 'KPIs overview',
			defaultRect: { w: 440, h: 300 }
		}
	];

	const starter: DesktopWindow[] = [
		{
			id: 'files',
			title: 'Files',
			icon: 'files',
			tone: 'amber',
			kind: 'files',
			rect: { x: 140, y: 24, w: 340, h: 260, z: 2 }
		},
		{
			id: 'mail',
			title: 'Mail',
			icon: 'mail',
			tone: 'sky',
			kind: 'mail',
			rect: { x: 280, y: 80, w: 400, h: 300, z: 3 }
		},
		{
			id: 'music',
			title: 'Music',
			icon: 'music',
			tone: 'violet',
			kind: 'music',
			rect: { x: 420, y: 40, w: 320, h: 240, z: 1 }
		}
	];

	const defaultWidgets: DesktopWidget[] = [
		{ id: 'w-weather', kind: 'weather', title: 'Madrid' },
		{
			id: 'w-sticky',
			kind: 'sticky',
			title: 'Sticky',
			body: 'Right-click icons\nClock → calendar\nMenubar · View'
		},
		{ id: 'w-stats', kind: 'stats', title: 'Pulse' }
	];

	let windows = $state<DesktopWindow[]>([]);
	let activeId = $state<string | null>(null);
	let wallpaper = $state<DesktopWallpaper>('aurora');
	let widgets = $state<DesktopWidget[]>([...defaultWidgets]);
	let showTaskbar = $state(true);
	let showDesktopIcons = $state(true);
	let showWidgets = $state(true);
	let showStart = $state(true);
	let showMenubar = $state(true);
	let showCommandPalette = $state(true);
	let height = $state<'sm' | 'md' | 'lg' | 'xl' | 'full'>('full');
	let startOpen = $state(false);
	let commandOpen = $state(false);
	let last = $state('');

	$effect(() => {
		if (example === 'dusk') {
			windows = starter.map((w) => ({ ...w, rect: { ...w.rect } }));
			activeId = 'mail';
			wallpaper = 'dusk';
			widgets = [...defaultWidgets];
			showTaskbar = true;
			showDesktopIcons = true;
			showWidgets = true;
			showStart = true;
			showMenubar = true;
			showCommandPalette = true;
			height = 'full';
			startOpen = false;
			commandOpen = false;
		} else if (example === 'icons') {
			windows = [];
			activeId = null;
			wallpaper = 'mint';
			widgets = [];
			showTaskbar = true;
			showDesktopIcons = true;
			showWidgets = false;
			showStart = true;
			showMenubar = true;
			showCommandPalette = true;
			height = 'full';
			startOpen = false;
			commandOpen = false;
		} else if (example === 'empty') {
			windows = [];
			activeId = null;
			wallpaper = 'paper';
			widgets = [...defaultWidgets];
			showTaskbar = true;
			showDesktopIcons = false;
			showWidgets = true;
			showStart = true;
			showMenubar = true;
			showCommandPalette = true;
			height = 'full';
			startOpen = true;
			commandOpen = false;
		} else if (example === 'many') {
			windows = catalog.map((app, i) => ({
				id: app.id,
				title: app.title,
				icon: app.icon,
				tone: app.tone,
				kind: app.kind,
				rect: {
					x: 140 + (i % 3) * 36,
					y: 20 + (i % 3) * 32,
					w: app.defaultRect?.w ?? 340,
					h: app.defaultRect?.h ?? 260,
					z: i + 1,
					minimized: i > 3
				}
			}));
			activeId = 'stats';
			wallpaper = 'slate';
			widgets = [defaultWidgets[0]];
			showTaskbar = true;
			showDesktopIcons = true;
			showWidgets = true;
			showStart = true;
			showMenubar = true;
			showCommandPalette = true;
			height = 'full';
			startOpen = false;
			commandOpen = false;
		} else if (example === 'widgets') {
			windows = [starter[0]].map((w) => ({ ...w, rect: { ...w.rect } }));
			activeId = 'files';
			wallpaper = 'aurora';
			widgets = [...defaultWidgets];
			showTaskbar = true;
			showDesktopIcons = true;
			showWidgets = true;
			showStart = true;
			showMenubar = true;
			showCommandPalette = true;
			height = 'full';
			startOpen = false;
			commandOpen = false;
		} else if (example === 'commands') {
			windows = starter.slice(0, 2).map((w) => ({ ...w, rect: { ...w.rect } }));
			activeId = 'mail';
			wallpaper = 'aurora';
			widgets = [defaultWidgets[0]];
			showTaskbar = true;
			showDesktopIcons = true;
			showWidgets = true;
			showStart = true;
			showMenubar = true;
			showCommandPalette = true;
			height = 'full';
			startOpen = false;
			commandOpen = true;
		} else if (example === 'apps') {
			windows = [
				{
					id: 'stats',
					title: 'Analytics',
					icon: 'stats',
					tone: 'brand',
					kind: 'stats',
					rect: { x: 160, y: 48, w: 480, h: 320, z: 5 }
				}
			];
			activeId = 'stats';
			wallpaper = 'slate';
			widgets = [...defaultWidgets];
			showTaskbar = true;
			showDesktopIcons = true;
			showWidgets = true;
			showStart = true;
			showMenubar = true;
			showCommandPalette = true;
			height = 'full';
			startOpen = false;
			commandOpen = false;
		} else if (example === 'tall') {
			windows = starter.map((w) => ({ ...w, rect: { ...w.rect } }));
			activeId = 'mail';
			wallpaper = 'dusk';
			widgets = [...defaultWidgets];
			showTaskbar = true;
			showDesktopIcons = true;
			showWidgets = true;
			showStart = true;
			showMenubar = true;
			showCommandPalette = true;
			height = 'full';
			startOpen = false;
			commandOpen = false;
		} else {
			windows = starter.map((w) => ({ ...w, rect: { ...w.rect } }));
			activeId = 'mail';
			wallpaper = 'aurora';
			widgets = [...defaultWidgets];
			showTaskbar = true;
			showDesktopIcons = true;
			showWidgets = true;
			showStart = true;
			showMenubar = true;
			showCommandPalette = true;
			height = 'full';
			startOpen = false;
			commandOpen = false;
		}
	});
</script>

<div class="flex h-dvh min-h-0 flex-col">
	{#if last}
		<p class="shrink-0 px-3 pt-2 text-xs text-muted">Last: {last}</p>
	{/if}
	{#if example === 'widgets'}
		<p class="shrink-0 px-3 pt-2 text-xs text-muted">
			Widgets a la derecha · clic derecho en icono / ventana / widget / escritorio · reloj abre calendario.
		</p>
	{/if}

	<div class="min-h-0 flex-1">
		<DesktopShell
			bind:windows
			bind:activeId
			bind:wallpaper
			bind:widgets
			bind:startOpen
			bind:commandOpen
			bind:showDesktopIcons
			bind:showWidgets
			apps={catalog}
			brand="Acme OS"
			brandMark="A"
			{showTaskbar}
			{showStart}
			{showMenubar}
			{showCommandPalette}
			{height}
			onopen={(id) => (last = `Opened ${id}`)}
			onclose={(id) => (last = `Closed ${id}`)}
			onuseraction={(id) => (last = `User · ${id}`)}
			onmenu={(id, parent) => (last = `Menu · ${parent}/${id}`)}
		>
			{#snippet render(win)}
				<div class="h-full p-3 sm:p-4">
					{#if win.kind === 'files'}
						<div class="space-y-3">
							<div class="flex items-center justify-between gap-2">
								<p class="text-sm font-medium text-primary">Documents</p>
								<Badge size="sm" variant="secondary">12</Badge>
							</div>
							<List
								size="sm"
								variant="plain"
								items={[
									{ id: '1', label: 'Q3 roadmap.pdf' },
									{ id: '2', label: 'Brand guidelines.fig' },
									{ id: '3', label: 'Invoice-2048.csv' },
									{ id: '4', label: 'Onboarding checklist.md' }
								]}
							/>
						</div>
					{:else if win.kind === 'mail'}
						<div class="space-y-2">
							{#each [
								{ from: 'Maya', subject: 'Design review tomorrow', time: '10:12' },
								{ from: 'Ops', subject: 'Deploy window confirmed', time: '09:40' },
								{ from: 'Billing', subject: 'Invoice ready', time: 'Yesterday' }
							] as mail, i (i)}
								<button
									type="button"
									class="flex w-full flex-col rounded-lg border border-border bg-surface px-3 py-2 text-left hover:border-brand-500/30"
								>
									<div class="flex items-center justify-between gap-2">
										<span class="text-sm font-medium text-primary">{mail.from}</span>
										<span class="text-[11px] text-muted">{mail.time}</span>
									</div>
									<span class="truncate text-xs text-secondary">{mail.subject}</span>
								</button>
							{/each}
						</div>
					{:else if win.kind === 'music'}
						<div class="flex h-full flex-col justify-between gap-4">
							<div>
								<p class="text-xs uppercase tracking-wide text-muted">Now playing</p>
								<p class="mt-1 text-base font-semibold text-primary">Midnight Grid</p>
								<p class="text-sm text-secondary">Neon Transit · Album 04</p>
							</div>
							<div class="h-1.5 overflow-hidden rounded-full bg-surface-overlay">
								<div class="h-full w-2/3 rounded-full bg-brand-500"></div>
							</div>
							<div class="flex gap-2">
								<Button size="sm" variant="secondary" class="flex-1">Prev</Button>
								<Button size="sm" class="flex-1">Pause</Button>
								<Button size="sm" variant="secondary" class="flex-1">Next</Button>
							</div>
						</div>
					{:else if win.kind === 'notes'}
						<textarea
							class="h-full min-h-[10rem] w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm text-primary outline-none focus:ring-2 focus:ring-brand-500/30"
							placeholder="Write a note…"
						>Desktop polish checklist
- Lucide icons (same size)
- Context menus by target
- Clock + Calendar popover
- Top menubar + widgets</textarea>
					{:else if win.kind === 'settings'}
						<div class="space-y-1">
							<SettingsRow title="Dark accents" description="Tint window chrome" checked />
							<SettingsRow title="Desktop icons" description="Show app shortcuts" checked />
							<SettingsRow title="Clock panel" description="Calendar in popover" checked />
						</div>
					{:else if win.kind === 'stats'}
						<div class="grid grid-cols-2 gap-2">
							<StatCard label="Sessions" value="1,284" delta="+8%" trend="up" variant="ghost" />
							<StatCard label="Latency" value="42ms" delta="-3ms" trend="up" variant="ghost" />
							<StatCard label="Errors" value="0.2%" delta="-0.1%" trend="up" variant="ghost" />
							<StatCard label="Uptime" value="99.9%" delta="30d" trend="neutral" variant="ghost" />
						</div>
					{:else}
						<p class="text-sm text-secondary">
							Window <strong class="text-primary">{win.title}</strong>
						</p>
					{/if}
				</div>
			{/snippet}
		</DesktopShell>
	</div>
</div>
