<script lang="ts">
	import type { Snippet } from 'svelte';
	import FloatingWindow from '$lib/components/molecules/FloatingWindow/FloatingWindow.svelte';
	import type { WindowRect } from '$lib/components/molecules/FloatingWindow/FloatingWindow.svelte';

	export interface DesktopWindow {
		id: string;
		title: string;
		rect: WindowRect;
		closed?: boolean;
	}

	interface DesktopShellProps {
		windows?: DesktopWindow[];
		activeId?: string | null;
		wallpaper?: string;
		showTaskbar?: boolean;
		class?: string;
		/** Render window body by id */
		render?: Snippet<[DesktopWindow]>;
		taskbarLeading?: Snippet;
		taskbarTrailing?: Snippet;
		onchange?: (windows: DesktopWindow[]) => void;
		onactivechange?: (id: string | null) => void;
	}

	let {
		windows = $bindable([] as DesktopWindow[]),
		activeId = $bindable<string | null>(null),
		wallpaper,
		showTaskbar = true,
		class: className = '',
		render,
		taskbarLeading,
		taskbarTrailing,
		onchange,
		onactivechange
	}: DesktopShellProps = $props();

	let zCounter = $state(10);

	const openWindows = $derived(windows.filter((w) => !w.closed));
	const taskbarWindows = $derived(windows.filter((w) => !w.closed));

	function emit(next: DesktopWindow[]) {
		windows = next;
		onchange?.(next);
	}

	function focusWindow(id: string) {
		zCounter += 1;
		emit(
			windows.map((w) =>
				w.id === id
					? { ...w, rect: { ...w.rect, z: zCounter, minimized: false }, closed: false }
					: w
			)
		);
		activeId = id;
		onactivechange?.(id);
	}

	function updateRect(id: string, rect: WindowRect) {
		emit(windows.map((w) => (w.id === id ? { ...w, rect: { ...rect, z: rect.z ?? w.rect.z } } : w)));
	}

	function closeWindow(id: string) {
		emit(windows.map((w) => (w.id === id ? { ...w, closed: true } : w)));
		if (activeId === id) {
			activeId = null;
			onactivechange?.(null);
		}
	}

	function toggleMinimize(id: string) {
		const win = windows.find((w) => w.id === id);
		if (!win) return;
		if (win.rect.minimized) {
			focusWindow(id);
			return;
		}
		emit(
			windows.map((w) =>
				w.id === id ? { ...w, rect: { ...w.rect, minimized: true, maximized: false } } : w
			)
		);
	}

	const desktopStyle = $derived(
		wallpaper
			? `background-image:url(${wallpaper});background-size:cover;background-position:center;`
			: undefined
	);
</script>

<div
	class={[
		'relative flex h-[36rem] w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface',
		className
	]}
>
	<div class="relative min-h-0 flex-1 overflow-hidden" style={desktopStyle}>
		{#if !wallpaper}
			<div
				class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-brand-500)_0%,transparent_55%)] opacity-[0.12]"
				aria-hidden="true"
			></div>
			<div
				class="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,var(--surface-overlay),transparent_40%,var(--surface))]"
				aria-hidden="true"
			></div>
		{/if}

		{#each openWindows as win (win.id)}
			<FloatingWindow
				title={win.title}
				rect={win.rect}
				active={activeId === win.id}
				onfocus={() => focusWindow(win.id)}
				onclose={() => closeWindow(win.id)}
				onminimize={() => toggleMinimize(win.id)}
				onchange={(rect) => updateRect(win.id, rect)}
			>
				{#if render}
					{@render render(win)}
				{:else}
					<div class="p-4 text-sm text-muted">App content</div>
				{/if}
			</FloatingWindow>
		{/each}
	</div>

	{#if showTaskbar}
		<div
			class="flex shrink-0 items-center gap-2 border-t border-border bg-surface-elevated/95 px-3 py-2 backdrop-blur"
		>
			{#if taskbarLeading}
				{@render taskbarLeading()}
			{/if}
			<div class="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
				{#each taskbarWindows as win (win.id)}
					<button
						type="button"
						class={[
							'inline-flex max-w-[10rem] items-center truncate rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
							activeId === win.id && !win.rect.minimized
								? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
								: 'text-secondary hover:bg-surface-overlay'
						]}
						onclick={() => toggleMinimize(win.id)}
					>
						{win.title}
					</button>
				{/each}
			</div>
			{#if taskbarTrailing}
				{@render taskbarTrailing()}
			{/if}
		</div>
	{/if}
</div>
