<script lang="ts">
	export type BottomNavIcon =
		| 'home'
		| 'search'
		| 'plus'
		| 'inbox'
		| 'user'
		| 'heart'
		| 'grid'
		| 'bell'
		| 'bookmark'
		| 'compass'
		| 'chat'
		| 'settings'
		| 'music'
		| 'mail';

	export interface BottomNavItem {
		id: string;
		label: string;
		icon?: BottomNavIcon;
		badge?: string | number;
		disabled?: boolean;
		/** Center FAB (Flutter CircularNotchedRectangle) */
		primary?: boolean;
	}

	interface BottomNavProps {
		items?: BottomNavItem[];
		value?: string;
		size?: 'sm' | 'md' | 'lg';
		/**
		 * default — full-width docked
		 * floating — inset rounded card (Flutter demos)
		 * pill — capsule
		 * notch — floating + explicit SVG CircularNotchedRectangle
		 */
		variant?: 'default' | 'floating' | 'pill' | 'notch';
		showLabels?: boolean;
		blur?: boolean;
		/** Colored FAB background (CSS color or token class handled via style) */
		fabClass?: string;
		/** Soft shadow under the bar */
		elevated?: boolean;
		class?: string;
		onchange?: (id: string) => void;
	}

	let {
		items = [],
		value = $bindable(''),
		size = 'md',
		variant = 'notch',
		showLabels = true,
		blur = false,
		fabClass = 'bg-brand-500 hover:bg-brand-600',
		elevated = true,
		class: className = '',
		onchange
	}: BottomNavProps = $props();

	const iconPaths: Record<BottomNavIcon, string> = {
		home: 'M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z',
		search: 'M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z',
		plus: 'M12 5v14M5 12h14',
		inbox: 'M4 6h16v12H4V6zm0 4l8 5 8-5',
		user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
		heart: 'M20.8 5.6a5 5 0 00-7.1 0L12 7.3l-1.7-1.7a5 5 0 00-7.1 7.1l1.7 1.7L12 21.5l7.1-7.1 1.7-1.7a5 5 0 000-7.1z',
		grid: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z',
		bell: 'M15 17h5l-1.4-1.4A2 2 0 0118 14v-3a6 6 0 10-12 0v3c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0',
		bookmark: 'M7 4h10a1 1 0 011 1v16l-6-3-6 3V5a1 1 0 011-1z',
		compass: 'M12 22a10 10 0 100-20 10 10 0 000 20zM14.5 9.5l-2 5-5 2 2-5 5-2z',
		chat: 'M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z',
		settings:
			'M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
		music: 'M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z',
		mail: 'M4 6h16v12H4V6zm0 0l8 7 8-7'
	};

	const fabItem = $derived(items.find((i) => i.primary));
	const sideItems = $derived(items.filter((i) => !i.primary));
	const leftItems = $derived(sideItems.slice(0, Math.ceil(sideItems.length / 2)));
	const rightItems = $derived(sideItems.slice(Math.ceil(sideItems.length / 2)));
	const useNotch = $derived(!!fabItem && (variant === 'notch' || variant === 'floating'));

	const sizes = $derived(
		{
			sm: { bar: 'h-14', fab: 'h-12 w-12', fabIcon: 'h-5 w-5', icon: 'h-4 w-4', label: 'text-[10px]', notch: 30, gap: 48, pad: 'pt-7' },
			md: { bar: 'h-16', fab: 'h-14 w-14', fabIcon: 'h-6 w-6', icon: 'h-5 w-5', label: 'text-[11px]', notch: 34, gap: 56, pad: 'pt-8' },
			lg: { bar: 'h-[4.5rem]', fab: 'h-16 w-16', fabIcon: 'h-7 w-7', icon: 'h-6 w-6', label: 'text-xs', notch: 38, gap: 64, pad: 'pt-9' }
		}[size]
	);

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}
</script>

{#snippet navItem(item: BottomNavItem)}
	{@const active = value === item.id}
	<button
		type="button"
		disabled={item.disabled}
		onclick={() => select(item.id, item.disabled)}
		aria-current={active ? 'page' : undefined}
		class={[
			'group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1',
			'rounded-xl transition-colors duration-200',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			active ? 'text-brand-600 dark:text-brand-400' : 'text-muted hover:text-primary',
			item.disabled && 'cursor-not-allowed opacity-40'
		]}
	>
		<span
			class={[
				'relative inline-flex items-center justify-center transition-transform duration-200',
				active && 'scale-110'
			]}
		>
			<svg
				class={sizes.icon}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width={active ? '2.35' : '1.85'}
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[item.icon ?? 'home']} />
			</svg>
			{#if item.badge !== undefined && item.badge !== ''}
				<span
					class="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white shadow-sm"
				>
					{item.badge}
				</span>
			{/if}
		</span>
		{#if showLabels}
			<span class={['truncate font-medium leading-none transition-colors', sizes.label]}>
				{item.label}
			</span>
		{/if}
		{#if active && !fabItem}
			<span
				class="absolute top-0 h-1 w-5 rounded-b-full bg-brand-500"
				aria-hidden="true"
			></span>
		{/if}
	</button>
{/snippet}

<nav
	class={[
		'relative w-full',
		fabItem && sizes.pad,
		(variant === 'floating' || variant === 'notch' || variant === 'pill') &&
			'px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]',
		variant === 'default' && 'pb-[max(0.25rem,env(safe-area-inset-bottom))]',
		!fabItem && variant !== 'default' && 'pt-2',
		className
	]}
	aria-label="Bottom navigation"
	style="--notch-r: {sizes.notch}px; --fab-gap: {sizes.gap}px;"
>
	{#if fabItem}
		<button
			type="button"
			disabled={fabItem.disabled}
			onclick={() => select(fabItem.id, fabItem.disabled)}
			aria-label={fabItem.label}
			class={[
				'absolute left-1/2 top-0 z-20 flex -translate-x-1/2 items-center justify-center rounded-full text-white',
				'shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-all duration-200 active:scale-95',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
				sizes.fab,
				fabClass,
				fabItem.disabled && 'cursor-not-allowed opacity-40',
				value === fabItem.id && 'ring-2 ring-brand-300/60 ring-offset-2 ring-offset-surface'
			]}
		>
			<svg
				class={sizes.fabIcon}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d={iconPaths[fabItem.icon ?? 'plus']}
				/>
			</svg>
		</button>
	{/if}

	<div
		class={[
			'relative flex w-full items-center',
			sizes.bar,
			variant === 'default' && 'bg-surface-elevated',
			variant === 'default' && !fabItem && 'border-t border-border',
			(variant === 'floating' || variant === 'notch') && 'rounded-2xl bg-surface-elevated',
			variant === 'pill' && 'rounded-full bg-surface-elevated',
			elevated && variant !== 'default' && 'shadow-lg',
			elevated && variant === 'default' && fabItem && 'shadow-[0_-4px_16px_rgba(0,0,0,0.06)]',
			blur && 'bg-surface-elevated/95 backdrop-blur-md',
			useNotch && 'notched-bar'
		]}
	>
		{#if fabItem}
			<div class="flex min-w-0 flex-1 items-center self-stretch px-1">
				{#each leftItems as item (item.id)}
					{@render navItem(item)}
				{/each}
			</div>
			<div class="w-[var(--fab-gap)] shrink-0 self-stretch" aria-hidden="true"></div>
			<div class="flex min-w-0 flex-1 items-center self-stretch px-1">
				{#each rightItems as item (item.id)}
					{@render navItem(item)}
				{/each}
			</div>
		{:else}
			<div class="flex w-full items-center self-stretch px-1">
				{#each items as item (item.id)}
					{@render navItem(item)}
				{/each}
			</div>
		{/if}
	</div>
</nav>

<style>
	.notched-bar {
		-webkit-mask-image: radial-gradient(
			circle var(--notch-r) at 50% 0,
			transparent calc(var(--notch-r) - 0.5px),
			#000 var(--notch-r)
		);
		mask-image: radial-gradient(
			circle var(--notch-r) at 50% 0,
			transparent calc(var(--notch-r) - 0.5px),
			#000 var(--notch-r)
		);
	}
</style>
