<script lang="ts">
	import { on } from 'svelte/events';

	export interface NotificationItem {
		id: string;
		title: string;
		description?: string;
		time?: string;
		read?: boolean;
		href?: string;
		avatar?: string;
		type?: 'info' | 'success' | 'warning' | 'error';
	}

	interface NotificationCenterProps {
		id?: string;
		items?: NotificationItem[];
		open?: boolean;
		class?: string;
		onitemclick?: (item: NotificationItem) => void;
		onmarkallread?: () => void;
		onclear?: () => void;
	}

	let {
		id,
		items = $bindable([]),
		open = $bindable(false),
		class: className = '',
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

	const typeColors: Record<string, string> = {
		info: 'bg-sky-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500'
	};

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
		aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
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
		aria-label="Notifications"
	>
		<div class="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
			<div class="flex items-center gap-2">
				<h3 class="text-sm font-semibold text-primary">Notifications</h3>
				{#if unreadCount > 0}
					<span
						class="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-900 dark:text-brand-400"
					>
						{unreadCount} new
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
						Mark all read
					</button>
				{/if}
				{#if items.length > 0}
					<button
						type="button"
						onclick={clear}
						class="rounded-lg px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-overlay hover:text-primary"
					>
						Clear all
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
					<p class="text-sm text-muted">No notifications</p>
				</div>
			{:else}
				{#each items as item (item.id)}
					<button
						type="button"
						onclick={() => handleItemClick(item)}
						class={[
							'flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-overlay',
							!item.read && 'bg-brand-50/50 dark:bg-brand-950/20'
						]}
					>
						<div class="relative mt-0.5 shrink-0">
							{#if item.avatar}
								<img src={item.avatar} alt="" class="h-9 w-9 rounded-full object-cover" />
							{:else}
								<div
									class={[
										'flex h-9 w-9 items-center justify-center rounded-full',
										typeColors[item.type ?? 'info'] ?? 'bg-brand-500'
									]}
								>
									{#if item.type === 'success'}
										<svg
											class="h-4 w-4 text-white"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.5"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M5 13l4 4L19 7"
											/></svg
										>
									{:else if item.type === 'warning'}
										<svg
											class="h-4 w-4 text-white"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
											/></svg
										>
									{:else if item.type === 'error'}
										<svg
											class="h-4 w-4 text-white"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.5"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M6 18L18 6M6 6l12 12"
											/></svg
										>
									{:else}
										<svg
											class="h-4 w-4 text-white"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/></svg
										>
									{/if}
								</div>
							{/if}
							{#if !item.read}
								<span
									class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-elevated bg-brand-500"
								></span>
							{/if}
						</div>

						<div class="min-w-0 flex-1">
							<p
								class={[
									'text-sm leading-snug text-primary',
									!item.read ? 'font-semibold' : 'font-medium'
								]}
							>
								{item.title}
							</p>
							{#if item.description}
								<p class="mt-0.5 line-clamp-2 text-xs leading-relaxed text-secondary">
									{item.description}
								</p>
							{/if}
							{#if item.time}
								<p class="mt-1 text-[11px] text-muted">{item.time}</p>
							{/if}
						</div>
					</button>
				{/each}
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
