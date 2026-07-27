<script lang="ts">
	import type { Component } from 'svelte';
	import Folder from '@lucide/svelte/icons/folder';
	import Mail from '@lucide/svelte/icons/mail';
	import Music from '@lucide/svelte/icons/music';
	import StickyNote from '@lucide/svelte/icons/sticky-note';
	import Settings from '@lucide/svelte/icons/settings';
	import ChartColumn from '@lucide/svelte/icons/chart-column';
	import AppWindow from '@lucide/svelte/icons/app-window';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Terminal from '@lucide/svelte/icons/terminal';
	import Users from '@lucide/svelte/icons/users';

	export type DesktopIconId =
		| 'files'
		| 'mail'
		| 'music'
		| 'notes'
		| 'settings'
		| 'stats'
		| 'calendar'
		| 'terminal'
		| 'team'
		| 'app';

	export type DesktopAppIconSize = 'sm' | 'md' | 'lg';
	export type DesktopAppIconTone =
		| 'brand'
		| 'sky'
		| 'emerald'
		| 'amber'
		| 'rose'
		| 'violet'
		| 'neutral';
	/** soft = tinted tile · plain = neutral tile · ghost = icon only (taskbar) */
	export type DesktopAppIconSurface = 'soft' | 'plain' | 'ghost';

	const ICONS: Record<DesktopIconId, Component<{ class?: string; strokeWidth?: number }>> = {
		files: Folder,
		mail: Mail,
		music: Music,
		notes: StickyNote,
		settings: Settings,
		stats: ChartColumn,
		calendar: Calendar,
		terminal: Terminal,
		team: Users,
		app: AppWindow
	};

	const TONE_SOFT: Record<DesktopAppIconTone, string> = {
		brand: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
		sky: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
		emerald: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
		amber: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
		rose: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
		violet: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
		neutral: 'bg-surface-overlay text-secondary'
	};

	const BOX: Record<DesktopAppIconSize, string> = {
		sm: 'h-8 w-8 rounded-lg',
		md: 'h-10 w-10 rounded-xl',
		lg: 'h-11 w-11 rounded-xl'
	};

	const GLYPH: Record<DesktopAppIconSize, string> = {
		sm: 'h-4 w-4',
		md: 'h-[18px] w-[18px]',
		lg: 'h-5 w-5'
	};

	interface DesktopAppIconProps {
		icon?: DesktopIconId;
		iconComponent?: Component<{ class?: string; strokeWidth?: number }>;
		tone?: DesktopAppIconTone;
		size?: DesktopAppIconSize;
		surface?: DesktopAppIconSurface;
		elevated?: boolean;
		class?: string;
	}

	let {
		icon = 'app',
		iconComponent,
		tone = 'brand',
		size = 'md',
		surface = 'soft',
		elevated = true,
		class: className = ''
	}: DesktopAppIconProps = $props();

	const Icon = $derived(iconComponent ?? ICONS[icon] ?? ICONS.app);

	const surfaceClass = $derived.by(() => {
		if (surface === 'ghost') return 'bg-transparent text-current';
		if (surface === 'plain') return 'bg-surface-overlay/80 text-secondary';
		return TONE_SOFT[tone];
	});
</script>

<span
	class={[
		'inline-flex shrink-0 items-center justify-center',
		BOX[size],
		surfaceClass,
		elevated && surface !== 'ghost' && 'border border-border/40 shadow-sm',
		className
	]}
	aria-hidden="true"
>
	<Icon class={GLYPH[size]} strokeWidth={2} />
</span>
