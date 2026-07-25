<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';

	export type UserListItemStatus = 'online' | 'offline' | 'busy' | 'away';

	interface UserListItemProps {
		name: string;
		description?: string;
		avatar?: string;
		status?: UserListItemStatus;
		badge?: string;
		meta?: string;
		selected?: boolean;
		disabled?: boolean;
		class?: string;
		trailing?: Snippet;
		onclick?: () => void;
	}

	const {
		name,
		description = '',
		avatar,
		status,
		badge = '',
		meta = '',
		selected = false,
		disabled = false,
		class: className = '',
		trailing,
		onclick
	}: UserListItemProps = $props();
</script>

<button
	type="button"
	class={[
		'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
		selected
			? 'bg-brand-50 ring-1 ring-brand-500/20 dark:bg-brand-950/40'
			: 'hover:bg-surface-overlay',
		disabled && 'pointer-events-none opacity-50',
		className
	]}
	{disabled}
	aria-pressed={selected}
	onclick={() => onclick?.()}
>
	<Avatar src={avatar} {name} size="md" status={status ?? null} ringed={false} />

	<span class="min-w-0 flex-1">
		<span class="flex items-center gap-1.5">
			<span
				class={[
					'truncate text-sm',
					selected ? 'font-semibold text-primary' : 'font-medium text-primary'
				]}
			>
				{name}
			</span>
			{#if badge}
				<Badge size="sm" variant="secondary">{badge}</Badge>
			{/if}
		</span>
		{#if description}
			<span class="mt-0.5 block truncate text-xs text-muted">{description}</span>
		{:else if status}
			<span class="mt-0.5 block">
				<StatusDot {status} size="sm" showLabel />
			</span>
		{/if}
	</span>

	{#if meta}
		<span class="shrink-0 text-[11px] tabular-nums text-muted">{meta}</span>
	{/if}

	{#if trailing}
		<span class="flex shrink-0 items-center gap-1">
			{@render trailing()}
		</span>
	{/if}
</button>
