<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';

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

	let rootEl = $state<HTMLDivElement | null>(null);

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

	function toggle() {
		setOpen(!open);
	}

	function select(item: UserMenuItem) {
		if (item.disabled || item.separator) return;
		onselect?.(item.id, item);
		setOpen(false);
	}

	function onDocPointer(e: PointerEvent) {
		if (!open || !rootEl) return;
		if (!rootEl.contains(e.target as Node)) setOpen(false);
	}

	function onKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') setOpen(false);
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		document.addEventListener('pointerdown', onDocPointer);
		window.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onDocPointer);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<div bind:this={rootEl} class={['relative inline-flex', className]}>
	<button
		type="button"
		class={[
			'inline-flex items-center text-left transition-colors',
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
		onclick={toggle}
	>
		<Avatar {src} {name} size={avatarSize} {status} />
		{#if showMeta}
			<span class="hidden min-w-0 sm:block">
				<span class="block max-w-[9rem] truncate text-sm font-medium text-primary">{name}</span>
				{#if showSubtitle && (email || role)}
					<span class="block max-w-[11rem] truncate text-xs text-muted">
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

	{#if open}
		<div
			class={[
				'absolute z-50 w-[min(100vw-2rem,18rem)] overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl',
				side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
				align === 'end' ? 'right-0' : 'left-0'
			]}
			role="menu"
			aria-label="User menu"
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
									<span class="rounded-md bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-secondary ring-1 ring-border">
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
	{/if}
</div>
