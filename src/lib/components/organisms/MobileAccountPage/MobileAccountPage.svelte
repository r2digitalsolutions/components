<script lang="ts">
	import type { Snippet, Component } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import VersionTag from '$lib/components/atoms/VersionTag/VersionTag.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import IconBox from '$lib/components/atoms/IconBox/IconBox.svelte';
	import type { IconBoxTone } from '$lib/components/atoms/IconBox/IconBox.svelte';
	import QuickActionGrid from '$lib/components/molecules/QuickActionGrid/QuickActionGrid.svelte';
	import type { QuickAction } from '$lib/components/molecules/QuickActionGrid/QuickActionGrid.svelte';
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';
	import SafeArea from '$lib/components/atoms/SafeArea/SafeArea.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import LogOut from '@lucide/svelte/icons/log-out';
	import User from '@lucide/svelte/icons/user';
	import Bell from '@lucide/svelte/icons/bell';
	import Shield from '@lucide/svelte/icons/shield';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import CircleHelp from '@lucide/svelte/icons/circle-help';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Moon from '@lucide/svelte/icons/moon';
	import Globe from '@lucide/svelte/icons/globe';

	export interface AccountSettingItem {
		id: string;
		label: string;
		description?: string;
		badge?: string;
		tone?: IconBoxTone;
		icon?: Component;
	}

	export interface AccountToggleItem {
		id: string;
		title: string;
		description?: string;
		checked: boolean;
	}

	export interface AccountSection {
		id: string;
		title: string;
		items: AccountSettingItem[];
	}

	interface MobileAccountPageProps {
		name: string;
		email?: string;
		avatar?: string;
		role?: string;
		plan?: string;
		status?: 'online' | 'away' | 'busy' | 'offline';
		actions?: QuickAction[];
		/** Flat settings list (used if sections is empty) */
		settings?: AccountSettingItem[];
		sections?: AccountSection[];
		toggles?: AccountToggleItem[];
		version?: string;
		showEdit?: boolean;
		signOutLabel?: string;
		class?: string;
		headerExtra?: Snippet;
		onaction?: (id: string) => void;
		ontoggle?: (id: string, checked: boolean) => void;
		onedit?: () => void;
		onsignout?: () => void;
	}

	const ICON_BY_ID: Record<string, Component> = {
		profile: User,
		notifications: Bell,
		security: Shield,
		billing: CreditCard,
		help: CircleHelp,
		appearance: Moon,
		language: Globe
	};

	const TONE_BY_ID: Record<string, IconBoxTone> = {
		profile: 'brand',
		notifications: 'warning',
		security: 'success',
		billing: 'info',
		help: 'neutral',
		appearance: 'neutral',
		language: 'brand'
	};

	const DEFAULT_SECTIONS: AccountSection[] = [
		{
			id: 'account',
			title: 'Account',
			items: [
				{ id: 'profile', label: 'Profile', description: 'Name, photo, and bio' },
				{ id: 'notifications', label: 'Notifications', description: 'Email, push, and in-app' },
				{ id: 'security', label: 'Security', description: 'Password and 2FA' }
			]
		},
		{
			id: 'workspace',
			title: 'Workspace',
			items: [
				{ id: 'billing', label: 'Billing', description: 'Plan and payment method', badge: 'Pro' },
				{ id: 'help', label: 'Help & support', description: 'Docs, contact, and status' }
			]
		}
	];

	let {
		name,
		email = '',
		avatar,
		role = '',
		plan = '',
		status = 'online',
		actions = [],
		settings = [],
		sections = [],
		toggles = $bindable<AccountToggleItem[]>([]),
		version = '2.4.1',
		showEdit = true,
		signOutLabel = 'Sign out',
		class: className = '',
		headerExtra,
		onaction,
		ontoggle,
		onedit,
		onsignout
	}: MobileAccountPageProps = $props();

	const resolvedSections = $derived.by(() => {
		if (sections.length) return sections;
		if (settings.length) {
			return [{ id: 'settings', title: 'Settings', items: settings }];
		}
		return DEFAULT_SECTIONS;
	});

	function itemIcon(item: AccountSettingItem) {
		return item.icon ?? ICON_BY_ID[item.id] ?? User;
	}

	function itemTone(item: AccountSettingItem): IconBoxTone {
		return item.tone ?? TONE_BY_ID[item.id] ?? 'neutral';
	}

	function handleToggle(id: string, checked: boolean) {
		toggles = toggles.map((t) => (t.id === id ? { ...t, checked } : t));
		ontoggle?.(id, checked);
	}
</script>

<SafeArea class={['mx-auto w-full max-w-md', className].filter(Boolean).join(' ')} offset="4px">
	<div class="space-y-5 px-1 pb-2 pt-1">
		<!-- Profile card -->
		<section
			class="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated px-4 pb-4 pt-5"
		>
			<div
				class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-brand-500/10 to-transparent"
				aria-hidden="true"
			></div>

			<div class="relative flex flex-col items-center gap-3 text-center">
				<Avatar src={avatar} {name} size="2xl" {status} />
				<div class="min-w-0 space-y-1">
					<h1 class="truncate text-lg font-semibold tracking-tight text-primary">{name}</h1>
					{#if email}
						<p class="truncate text-sm text-muted">{email}</p>
					{/if}
					{#if role || plan}
						<div class="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
							{#if role}
								<Badge size="sm" variant="secondary">{role}</Badge>
							{/if}
							{#if plan}
								<Badge size="sm" variant="primary" rounded>{plan}</Badge>
							{/if}
						</div>
					{/if}
				</div>

				{#if showEdit}
					<Button size="sm" variant="secondary" onclick={() => onedit?.() ?? onaction?.('edit')}>
						<Pencil class="h-3.5 w-3.5" strokeWidth={2} />
						Edit profile
					</Button>
				{/if}

				{#if headerExtra}
					<div class="w-full pt-1">
						{@render headerExtra()}
					</div>
				{/if}
			</div>
		</section>

		{#if actions.length}
			<section class="space-y-2">
				<p class="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Shortcuts</p>
				<QuickActionGrid
					{actions}
					layout="compact"
					size="sm"
					columns={3}
					onaction={onaction}
				/>
			</section>
		{/if}

		{#if toggles.length}
			<section class="space-y-2">
				<p class="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Preferences</p>
				<div
					class="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-elevated"
				>
					{#each toggles as item (item.id)}
						<SettingsRow
							title={item.title}
							description={item.description}
							checked={item.checked}
							variant="flush"
							onchange={(checked) => handleToggle(item.id, checked)}
						/>
					{/each}
				</div>
			</section>
		{/if}

		{#each resolvedSections as section (section.id)}
			<section class="space-y-2">
				<p class="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
					{section.title}
				</p>
				<div
					class="overflow-hidden rounded-2xl border border-border bg-surface-elevated"
				>
					{#each section.items as item, index (item.id)}
						{@const Icon = itemIcon(item)}
						<button
							type="button"
							class={[
								'flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors',
								'hover:bg-surface-overlay/80 active:bg-surface-overlay',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/30',
								index > 0 && 'border-t border-border'
							]}
							onclick={() => onaction?.(item.id)}
						>
							<IconBox tone={itemTone(item)} size="sm" rounded="lg">
								<Icon class="h-4 w-4" aria-hidden="true" />
							</IconBox>
							<div class="min-w-0 flex-1 space-y-0.5">
								<div class="flex items-center gap-2">
									<p class="truncate text-sm font-medium leading-snug text-primary">
										{item.label}
									</p>
									{#if item.badge}
										<Badge size="sm" variant="secondary" rounded>{item.badge}</Badge>
									{/if}
								</div>
								{#if item.description}
									<p class="truncate text-xs leading-snug text-muted">{item.description}</p>
								{/if}
							</div>
							<ChevronRight class="h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
						</button>
					{/each}
				</div>
			</section>
		{/each}

		<div class="space-y-3 pt-1">
			<Button
				size="md"
				variant="outline"
				class="w-full justify-center border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
				onclick={() => onsignout?.()}
			>
				<LogOut class="h-4 w-4" strokeWidth={2} />
				{signOutLabel}
			</Button>

			<div class="flex justify-center">
				<VersionTag {version} tone="neutral" />
			</div>
		</div>
	</div>
</SafeArea>
