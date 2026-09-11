<script lang="ts">
	import type { Snippet } from 'svelte';
	import { on } from 'svelte/events';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';
	import { createId } from '$lib/utils/id.js';

	export interface UserMenuItem {
		id: string;
		label: string;
		description?: string;
		shortcut?: string;
		disabled?: boolean;
		destructive?: boolean;
		separator?: boolean;
	}

	type UserStatus = 'online' | 'offline' | 'busy' | 'away' | null;

	interface UserMenuProps {
		name?: string;
		email?: string;
		role?: string;
		plan?: string;
		src?: string;
		status?: UserStatus;
		items?: UserMenuItem[];
		size?: 'sm' | 'md' | 'lg';
		/** `ghost` for navbars; `outline` for standalone */
		variant?: 'ghost' | 'outline';
		align?: 'start' | 'end';
		/** Open menu above (`top`) or below (`bottom`) the trigger */
		side?: 'top' | 'bottom';
		showMeta?: boolean;
		/** Show email/role under the name in the trigger */
		showSubtitle?: boolean;
		showChevron?: boolean;
		open?: boolean;
		class?: string;
		header?: Snippet;
		onselect?: (id: string, item: UserMenuItem) => void;
		onopenchange?: (open: boolean) => void;
	}

	const defaultItems: UserMenuItem[] = [
		{ id: 'profile', label: 'Your profile', description: 'Public info and avatar' },
		{ id: 'account', label: 'Account', description: 'Email, password, security' },
		{ id: 'billing', label: 'Billing', description: 'Plans and invoices' },
		{ id: 'sep-1', label: '', separator: true },
		{ id: 'theme', label: 'Preferences', description: 'Theme and language' },
		{ id: 'help', label: 'Help & support', shortcut: '⌘?' },
		{ id: 'sep-2', label: '', separator: true },
		{ id: 'logout', label: 'Sign out', destructive: true }
	];

	let {
		name = 'User',
		email,
		role,
		plan,
		src,
		status = 'online',
		items = defaultItems,
		size = 'md',
		variant = 'outline',
		align = 'end',
		side = 'bottom',
		showMeta = true,
		showSubtitle = true,
		showChevron = true,
		open = $bindable(false),
		class: className = '',
		header,
		onselect,
		onopenchange
	}: UserMenuProps = $props();

	let triggerEl = $state<HTMLButtonElement | null>(null);
	let menuEl = $state<HTMLDivElement | null>(null);
	let menuStyle = $state('');
	let menuId = $state('');

	$effect(() => {
		if (!menuId) menuId = createId('user-menu');
	});

	/**
	 * Declarative invoker avoids the light-dismiss ↔ click race:
	 * without an associated source, pointerup closes and click reopens.
	 */
	$effect(() => {
		const btn = triggerEl;
		const menu = menuEl;
		if (!btn || !menu) return;
		btn.popoverTargetElement = menu;
		btn.popoverTargetAction = 'toggle';
		return () => {
			btn.popoverTargetElement = null;
		};
	});

	const avatarSize = $derived(size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md');
	const statusLabel = $derived(
		status === 'online'
			? 'Online'
			: status === 'busy'
				? 'Busy'
				: status === 'away'
					? 'Away'
					: status === 'offline'
						? 'Offline'
						: undefined
	);

	function setOpen(next: boolean) {
		open = next;
		onopenchange?.(next);
	}

	function positionMenu() {
		if (!triggerEl || !menuEl) return;
		if (!menuEl.matches(':popover-open')) return;

		const rect = triggerEl.getBoundingClientRect();
		const gap = 8;
		const margin = 8;
		const vv = window.visualViewport;
		const viewW = vv?.width ?? window.innerWidth;
		const viewH = vv?.height ?? window.innerHeight;
		const viewLeft = vv?.offsetLeft ?? 0;
		const viewTop = vv?.offsetTop ?? 0;

		const width = Math.min(Math.max(rect.width, 280), viewW - margin * 2);
		const height = menuEl.offsetHeight || 280;

		const spaceBelow = viewTop + viewH - rect.bottom - gap - margin;
		const spaceAbove = rect.top - viewTop - gap - margin;

		let place: 'top' | 'bottom' = side;
		if (side === 'bottom' && height > spaceBelow && spaceAbove > spaceBelow) place = 'top';
		else if (side === 'top' && height > spaceAbove && spaceBelow > spaceAbove) place = 'bottom';

		let top: number;
		if (place === 'bottom') {
			top = rect.bottom + gap;
			if (top + height > viewTop + viewH - margin) {
				top = Math.max(viewTop + margin, viewTop + viewH - margin - height);
			}
		} else {
			top = rect.top - gap - height;
			if (top < viewTop + margin) top = viewTop + margin;
		}

		let left = align === 'end' ? rect.right - width : rect.left;
		left = Math.min(Math.max(left, viewLeft + margin), viewLeft + viewW - margin - width);

		menuStyle = [
			`top:${top}px`,
			'bottom:auto',
			`left:${left}px`,
			'right:auto',
			`width:${width}px`,
			'height:auto',
			'max-height:none'
		].join(';');
	}

	function closeMenu() {
		if (menuEl?.matches(':popover-open')) menuEl.hidePopover();
	}

	function select(item: UserMenuItem) {
		if (item.disabled || item.separator) return;
		onselect?.(item.id, item);
		closeMenu();
	}

	function handleBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open') {
			queueMicrotask(() => {
				positionMenu();
				requestAnimationFrame(() => positionMenu());
			});
		}
	}

	function handleToggle(event: ToggleEvent) {
		const next = event.newState === 'open';
		setOpen(next);
		if (next) {
			queueMicrotask(() => {
				positionMenu();
				requestAnimationFrame(() => positionMenu());
			});
		}
	}

	$effect(() => {
		if (!open) return;
		let frame = 0;
		const reposition = (event?: Event) => {
			const target = event?.target;
			if (target instanceof Node && menuEl?.contains(target)) return;
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => positionMenu());
		};
		const offScroll = on(window, 'scroll', reposition, { capture: true, passive: true });
		const offResize = on(window, 'resize', reposition);
		const offVisual =
			typeof window.visualViewport !== 'undefined' && window.visualViewport
				? on(window.visualViewport, 'resize', reposition)
				: () => {};
		return () => {
			cancelAnimationFrame(frame);
			offScroll();
			offResize();
			offVisual();
		};
	});
</script>

<div class={['relative flex w-full min-w-0', className]}>
	<button
		bind:this={triggerEl}
		type="button"
		class={[
			'inline-flex w-full min-w-0 max-w-full items-center text-left transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
			variant === 'outline' &&
				'gap-2.5 rounded-xl border border-border bg-surface-elevated hover:bg-surface-overlay',
			variant === 'ghost' && 'gap-2 rounded-lg border border-transparent hover:bg-surface-overlay',
			size === 'sm' && (variant === 'ghost' ? 'px-1.5 py-1' : 'px-2 py-1.5'),
			size === 'md' && (variant === 'ghost' ? 'px-2 py-1.5' : 'px-2.5 py-2'),
			size === 'lg' && (variant === 'ghost' ? 'px-2.5 py-2' : 'px-3 py-2.5'),
			open && (variant === 'ghost' ? 'bg-surface-overlay' : 'ring-2 ring-brand-500/30')
		]}
		aria-haspopup="menu"
		aria-expanded={open}
		aria-controls={menuId || undefined}
	>
		<span class="shrink-0">
			<Avatar {src} {name} size={avatarSize} {status} />
		</span>
		{#if showMeta}
			<span class="hidden min-w-0 flex-1 overflow-hidden sm:block">
				<span class="block truncate text-sm font-medium text-primary">{name}</span>
				{#if showSubtitle && (email || role)}
					<span class="block truncate text-xs text-muted">
						{role ? `${role}` : ''}{role && email ? ' · ' : ''}{email ?? ''}
					</span>
				{/if}
			</span>
		{/if}
		{#if showChevron}
			<svg
				class={['h-4 w-4 shrink-0 text-muted transition-transform', open && 'rotate-180']}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
			</svg>
		{/if}
	</button>

	<div
		bind:this={menuEl}
		id={menuId}
		popover="auto"
		role="menu"
		tabindex={-1}
		aria-label="User menu"
		style={menuStyle}
		ontoggle={handleToggle}
		onbeforetoggle={handleBeforeToggle}
		class="user-menu m-0 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl inset-auto outline-none"
	>
		{#if header}
			{@render header()}
		{:else}
			<div class="border-b border-border bg-surface-overlay/50 px-3.5 py-3">
				<div class="flex items-start gap-3">
					<Avatar {src} {name} size="lg" {status} />
					<div class="min-w-0 flex-1 pt-0.5">
						<p class="truncate text-sm font-semibold text-primary">{name}</p>
						{#if email}
							<p class="truncate text-xs text-muted">{email}</p>
						{/if}
						<div class="mt-2 flex flex-wrap items-center gap-2">
							{#if status && statusLabel}
								<StatusDot {status} size="sm" showLabel label={statusLabel} />
							{/if}
							{#if role}
								<span
									class="rounded-md bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-secondary ring-1 ring-border"
								>
									{role}
								</span>
							{/if}
							{#if plan}
								<Badge variant="primary" size="sm">{plan}</Badge>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div class="p-1.5">
			{#each items as item (item.id)}
				{#if item.separator}
					<div class="my-1.5 border-t border-border" role="separator"></div>
				{:else}
					<button
						type="button"
						role="menuitem"
						disabled={item.disabled}
						onclick={() => select(item)}
						class={[
							'flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left transition-colors',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
							item.destructive
								? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
								: 'text-primary hover:bg-surface-overlay',
							item.disabled && 'cursor-not-allowed opacity-40'
						]}
					>
						<span class="min-w-0 flex-1">
							<span class="block text-sm font-medium">{item.label}</span>
							{#if item.description}
								<span class="block text-xs text-muted">{item.description}</span>
							{/if}
						</span>
						{#if item.shortcut}
							<span class="mt-0.5 shrink-0 font-mono text-[10px] text-muted">{item.shortcut}</span>
						{/if}
					</button>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.user-menu {
		position: fixed;
	}

	.user-menu:popover-open {
		display: block;
	}
</style>
