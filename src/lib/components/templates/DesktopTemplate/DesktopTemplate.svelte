<script lang="ts">
	import type { Snippet } from 'svelte';
	import DesktopShell from '$lib/components/organisms/DesktopShell/DesktopShell.svelte';
	import type { DesktopWindow } from '$lib/components/organisms/DesktopShell/DesktopShell.svelte';
	import SessionPresenceBadge from '$lib/components/molecules/SessionPresenceBadge/SessionPresenceBadge.svelte';
	import OfflineBanner from '$lib/components/molecules/OfflineBanner/OfflineBanner.svelte';
	import BrandMark from '$lib/components/atoms/BrandMark/BrandMark.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface DesktopTemplateProps {
		brand?: string;
		windows?: DesktopWindow[];
		activeId?: string | null;
		showPresence?: boolean;
		showOfflineBanner?: boolean;
		class?: string;
		menubar?: Snippet;
		render?: Snippet<[DesktopWindow]>;
		onchange?: (windows: DesktopWindow[]) => void;
	}

	const DEMO_WINDOWS: DesktopWindow[] = [
		{
			id: 'files',
			title: 'Files',
			rect: { x: 24, y: 24, w: 360, h: 280, z: 2 }
		},
		{
			id: 'notes',
			title: 'Notes',
			rect: { x: 220, y: 80, w: 380, h: 300, z: 3 }
		},
		{
			id: 'settings',
			title: 'Settings',
			rect: { x: 420, y: 40, w: 340, h: 260, z: 1 }
		},
		{
			id: 'dashboard',
			title: 'Dashboard',
			rect: { x: 80, y: 140, w: 480, h: 320, z: 4 }
		}
	];

	let {
		brand = 'Desktop',
		windows = $bindable(DEMO_WINDOWS.map((w) => ({ ...w, rect: { ...w.rect } }))),
		activeId = $bindable<string | null>('dashboard'),
		showPresence = true,
		showOfflineBanner = true,
		class: className = '',
		menubar,
		render,
		onchange
	}: DesktopTemplateProps = $props();

	function reopen(id: string, title: string) {
		const existing = windows.find((w) => w.id === id);
		if (existing) {
			windows = windows.map((w) =>
				w.id === id ? { ...w, closed: false, rect: { ...w.rect, minimized: false } } : w
			);
			activeId = id;
			return;
		}
		windows = [
			...windows,
			{
				id,
				title,
				rect: { x: 60 + windows.length * 24, y: 48 + windows.length * 20, w: 380, h: 280, z: 20 }
			}
		];
		activeId = id;
	}
</script>

<div class={['space-y-3', className]}>
	{#if showOfflineBanner}
		<OfflineBanner />
	{/if}

	<div
		class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-elevated px-3 py-2"
	>
		<div class="flex min-w-0 items-center gap-2">
			<BrandMark size="sm" />
			<span class="truncate text-sm font-semibold text-primary">{brand}</span>
			{#if menubar}
				<div class="ml-2 hidden items-center gap-1 sm:flex">
					{@render menubar()}
				</div>
			{:else}
				<div class="ml-2 hidden items-center gap-1 sm:flex">
					<Button size="xs" variant="ghost" onclick={() => reopen('files', 'Files')}>Files</Button>
					<Button size="xs" variant="ghost" onclick={() => reopen('notes', 'Notes')}>Notes</Button>
					<Button size="xs" variant="ghost" onclick={() => reopen('settings', 'Settings')}>
						Settings
					</Button>
					<Button size="xs" variant="ghost" onclick={() => reopen('dashboard', 'Dashboard')}>
						Dashboard
					</Button>
				</div>
			{/if}
		</div>
		{#if showPresence}
			<SessionPresenceBadge size="sm" />
		{/if}
	</div>

	<DesktopShell bind:windows bind:activeId {render} onchange={onchange} class="h-[40rem]">
		{#snippet taskbarTrailing()}
			{#if showPresence}
				<SessionPresenceBadge size="sm" showLabel={false} />
			{/if}
		{/snippet}
	</DesktopShell>
</div>
