<script lang="ts">
	import { on } from 'svelte/events';
	import NotificationRow from '$lib/components/molecules/NotificationRow/NotificationRow.svelte';

	export interface NotificationItem {
		id: string;
		title: string;
		description?: string;
		time?: string | Date | number;
		read?: boolean;
		href?: string;
		avatar?: string;
		actor?: string;
		type?: 'info' | 'success' | 'warning' | 'error';
	}

	export interface NotificationCenterLabels {
		title?: string;
		/** Badge next to the title. `{n}` is replaced with unread count. */
		newCount?: string;
		markAllRead?: string;
		clearAll?: string;
		empty?: string;
		/** Trigger aria-label when there are no unread items */
		trigger?: string;
		/** Appended to trigger aria-label when unread. `{n}` is unread count. */
		unreadSuffix?: string;
	}

	interface NotificationCenterProps {
		id?: string;
		items?: NotificationItem[];
		open?: boolean;
		class?: string;
		labels?: NotificationCenterLabels;
		showClear?: boolean;
		onitemclick?: (item: NotificationItem) => void;
		onmarkallread?: () => void;
		onclear?: () => void;
	}

	let {
		id,
		items = $bindable([]),
		open = $bindable(false),
		class: className = '',
		showClear = true,
		labels = {},
		onitemclick,
		onmarkallread,
		onclear
	}: NotificationCenterProps = $props();

	let triggerEl = $state<HTMLButtonElement | null>(null);
	let popoverEl = $state<HTMLDivElement | null>(null);
	let popoverStyle = $state('');

	const baseId = $derived(id ?? `notif-${Math.random().toString(36).slice(2, 9)}`);
	const popoverId = $derived(`${baseId}-popover`);
	const unreadCount = $derived(items.filter((n) => !n.read).length);

	const DEFAULT_LABELS: Required<NotificationCenterLabels> = {
		title: 'Notifications',
		newCount: '{n} new',
		markAllRead: 'Mark all read',
		clearAll: 'Clear all',
		empty: 'No notifications',
		trigger: 'Notifications',
		unreadSuffix: ', {n} unread'
	};

	const copy = $derived({ ...DEFAULT_LABELS, ...labels });

	function withCount(template: string, n: number) {
		return template.replaceAll('{n}', String(n));
	}

	function positionPopover() {
		if (!triggerEl || !popoverEl) return;
		if (!popoverEl.matches(':popover-open')) return;

		const rect = triggerEl.getBoundingClientRect();
		const gap = 8;
		const margin = 8;
		const w = Math.min(360, window.innerWidth - margin * 2);
		const leftPos = Math.max(margin, Math.min(rect.right - w, window.innerWidth - w - margin));
		const spaceBelow = window.innerHeight - rect.bottom - gap - margin;
		const spaceAbove = rect.top - gap - margin;
		const openUp = spaceBelow < 240 && spaceAbove > spaceBelow;
		const maxH = Math.min(480, openUp ? spaceAbove : spaceBelow);

		popoverStyle = [
			'position:fixed',
			`left:${leftPos}px`,
			`width:${w}px`,
			openUp ? 'top:auto' : `top:${rect.bottom + gap}px`,
			openUp ? `bottom:${window.innerHeight - rect.top + gap}px` : 'bottom:auto',
			`max-height:${Math.max(200, maxH)}px`
		].join(';');
	}

	function handleBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open') {
			// no-op; positioning happens after open
		}
	}

	function handleToggle(event: ToggleEvent) {
		open = event.newState === 'open';
		if (open) {
			queueMicrotask(() => {
				positionPopover();
				requestAnimationFrame(() => positionPopover());
			});
		}
	}

	function handleItemClick(item: NotificationItem) {
		items = items.map((n) => (n.id === item.id ? { ...n, read: true } : n));
		onitemclick?.(item);
	}

	function markAllRead() {
		items = items.map((n) => ({ ...n, read: true }));
		onmarkallread?.();
	}

	function clear() {
		items = [];
		onclear?.();
		popoverEl?.hidePopover();
	}

	$effect(() => {
		if (!open) return;

		let frame = 0;
		const reposition = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => positionPopover());
		};

		const offScroll = on(window, 'scroll', reposition, { capture: true, passive: true });
		const offResize = on(window, 'resize', reposition);

		return () => {
			cancelAnimationFrame(frame);
			offScroll();
			offResize();
		};
	});

	// Keep popover in sync if `open` is controlled externally
	$effect(() => {
		if (!popoverEl) return;
		const isOpen = popoverEl.matches(':popover-open');
		if (open && !isOpen) {
			popoverEl.showPopover();
		} else if (!open && isOpen) {
			popoverEl.hidePopover();
		}
	});
</script>

<div class={['relative inline-flex', className]}>
	<button
		bind:this={triggerEl}
		id={baseId}
		type="button"
		popovertarget={popoverId}
		popovertargetaction="toggle"
		aria-label="{copy.trigger}{unreadCount > 0 ? withCount(copy.unreadSuffix, unreadCount) : ''}"
		aria-expanded={open}
		aria-controls={popoverId}
		class="relative flex h-9 w-9 items-center justify-center rounded-lg text-secondary outline-none transition-colors hover:bg-surface-overlay hover:text-primary focus-visible:ring-2 focus-visible:ring-brand-500/30"
	>
		<svg
			class="h-5 w-5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
			/>
		</svg>
		{#if unreadCount > 0}
			<span
				class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold leading-none text-white"
			>
				{unreadCount > 9 ? '9+' : unreadCount}
			</span>
		{/if}
	</button>

	<div
		bind:this={popoverEl}
		id={popoverId}
		popover="auto"
		onbeforetoggle={handleBeforeToggle}
		ontoggle={handleToggle}
		style={popoverStyle}
		class="notif-panel inset-auto m-0 flex flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-2xl outline-none"
		role="dialog"
		aria-label={copy.title}
	>
		<div class="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
			<div class="flex items-center gap-2">
				<h3 class="text-sm font-semibold text-primary">{copy.title}</h3>
				{#if unreadCount > 0}
					<span
						class="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-900 dark:text-brand-400"
					>
						{withCount(copy.newCount, unreadCount)}
					</span>
				{/if}
			</div>
			<div class="flex items-center gap-1">
				{#if unreadCount > 0}
					<button
						type="button"
						onclick={markAllRead}
						class="rounded-lg px-2 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-surface-overlay dark:text-brand-400"
					>
						{copy.markAllRead}
					</button>
				{/if}
				{#if showClear && items.length > 0}
					<button
						type="button"
						onclick={clear}
						class="rounded-lg px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-overlay hover:text-primary"
					>
						{copy.clearAll}
					</button>
				{/if}
			</div>
		</div>

		<div class="min-h-0 flex-1 overflow-y-auto">
			{#if items.length === 0}
				<div class="flex flex-col items-center justify-center gap-2 px-4 py-12">
					<svg
						class="h-10 w-10 text-muted opacity-50"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						/>
					</svg>
					<p class="text-sm text-muted">{copy.empty}</p>
				</div>
			{:else}
				<div class="divide-y divide-border">
					{#each items as item (item.id)}
						<NotificationRow
							{item}
							density="compact"
							class="rounded-none"
							onclick={handleItemClick}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.notif-panel {
		position: fixed;
	}

	.notif-panel:popover-open {
		display: flex;
	}

	.notif-panel:not(:popover-open) {
		display: none;
	}
</style>
