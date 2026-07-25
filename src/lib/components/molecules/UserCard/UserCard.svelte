<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';

	export type UserCardStatus = 'online' | 'offline' | 'busy' | 'away';

	interface UserCardProps {
		name: string;
		email?: string;
		role?: string;
		avatar?: string;
		status?: UserCardStatus;
		badge?: string;
		actionLabel?: string;
		class?: string;
		footer?: Snippet;
		onaction?: () => void;
	}

	const {
		name,
		email,
		role,
		avatar,
		status,
		badge,
		actionLabel = 'View profile',
		class: className = '',
		footer,
		onaction
	}: UserCardProps = $props();
</script>

<Card class={className} padding="md" chrome={false}>
	<div class="flex items-start gap-3">
		<Avatar src={avatar} name={name} size="lg" status={status ?? null} />
		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-center gap-2">
				<p class="truncate text-sm font-semibold text-primary">{name}</p>
				{#if badge}
					<Badge size="sm" variant="primary">{badge}</Badge>
				{/if}
			</div>
			{#if role}
				<p class="text-xs text-secondary">{role}</p>
			{/if}
			{#if email}
				<p class="truncate text-xs text-muted">{email}</p>
			{/if}
			{#if status}
				<div class="mt-1.5">
					<StatusDot {status} size="sm" showLabel />
				</div>
			{/if}
		</div>
	</div>

	{#if actionLabel}
		<div class="mt-4">
			<Button size="sm" variant="secondary" fullWidth onclick={() => onaction?.()}>
				{actionLabel}
			</Button>
		</div>
	{/if}

	{#if footer}
		<div class="mt-3 border-t border-border pt-3">
			{@render footer()}
		</div>
	{/if}
</Card>
