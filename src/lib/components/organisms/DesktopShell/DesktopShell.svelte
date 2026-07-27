<script lang="ts">
	import type { Snippet } from 'svelte';
	import FloatingWindow from '$lib/components/molecules/FloatingWindow/FloatingWindow.svelte';
	import type { WindowRect } from '$lib/components/molecules/FloatingWindow/FloatingWindow.svelte';
	import CommandPalette from '$lib/components/organisms/CommandPalette/CommandPalette.svelte';
	import type { CommandItem } from '$lib/components/organisms/CommandPalette/CommandPalette.svelte';
	import Menubar from '$lib/components/organisms/Menubar/Menubar.svelte';
	import type { MenubarItem } from '$lib/components/organisms/Menubar/Menubar.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Tile from '$lib/components/molecules/Tile/Tile.svelte';
	import ContextMenu from '$lib/components/molecules/ContextMenu/ContextMenu.svelte';
	import type { ContextMenuItem } from '$lib/components/molecules/ContextMenu/ContextMenu.svelte';
	import DropdownMenu from '$lib/components/molecules/DropdownMenu/DropdownMenu.svelte';
	import type { DropdownItem } from '$lib/components/molecules/DropdownMenu/DropdownMenu.svelte';
	import UserMenu from '$lib/components/molecules/UserMenu/UserMenu.svelte';
	import type { UserMenuItem } from '$lib/components/molecules/UserMenu/UserMenu.svelte';
	import Popover from '$lib/components/molecules/Popover/Popover.svelte';
	import Calendar from '$lib/components/molecules/Calendar/Calendar.svelte';
	import SessionPresenceBadge from '$lib/components/molecules/SessionPresenceBadge/SessionPresenceBadge.svelte';
	import DesktopAppIcon from '$lib/components/molecules/DesktopAppIcon/DesktopAppIcon.svelte';
	import type {
		DesktopIconId,
		DesktopAppIconTone
	} from '$lib/components/molecules/DesktopAppIcon/DesktopAppIcon.svelte';
	import BrandMark from '$lib/components/atoms/BrandMark/BrandMark.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Tooltip from '$lib/components/atoms/Tooltip/Tooltip.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Kbd from '$lib/components/atoms/Kbd/Kbd.svelte';
	import StatCard from '$lib/components/molecules/StatCard/StatCard.svelte';
	import Grid2x2 from '@lucide/svelte/icons/grid-2x2';
	import Search from '@lucide/svelte/icons/search';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import Layers from '@lucide/svelte/icons/layers';
	import Minimize2 from '@lucide/svelte/icons/minimize-2';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import CloudSun from '@lucide/svelte/icons/cloud-sun';

	export interface DesktopWindow {
		id: string;
		title: string;
		rect: WindowRect;
		closed?: boolean;
		icon?: DesktopIconId;
		tone?: DesktopAppIconTone;
		kind?: string;
		pinned?: boolean;
		closable?: boolean;
		minimizable?: boolean;
		maximizable?: boolean;
	}

	export interface DesktopApp {
		id: string;
		title: string;
		icon?: DesktopIconId;
		tone?: DesktopAppIconTone;
		kind?: string;
		description?: string;
		defaultRect?: Partial<WindowRect>;
	}

	export type DesktopWidgetKind = 'clock' | 'weather' | 'sticky' | 'stats';

	export interface DesktopWidget {
		id: string;
		kind: DesktopWidgetKind;
		title?: string;
		body?: string;
		x?: number;
		y?: number;
	}

	export type DesktopWallpaper =
		| 'aurora'
		| 'slate'
		| 'mint'
		| 'dusk'
		| 'paper'
		| 'custom';

	export type DesktopShellHeight = 'sm' | 'md' | 'lg' | 'xl';

	type ContextTarget =
		| { type: 'desktop' }
		| { type: 'app'; id: string }
		| { type: 'window'; id: string }
		| { type: 'taskbar'; id: string }
		| { type: 'widget'; id: string };

	interface DesktopShellProps {
		windows?: DesktopWindow[];
		activeId?: string | null;
		wallpaper?: DesktopWallpaper;
		wallpaperUrl?: string;
		apps?: DesktopApp[];
		widgets?: DesktopWidget[];
		menubarItems?: MenubarItem[];
		brand?: string;
		brandMark?: string;
		userName?: string;
		userEmail?: string;
		showMenubar?: boolean;
		showTaskbar?: boolean;
		showStart?: boolean;
		showClock?: boolean;
		showDesktopIcons?: boolean;
		showWidgets?: boolean;
		showWindowCount?: boolean;
		showCommandPalette?: boolean;
		showUserMenu?: boolean;
		showPresence?: boolean;
		height?: DesktopShellHeight;
		startOpen?: boolean;
		commandOpen?: boolean;
		class?: string;
		render?: Snippet<[DesktopWindow]>;
		taskbarLeading?: Snippet;
		taskbarTrailing?: Snippet;
		onchange?: (windows: DesktopWindow[]) => void;
		onactivechange?: (id: string | null) => void;
		onopen?: (id: string) => void;
		onclose?: (id: string) => void;
		onuseraction?: (id: string) => void;
		onmenu?: (itemId: string, parentId: string) => void;
	}

	const HEIGHT: Record<DesktopShellHeight, string> = {
		sm: 'h-[28rem]',
		md: 'h-[36rem]',
		lg: 'h-[44rem]',
		xl: 'h-[min(52rem,85vh)]'
	};

	const WALLPAPER_CLASS: Record<Exclude<DesktopWallpaper, 'custom'>, string> = {
		aurora:
			'bg-[radial-gradient(ellipse_at_20%_0%,rgb(56_189_248_/_0.28),transparent_50%),radial-gradient(ellipse_at_80%_10%,rgb(167_139_250_/_0.22),transparent_45%),linear-gradient(160deg,var(--surface),var(--surface-overlay))]',
		slate:
			'bg-[radial-gradient(circle_at_30%_20%,rgb(100_116_139_/_0.3),transparent_50%),linear-gradient(165deg,#0f172a,#1e293b_55%,#334155)]',
		mint:
			'bg-[radial-gradient(ellipse_at_top,rgb(52_211_153_/_0.22),transparent_50%),linear-gradient(160deg,var(--surface),rgb(236_253_245))]',
		dusk:
			'bg-[radial-gradient(ellipse_at_70%_0%,rgb(251_146_60_/_0.28),transparent_45%),radial-gradient(ellipse_at_10%_80%,rgb(99_102_241_/_0.2),transparent_40%),linear-gradient(165deg,#1e1b4b,#312e81_40%,#7c2d12)]',
		paper:
			'bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface)),repeating-linear-gradient(0deg,transparent,transparent_23px,rgb(0_0_0_/_0.03)_24px)]'
	};

	const DEFAULT_MENU: MenubarItem[] = [
		{
			id: 'file',
			label: 'File',
			items: [
				{ id: 'new-window', label: 'New window', shortcut: '⌘N' },
				{ id: 'command', label: 'Command palette…', shortcut: '⌘K' },
				{ id: 'sep-f', label: '', separator: true },
				{ id: 'close-active', label: 'Close window', shortcut: '⌘W', destructive: true }
			]
		},
		{
			id: 'view',
			label: 'View',
			items: [
				{ id: 'cascade', label: 'Cascade' },
				{ id: 'tile', label: 'Tile' },
				{ id: 'minimize-all', label: 'Minimize all' },
				{ id: 'sep-v', label: '', separator: true },
				{ id: 'toggle-icons', label: 'Toggle desktop icons' },
				{ id: 'toggle-widgets', label: 'Toggle widgets' }
			]
		},
		{
			id: 'wallpaper',
			label: 'Wallpaper',
			items: [
				{ id: 'aurora', label: 'Aurora' },
				{ id: 'dusk', label: 'Dusk' },
				{ id: 'slate', label: 'Slate' },
				{ id: 'mint', label: 'Mint' },
				{ id: 'paper', label: 'Paper' }
			]
		},
		{
			id: 'help',
			label: 'Help',
			items: [
				{ id: 'shortcuts', label: 'Keyboard shortcuts' },
				{ id: 'about', label: 'About Desktop' }
			]
		}
	];

	const DEFAULT_WIDGETS: DesktopWidget[] = [
		{ id: 'w-weather', kind: 'weather', title: 'Weather', x: 16, y: 16 },
		{ id: 'w-sticky', kind: 'sticky', title: 'Notes', body: 'Ship desktop polish\n· Icons ✓\n· Menubar ✓', x: 16, y: 140 },
		{ id: 'w-stats', kind: 'stats', title: 'Pulse', x: 16, y: 280 }
	];

	const TASKBAR_VISIBLE = 5;

	let {
		windows = $bindable([] as DesktopWindow[]),
		activeId = $bindable<string | null>(null),
		wallpaper = $bindable<DesktopWallpaper>('aurora'),
		wallpaperUrl,
		apps = [],
		widgets = $bindable([...DEFAULT_WIDGETS] as DesktopWidget[]),
		menubarItems = DEFAULT_MENU,
		brand = 'Workspace',
		brandMark,
		userName = 'Alex Rivera',
		userEmail = 'alex@company.com',
		showMenubar = true,
		showTaskbar = true,
		showStart = true,
		showClock = true,
		showDesktopIcons = $bindable(true),
		showWidgets = $bindable(true),
		showWindowCount = true,
		showCommandPalette = true,
		showUserMenu = true,
		showPresence = true,
		height = 'md',
		startOpen = $bindable(false),
		commandOpen = $bindable(false),
		class: className = '',
		render,
		taskbarLeading,
		taskbarTrailing,
		onchange,
		onactivechange,
		onopen,
		onclose,
		onuseraction,
		onmenu
	}: DesktopShellProps = $props();

	let zCounter = $state(20);
	let clock = $state('');
	let clockDate = $state('');
	let calendarValue = $state(new Date().toISOString().slice(0, 10));
	let clockOpen = $state(false);
	let desktopEl = $state<HTMLDivElement | null>(null);
	let startQuery = $state('');
	let contextTarget = $state<ContextTarget>({ type: 'desktop' });

	const openWindows = $derived(
		windows
			.filter((w) => !w.closed)
			.sort((a, b) => (a.rect.z ?? 0) - (b.rect.z ?? 0))
	);
	const taskbarWindows = $derived(windows.filter((w) => !w.closed));
	const visibleTaskbar = $derived(taskbarWindows.slice(0, TASKBAR_VISIBLE));
	const overflowTaskbar = $derived(taskbarWindows.slice(TASKBAR_VISIBLE));
	const minimizedCount = $derived(taskbarWindows.filter((w) => w.rect.minimized).length);

	const launcherApps = $derived.by(() => {
		if (apps.length) return apps;
		const seen = new Set<string>();
		const inferred: DesktopApp[] = [];
		for (const w of windows) {
			if (seen.has(w.id)) continue;
			seen.add(w.id);
			inferred.push({
				id: w.id,
				title: w.title,
				icon: w.icon,
				tone: w.tone,
				kind: w.kind
			});
		}
		return inferred;
	});

	const filteredApps = $derived.by(() => {
		const q = startQuery.trim().toLowerCase();
		if (!q) return launcherApps;
		return launcherApps.filter((a) =>
			[a.title, a.description, a.kind].filter(Boolean).join(' ').toLowerCase().includes(q)
		);
	});

	const appById = $derived.by(() => {
		const map = new Map<string, DesktopApp>();
		for (const a of launcherApps) map.set(a.id, a);
		return map;
	});

	const commandItems = $derived.by((): CommandItem[] => {
		const appItems: CommandItem[] = launcherApps.map((a) => ({
			id: `open:${a.id}`,
			label: `Open ${a.title}`,
			group: 'Apps'
		}));
		const winItems: CommandItem[] = taskbarWindows.map((w) => ({
			id: `focus:${w.id}`,
			label: w.rect.minimized ? `Restore ${w.title}` : `Focus ${w.title}`,
			group: 'Windows'
		}));
		const layout: CommandItem[] = [
			{ id: 'layout:cascade', label: 'Cascade windows', group: 'Layout' },
			{ id: 'layout:tile', label: 'Tile windows', group: 'Layout' },
			{ id: 'layout:minimize-all', label: 'Minimize all', group: 'Layout' },
			{ id: 'wallpaper:aurora', label: 'Wallpaper · Aurora', group: 'Desktop' },
			{ id: 'wallpaper:dusk', label: 'Wallpaper · Dusk', group: 'Desktop' },
			{ id: 'wallpaper:slate', label: 'Wallpaper · Slate', group: 'Desktop' },
			{ id: 'wallpaper:mint', label: 'Wallpaper · Mint', group: 'Desktop' },
			{ id: 'wallpaper:paper', label: 'Wallpaper · Paper', group: 'Desktop' }
		];
		return [...appItems, ...winItems, ...layout];
	});

	const contextItems = $derived.by((): ContextMenuItem[] => {
		const target = contextTarget;
		if (target.type === 'app') {
			const app = appById.get(target.id);
			return [
				{ id: 'open', label: `Open ${app?.title ?? 'app'}` },
				{ id: 'pin', label: 'Pin to taskbar', disabled: true },
				{ id: 'sep-a', label: '', separator: true },
				{ id: 'get-info', label: 'Get info' }
			];
		}
		if (target.type === 'window' || target.type === 'taskbar') {
			const win = windows.find((w) => w.id === target.id);
			return [
				{ id: 'focus', label: 'Bring to front' },
				{ id: 'minimize', label: win?.rect.minimized ? 'Restore' : 'Minimize' },
				{ id: 'maximize', label: win?.rect.maximized ? 'Restore size' : 'Maximize' },
				{ id: 'sep-w', label: '', separator: true },
				{ id: 'close', label: 'Close', destructive: true }
			];
		}
		if (target.type === 'widget') {
			return [
				{ id: 'refresh-widget', label: 'Refresh widget' },
				{ id: 'sep-wg', label: '', separator: true },
				{ id: 'hide-widgets', label: 'Hide all widgets' },
				{ id: 'remove-widget', label: 'Remove widget', destructive: true }
			];
		}
		return [
			{ id: 'command', label: 'Command palette…', shortcut: '⌘K' },
			{ id: 'sep-d1', label: '', separator: true },
			{ id: 'cascade', label: 'Cascade windows' },
			{ id: 'tile', label: 'Tile windows' },
			{ id: 'minimize-all', label: 'Minimize all' },
			{ id: 'sep-d2', label: '', separator: true },
			{
				id: 'toggle-icons',
				label: showDesktopIcons ? 'Hide desktop icons' : 'Show desktop icons'
			},
			{
				id: 'toggle-widgets',
				label: showWidgets ? 'Hide widgets' : 'Show widgets'
			}
		];
	});

	const overflowItems = $derived.by((): DropdownItem[] =>
		overflowTaskbar.map((w) => ({
			id: w.id,
			label: w.title,
			description: w.rect.minimized ? 'Minimized' : 'Open'
		}))
	);

	const userItems: UserMenuItem[] = [
		{ id: 'profile', label: 'Profile' },
		{ id: 'prefs', label: 'Preferences' },
		{ id: 'sep', label: '', separator: true },
		{ id: 'logout', label: 'Sign out', destructive: true }
	];

	$effect(() => {
		if (!showClock) return;
		const tick = () => {
			const now = new Date();
			clock = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			clockDate = now.toLocaleDateString([], {
				weekday: 'short',
				month: 'short',
				day: 'numeric'
			});
		};
		tick();
		const id = window.setInterval(tick, 15_000);
		return () => window.clearInterval(id);
	});

	function onGlobalKey(e: KeyboardEvent) {
		if (!showCommandPalette) return;
		const meta = e.metaKey || e.ctrlKey;
		if (meta && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			startOpen = false;
			clockOpen = false;
			commandOpen = !commandOpen;
		}
	}

	function emit(next: DesktopWindow[]) {
		windows = next;
		onchange?.(next);
	}

	function nextZ() {
		zCounter += 1;
		return zCounter;
	}

	function focusWindow(id: string) {
		const z = nextZ();
		emit(
			windows.map((w) =>
				w.id === id
					? { ...w, closed: false, rect: { ...w.rect, z, minimized: false } }
					: w
			)
		);
		activeId = id;
		onactivechange?.(id);
	}

	function updateRect(id: string, rect: WindowRect) {
		emit(
			windows.map((w) =>
				w.id === id ? { ...w, rect: { ...rect, z: rect.z ?? w.rect.z } } : w
			)
		);
	}

	function closeWindow(id: string) {
		emit(windows.map((w) => (w.id === id ? { ...w, closed: true } : w)));
		onclose?.(id);
		if (activeId === id) {
			const next = windows.find((w) => w.id !== id && !w.closed && !w.rect.minimized);
			activeId = next?.id ?? null;
			onactivechange?.(activeId);
		}
	}

	function toggleMinimize(id: string) {
		const win = windows.find((w) => w.id === id);
		if (!win || win.closed) return;
		if (win.rect.minimized) {
			focusWindow(id);
			return;
		}
		emit(
			windows.map((w) =>
				w.id === id ? { ...w, rect: { ...w.rect, minimized: true, maximized: false } } : w
			)
		);
		if (activeId === id) {
			const next = windows.find((w) => w.id !== id && !w.closed && !w.rect.minimized);
			activeId = next?.id ?? null;
			onactivechange?.(activeId);
		}
	}

	function toggleMaximize(id: string) {
		const win = windows.find((w) => w.id === id);
		if (!win) return;
		focusWindow(id);
		emit(
			windows.map((w) =>
				w.id === id
					? {
							...w,
							rect: {
								...w.rect,
								maximized: !w.rect.maximized,
								minimized: false
							}
						}
					: w
			)
		);
	}

	function openApp(app: DesktopApp) {
		startOpen = false;
		commandOpen = false;
		clockOpen = false;
		startQuery = '';
		const existing = windows.find((w) => w.id === app.id);
		if (existing) {
			focusWindow(app.id);
			onopen?.(app.id);
			return;
		}
		const z = nextZ();
		const offset = (windows.length % 6) * 28;
		const def = app.defaultRect ?? {};
		emit([
			...windows,
			{
				id: app.id,
				title: app.title,
				icon: app.icon ?? 'app',
				tone: app.tone,
				kind: app.kind,
				rect: {
					x: def.x ?? 120 + offset,
					y: def.y ?? 36 + offset,
					w: def.w ?? 380,
					h: def.h ?? 280,
					z,
					minimized: false,
					maximized: false
				}
			}
		]);
		activeId = app.id;
		onactivechange?.(app.id);
		onopen?.(app.id);
	}

	function minimizeAll() {
		emit(
			windows.map((w) =>
				w.closed ? w : { ...w, rect: { ...w.rect, minimized: true, maximized: false } }
			)
		);
		activeId = null;
		onactivechange?.(null);
	}

	function cascadeWindows() {
		let i = 0;
		emit(
			windows.map((w) => {
				if (w.closed) return w;
				const next = {
					...w,
					rect: {
						...w.rect,
						x: 120 + i * 28,
						y: 28 + i * 28,
						w: Math.max(300, Math.min(w.rect.w, 420)),
						h: Math.max(220, Math.min(w.rect.h, 320)),
						minimized: false,
						maximized: false,
						z: nextZ()
					}
				};
				i += 1;
				return next;
			})
		);
	}

	function tileWindows() {
		const open = windows.filter((w) => !w.closed);
		if (!open.length) return;
		const bounds = desktopEl?.getBoundingClientRect();
		const width = Math.max(320, (bounds?.width ?? 800) - 180);
		const heightPx = bounds?.height ?? 480;
		const pad = 12;
		const left = showDesktopIcons || showWidgets ? 160 : pad;
		const n = open.length;
		const cols = Math.ceil(Math.sqrt(n));
		const rows = Math.ceil(n / cols);
		const cellW = Math.floor((width - pad * (cols + 1)) / cols);
		const cellH = Math.floor((heightPx - pad * (rows + 1)) / rows);
		let idx = 0;
		emit(
			windows.map((w) => {
				if (w.closed) return w;
				const col = idx % cols;
				const row = Math.floor(idx / cols);
				idx += 1;
				return {
					...w,
					rect: {
						...w.rect,
						x: left + col * (cellW + pad),
						y: pad + row * (cellH + pad),
						w: Math.max(200, cellW),
						h: Math.max(160, cellH),
						minimized: false,
						maximized: false,
						z: nextZ()
					}
				};
			})
		);
	}

	function onCommandSelect(item: CommandItem) {
		const [scope, value] = item.id.split(':');
		if (scope === 'open') {
			const app = launcherApps.find((a) => a.id === value);
			if (app) openApp(app);
			return;
		}
		if (scope === 'focus' && value) {
			focusWindow(value);
			return;
		}
		if (scope === 'layout') {
			if (value === 'cascade') cascadeWindows();
			if (value === 'tile') tileWindows();
			if (value === 'minimize-all') minimizeAll();
			return;
		}
		if (scope === 'wallpaper' && value) {
			wallpaper = value as DesktopWallpaper;
		}
	}

	function onContextSelect(id: string) {
		const target = contextTarget;
		if (id === 'command') {
			commandOpen = true;
			return;
		}
		if (id === 'cascade') {
			cascadeWindows();
			return;
		}
		if (id === 'tile') {
			tileWindows();
			return;
		}
		if (id === 'minimize-all') {
			minimizeAll();
			return;
		}
		if (id === 'toggle-icons') {
			showDesktopIcons = !showDesktopIcons;
			return;
		}
		if (id === 'toggle-widgets' || id === 'hide-widgets') {
			showWidgets = id === 'hide-widgets' ? false : !showWidgets;
			return;
		}
		if (target.type === 'app') {
			if (id === 'open') {
				const app = appById.get(target.id);
				if (app) openApp(app);
			}
			return;
		}
		if (target.type === 'window' || target.type === 'taskbar') {
			const wid = target.id;
			if (id === 'focus') focusWindow(wid);
			if (id === 'minimize') toggleMinimize(wid);
			if (id === 'maximize') toggleMaximize(wid);
			if (id === 'close') closeWindow(wid);
			return;
		}
		if (target.type === 'widget') {
			if (id === 'remove-widget') {
				widgets = widgets.filter((w) => w.id !== target.id);
			}
		}
	}

	function onMenubarSelect(itemId: string, parentId: string) {
		onmenu?.(itemId, parentId);
		if (itemId === 'command') commandOpen = true;
		if (itemId === 'cascade') cascadeWindows();
		if (itemId === 'tile') tileWindows();
		if (itemId === 'minimize-all') minimizeAll();
		if (itemId === 'toggle-icons') showDesktopIcons = !showDesktopIcons;
		if (itemId === 'toggle-widgets') showWidgets = !showWidgets;
		if (itemId === 'close-active' && activeId) closeWindow(activeId);
		if (parentId === 'wallpaper') wallpaper = itemId as DesktopWallpaper;
		if (itemId === 'new-window' && launcherApps[0]) openApp(launcherApps[0]);
	}

	function onDesktopPointerDown(e: MouseEvent) {
		if (e.target !== e.currentTarget) return;
		startOpen = false;
		clockOpen = false;
		activeId = null;
		onactivechange?.(null);
	}

	function resolveIcon(id?: DesktopIconId, kind?: string): DesktopIconId {
		if (id) return id;
		if (kind && ['files', 'mail', 'music', 'notes', 'settings', 'stats', 'calendar', 'terminal', 'team'].includes(kind)) {
			return kind as DesktopIconId;
		}
		return 'app';
	}

	const wallpaperBg = $derived(
		wallpaper === 'custom' && wallpaperUrl
			? `background-image:url(${wallpaperUrl});background-size:cover;background-position:center;`
			: undefined
	);
</script>

<svelte:window onkeydown={onGlobalKey} />

<div
	class={[
		'relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm',
		HEIGHT[height],
		className
	]}
>
	{#if showCommandPalette}
		<CommandPalette
			bind:open={commandOpen}
			items={commandItems}
			placeholder="Search apps, windows, layout…"
			onselect={onCommandSelect}
		/>
	{/if}

	{#if showMenubar}
		<div
			class="relative z-40 flex shrink-0 items-center gap-2 border-b border-border bg-surface-elevated/95 px-2.5 py-1.5 backdrop-blur"
		>
			<BrandMark mark={brandMark} name={brand} size="sm" showName class="hidden sm:inline-flex" />
			<BrandMark mark={brandMark} name={brand} size="sm" class="sm:hidden" />
			<div class="h-4 w-px shrink-0 bg-border" aria-hidden="true"></div>
			<Menubar items={menubarItems} class="min-w-0 flex-1" onselect={onMenubarSelect} />
			{#if showPresence}
				<SessionPresenceBadge size="sm" showLabel={false} />
			{/if}
		</div>
	{/if}

	<ContextMenu items={contextItems} onselect={onContextSelect}>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={desktopEl}
			class={[
				'relative min-h-0 flex-1 overflow-hidden',
				wallpaper !== 'custom' && WALLPAPER_CLASS[wallpaper]
			]}
			style={wallpaperBg}
			onpointerdown={onDesktopPointerDown}
			oncontextmenu={() => {
				contextTarget = { type: 'desktop' };
			}}
		>
			{#if showDesktopIcons && launcherApps.length}
				<div class="absolute left-3 top-3 z-[1] flex w-[4.75rem] flex-col gap-0.5">
					{#each launcherApps.slice(0, 8) as app (app.id)}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							oncontextmenu={(e) => {
								e.stopPropagation();
								contextTarget = { type: 'app', id: app.id };
							}}
						>
							<button
								type="button"
								class="group flex w-full flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-center transition-colors hover:bg-black/10 dark:hover:bg-white/10"
								onclick={(e) => {
									e.stopPropagation();
									openApp(app);
								}}
							>
								<DesktopAppIcon
									icon={resolveIcon(app.icon, app.kind)}
									tone={app.tone ?? 'brand'}
									size="lg"
								/>
								<span
									class="line-clamp-2 w-full text-center text-[10px] font-medium leading-tight text-primary"
								>
									{app.title}
								</span>
							</button>
						</div>
					{/each}
				</div>
			{/if}

			{#if showWidgets}
				<div class="pointer-events-none absolute right-3 top-3 z-[1] flex w-44 flex-col gap-2">
					{#each widgets as widget (widget.id)}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="pointer-events-auto rounded-xl border border-border/70 bg-surface-elevated/90 p-3 shadow-sm backdrop-blur"
							onpointerdown={(e) => e.stopPropagation()}
							oncontextmenu={(e) => {
								e.stopPropagation();
								contextTarget = { type: 'widget', id: widget.id };
							}}
						>
							{#if widget.kind === 'weather'}
								<div class="flex items-start gap-2">
									<span
										class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-700 dark:text-sky-300"
									>
										<CloudSun class="h-[18px] w-[18px]" strokeWidth={2} />
									</span>
									<div class="min-w-0">
										<p class="text-xs font-medium text-muted">{widget.title ?? 'Weather'}</p>
										<p class="text-lg font-semibold tabular-nums text-primary">22°</p>
										<p class="text-[11px] text-secondary">Partly cloudy</p>
									</div>
								</div>
							{:else if widget.kind === 'sticky'}
								<p class="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
									{widget.title ?? 'Sticky'}
								</p>
								<p class="mt-1 whitespace-pre-line text-xs leading-relaxed text-primary">
									{widget.body ?? 'Add a note…'}
								</p>
							{:else if widget.kind === 'stats'}
								<p class="mb-2 text-[11px] font-medium text-muted">{widget.title ?? 'Stats'}</p>
								<div class="space-y-1">
									<StatCard label="Active" value="128" delta="+4%" trend="up" variant="ghost" class="!p-2" />
								</div>
							{:else}
								<p class="text-sm font-semibold tabular-nums text-primary">{clock}</p>
								<p class="text-[11px] text-muted">{clockDate}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			{#each openWindows as win (win.id)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="contents"
					oncontextmenu={(e) => {
						e.stopPropagation();
						contextTarget = { type: 'window', id: win.id };
					}}
				>
					<FloatingWindow
						title={win.title}
						rect={win.rect}
						active={activeId === win.id}
						closable={win.closable !== false}
						minimizable={win.minimizable !== false}
						maximizable={win.maximizable !== false}
						onfocus={() => focusWindow(win.id)}
						onclose={() => closeWindow(win.id)}
						onminimize={() => toggleMinimize(win.id)}
						onchange={(rect) => updateRect(win.id, rect)}
					>
						{#if render}
							{@render render(win)}
						{:else}
							<div class="space-y-2 p-4 text-sm text-secondary">
								<p class="font-medium text-primary">{win.title}</p>
								<p class="text-xs text-muted">Right-click for context actions · ⌘K for commands.</p>
							</div>
						{/if}
					</FloatingWindow>
				</div>
			{/each}

			{#if startOpen}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="absolute bottom-3 left-3 z-[1000] flex w-[19rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated/95 shadow-xl backdrop-blur"
					onpointerdown={(e) => e.stopPropagation()}
				>
					<div class="flex items-center gap-2 border-b border-border px-3 py-2.5">
						<BrandMark mark={brandMark} name={brand} size="sm" showName />
					</div>

					<div class="space-y-2 p-2.5">
						<SearchInput bind:value={startQuery} placeholder="Search apps…" size="sm" />

						<div class="max-h-56 space-y-0.5 overflow-y-auto">
							{#if !filteredApps.length}
								<p class="px-2 py-4 text-center text-xs text-muted">No apps found</p>
							{:else}
								{#each filteredApps as app (app.id)}
									<Tile
										title={app.title}
										description={app.description}
										variant="flush"
										size="sm"
										dense
										chevron={false}
										onclick={() => openApp(app)}
									>
										{#snippet leading()}
											<DesktopAppIcon
												icon={resolveIcon(app.icon, app.kind)}
												tone={app.tone ?? 'brand'}
												size="sm"
												elevated={false}
											/>
										{/snippet}
									</Tile>
								{/each}
							{/if}
						</div>
					</div>

					<div class="flex items-center gap-1 border-t border-border p-1.5">
						<Tooltip content="Cascade">
							<IconButton label="Cascade windows" size="sm" onclick={cascadeWindows}>
								<Layers class="h-4 w-4" strokeWidth={2} />
							</IconButton>
						</Tooltip>
						<Tooltip content="Tile">
							<IconButton label="Tile windows" size="sm" onclick={tileWindows}>
								<LayoutGrid class="h-4 w-4" strokeWidth={2} />
							</IconButton>
						</Tooltip>
						<Tooltip content="Minimize all">
							<IconButton label="Minimize all" size="sm" onclick={minimizeAll}>
								<Minimize2 class="h-4 w-4" strokeWidth={2} />
							</IconButton>
						</Tooltip>
						<div class="min-w-0 flex-1"></div>
						<button
							type="button"
							class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-muted hover:bg-surface-overlay hover:text-secondary"
							onclick={() => {
								startOpen = false;
								commandOpen = true;
							}}
						>
							<Search class="h-3.5 w-3.5" strokeWidth={2} />
							<Kbd keys={['⌘', 'K']} size="sm" />
						</button>
					</div>
				</div>
			{/if}
		</div>

		{#if showTaskbar}
			<div
				class="relative z-40 flex shrink-0 items-center gap-2 border-t border-border bg-surface-elevated/95 px-2 py-2 backdrop-blur sm:px-3"
			>
				{#if showStart}
					<Tooltip content="Start" side="top">
						<IconButton
							label="Start menu"
							size="sm"
							variant={startOpen ? 'primary' : 'ghost'}
							rounded
							onclick={(e) => {
								e.stopPropagation();
								commandOpen = false;
								clockOpen = false;
								startOpen = !startOpen;
							}}
						>
							<Grid2x2 class="h-4 w-4" strokeWidth={2} />
						</IconButton>
					</Tooltip>
				{/if}

				{#if showCommandPalette}
					<Tooltip content="Command palette (⌘K)" side="top">
						<IconButton
							label="Open command palette"
							size="sm"
							variant="ghost"
							rounded
							onclick={() => {
								startOpen = false;
								clockOpen = false;
								commandOpen = true;
							}}
						>
							<Search class="h-4 w-4" strokeWidth={2} />
						</IconButton>
					</Tooltip>
				{/if}

				{#if taskbarLeading}
					{@render taskbarLeading()}
				{/if}

				<div class="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-1">
					<div
						class="inline-flex items-center gap-0.5 rounded-2xl border border-border/70 bg-surface/70 p-1 shadow-sm"
					>
						{#each visibleTaskbar as win (win.id)}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								oncontextmenu={(e) => {
									e.stopPropagation();
									contextTarget = { type: 'taskbar', id: win.id };
								}}
							>
								<Tooltip content={win.rect.minimized ? `Restore ${win.title}` : win.title}>
									<button
										type="button"
										class={[
											'relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
											activeId === win.id && !win.rect.minimized
												? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
												: 'text-secondary hover:bg-surface-overlay hover:text-primary',
											win.rect.minimized && 'opacity-55'
										]}
										aria-label={win.title}
										onclick={() => toggleMinimize(win.id)}
									>
										<DesktopAppIcon
											icon={resolveIcon(win.icon, win.kind)}
											size="sm"
											surface="ghost"
											elevated={false}
											class="!h-5 !w-5"
										/>
										{#if activeId === win.id && !win.rect.minimized}
											<span
												class="absolute inset-x-2 bottom-0.5 h-0.5 rounded-full bg-brand-500"
												aria-hidden="true"
											></span>
										{/if}
									</button>
								</Tooltip>
							</div>
						{/each}

						{#if overflowTaskbar.length}
							<DropdownMenu
								items={overflowItems}
								size="sm"
								align="end"
								side="top"
								label={`+${overflowTaskbar.length}`}
								onselect={(id) => toggleMinimize(id)}
							>
								{#snippet trigger()}
									<span
										class="flex h-9 w-9 items-center justify-center rounded-xl text-secondary hover:bg-surface-overlay"
										aria-label={`More windows (${overflowTaskbar.length})`}
									>
										<MoreHorizontal class="h-4 w-4" strokeWidth={2} />
									</span>
								{/snippet}
							</DropdownMenu>
						{/if}
					</div>
				</div>

				<div class="flex shrink-0 items-center gap-1.5">
					{#if showWindowCount}
						<Badge size="sm" variant="secondary" class="tabular-nums">
							{taskbarWindows.length - minimizedCount}/{taskbarWindows.length}
						</Badge>
					{/if}

					{#if taskbarTrailing}
						{@render taskbarTrailing()}
					{:else if showUserMenu}
						<UserMenu
							name={userName}
							email={userEmail}
							size="sm"
							variant="ghost"
							align="end"
							showSubtitle={false}
							showChevron={false}
							items={userItems}
							onselect={(id) => onuseraction?.(id)}
						/>
					{/if}

					{#if showClock}
						<Popover
							bind:open={clockOpen}
							placement="top"
							align="end"
							strategy="fixed"
							offset={12}
							panelClass="!w-[17.5rem]"
						>
							{#snippet trigger()}
								<button
									type="button"
									data-popover-trigger
									class="flex min-w-[4.5rem] flex-col items-end rounded-xl px-2.5 py-1 text-right transition-colors hover:bg-surface-overlay"
									aria-expanded={clockOpen}
									aria-haspopup="dialog"
									onclick={() => {
										startOpen = false;
										clockOpen = !clockOpen;
									}}
								>
									<span class="text-xs font-semibold tabular-nums text-primary">{clock}</span>
									<span class="text-[10px] text-muted">{clockDate}</span>
								</button>
							{/snippet}
							<div class="space-y-3">
								<div class="border-b border-border pb-2">
									<p class="text-2xl font-semibold tabular-nums tracking-tight text-primary">
										{clock}
									</p>
									<p class="text-sm text-secondary">{clockDate}</p>
								</div>
								<Calendar bind:value={calendarValue} framed={false} class="!p-0" />
							</div>
						</Popover>
					{/if}
				</div>
			</div>
		{/if}
	</ContextMenu>
</div>
