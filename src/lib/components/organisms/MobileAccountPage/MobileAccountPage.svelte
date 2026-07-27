<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import VersionTag from '$lib/components/atoms/VersionTag/VersionTag.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import QuickActionGrid from '$lib/components/molecules/QuickActionGrid/QuickActionGrid.svelte';
	import type { QuickAction } from '$lib/components/molecules/QuickActionGrid/QuickActionGrid.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import LogOut from '@lucide/svelte/icons/log-out';

	export interface AccountSettingItem {
		id: string;
		label: string;
		description?: string;
	}

	interface MobileAccountPageProps {
		name: string;
		email?: string;
		avatar?: string;
		actions?: QuickAction[];
		settings?: AccountSettingItem[];
		version?: string;
		class?: string;
		onaction?: (id: string) => void;
		onsignout?: () => void;
	}

	const DEFAULT_SETTINGS: AccountSettingItem[] = [
		{ id: 'profile', label: 'Profile', description: 'Name, photo, and bio' },
		{ id: 'notifications', label: 'Notifications', description: 'Email, push, and in-app' },
		{ id: 'security', label: 'Security', description: 'Password and 2FA' },
		{ id: 'billing', label: 'Billing', description: 'Plan and payment method' },
		{ id: 'help', label: 'Help & support', description: 'Docs, contact, and status' }
	];

	let {
		name,
		email = '',
		avatar,
		actions = [],
		settings = DEFAULT_SETTINGS,
		version = '2.4.1',
		class: className = '',
		onaction,
		onsignout
	}: MobileAccountPageProps = $props();
</script>

<div class={['mx-auto w-full max-w-md space-y-6', className]}>
	<header class="flex flex-col items-center gap-3 px-2 pt-2 text-center">
		<Avatar src={avatar} {name} size="2xl" />
		<div class="min-w-0 space-y-0.5">
			<h1 class="truncate text-xl font-semibold text-primary">{name}</h1>
			{#if email}
				<p class="truncate text-sm text-muted">{email}</p>
			{/if}
		</div>
	</header>

	{#if actions.length}
		<QuickActionGrid {actions} columns={3} onaction={onaction} />
	{/if}

	{#if settings.length}
		<Stack gap="none" class="overflow-hidden rounded-xl border border-border bg-surface-elevated">
			{#each settings as item, index (item.id)}
				<button
					type="button"
					class={[
						'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors',
						'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/30',
						index > 0 && 'border-t border-border'
					]}
					onclick={() => onaction?.(item.id)}
				>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-medium text-primary">{item.label}</p>
						{#if item.description}
							<p class="mt-0.5 text-xs text-muted">{item.description}</p>
						{/if}
					</div>
					<ChevronRight class="h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
				</button>
			{/each}
		</Stack>
	{/if}

	<div class="flex flex-col items-center gap-4 pb-2">
		<Button
			size="sm"
			variant="ghost"
			class="text-muted hover:text-error"
			onclick={() => onsignout?.()}
		>
			<LogOut class="h-4 w-4" strokeWidth={2} />
			Sign out
		</Button>

		<VersionTag {version} tone="neutral" />
	</div>
</div>
