<script lang="ts">
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
		items?: NotificationItem[];
		open?: boolean;
		class?: string;
		onitemclick?: (item: NotificationItem) => void;
		onmarkallread?: () => void;
		onclear?: () => void;
	}

	let {
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

	const unreadCount = $derived(items.filter((n) => !n.read).length);

	const typeColors: Record<string, string> = {
		info: 'bg-sky-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500'
	};

	function positionPopover() {
		if (!triggerEl) return;
		const rect = triggerEl.getBoundingClientRect();
		const gap = 8;
		const w = 360;
		const leftPos = Math.max(8, Math.min(rect.right - w, window.innerWidth - w - 8));
		popoverStyle = [
			`top: ${rect.bottom + gap}px`,
			`left: ${leftPos}px`,
			`width: ${w}px`
		].join('; ');
	}

	function toggle() {
		if (open) {
			if (popoverEl?.matches(':popover-open')) popoverEl.hidePopover();
		} else {
			positionPopover();
			if (popoverEl && !popoverEl.matches(':popover-open')) popoverEl.showPopover();
		}
	}

	function handleToggle(e: ToggleEvent) {
		open = e.newState === 'open';
	}

	function handleItemClick(item: NotificationItem) {
		items = items.map((n) => n.id === item.id ? { ...n, read: true } : n);
		onitemclick?.(item);
	}

	function markAllRead() {
		items = items.map((n) => ({ ...n, read: true }));
		onmarkallread?.();
	}

	function clear() {
		items = [];
		onclear?.();
		if (popoverEl?.matches(':popover-open')) popoverEl.hidePopover();
	}
</script>

<div class={['relative', className]}>
	<button
		bind:this={triggerEl}
		type="button"
		onclick={toggle}
		popovertarget="notif-popover"
		aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
		class="relative flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-overlay hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
	>
		<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
		</svg>
		{#if unreadCount > 0}
			<span class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white leading-none">
				{unreadCount > 9 ? '9+' : unreadCount}
			</span>
		{/if}
	</button>

	<div
		bind:this={popoverEl}
		id="notif-popover"
		popover="auto"
		ontoggle={handleToggle}
		style={popoverStyle}
		class="notif-panel m-0 flex flex-col rounded-xl border border-border bg-surface-elevated shadow-2xl outline-none overflow-hidden"
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-border px-4 py-3">
			<div class="flex items-center gap-2">
				<h3 class="text-sm font-semibold text-primary">Notifications</h3>
				{#if unreadCount > 0}
					<span class="rounded-full bg-brand-100 dark:bg-brand-900 px-2 py-0.5 text-xs font-medium text-brand-600 dark:text-brand-400">
						{unreadCount} new
					</span>
				{/if}
			</div>
			<div class="flex items-center gap-1">
				{#if unreadCount > 0}
					<button
						type="button"
						onclick={markAllRead}
						class="rounded-lg px-2 py-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-surface-overlay transition-colors"
					>
						Mark all read
					</button>
				{/if}
				{#if items.length > 0}
					<button
						type="button"
						onclick={clear}
						class="rounded-lg px-2 py-1 text-xs font-medium text-muted hover:text-primary hover:bg-surface-overlay transition-colors"
					>
						Clear all
					</button>
				{/if}
			</div>
		</div>

		<!-- List -->
		<div class="max-h-[420px] overflow-y-auto">
			{#if items.length === 0}
				<div class="flex flex-col items-center justify-center gap-2 py-12 px-4">
					<svg class="h-10 w-10 text-muted opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
					</svg>
					<p class="text-sm text-muted">No notifications</p>
				</div>
			{:else}
				{#each items as item (item.id)}
					<button
						type="button"
						onclick={() => handleItemClick(item)}
						class={[
							'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-overlay border-b border-border last:border-b-0',
							!item.read && 'bg-brand-50/50 dark:bg-brand-950/20'
						]}
					>
						<!-- Avatar or type dot -->
						<div class="relative mt-0.5 shrink-0">
							{#if item.avatar}
								<img src={item.avatar} alt="" class="h-9 w-9 rounded-full object-cover" />
							{:else}
								<div class={['h-9 w-9 rounded-full flex items-center justify-center', typeColors[item.type ?? 'info'] ?? 'bg-brand-500']}>
									{#if item.type === 'success'}
										<svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
									{:else if item.type === 'warning'}
										<svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
									{:else if item.type === 'error'}
										<svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
									{:else}
										<svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
									{/if}
								</div>
							{/if}
							{#if !item.read}
								<span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-elevated bg-brand-500"></span>
							{/if}
						</div>

						<div class="min-w-0 flex-1">
							<p class={['text-sm leading-snug', !item.read ? 'font-semibold text-primary' : 'font-medium text-primary']}>
								{item.title}
							</p>
							{#if item.description}
								<p class="mt-0.5 text-xs text-secondary leading-relaxed line-clamp-2">{item.description}</p>
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
	.notif-panel:not(:popover-open) {
		display: none;
	}
</style>
