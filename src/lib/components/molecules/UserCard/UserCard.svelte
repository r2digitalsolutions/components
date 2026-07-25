<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';

	export type UserCardStatus = 'online' | 'offline' | 'busy' | 'away';
	export type UserCardVariant = 'profile' | 'compact' | 'cover';

	interface UserCardProps {
		name: string;
		email?: string;
		role?: string;
		bio?: string;
		location?: string;
		avatar?: string;
		/** Soft gradient / image behind the header (cover variant) */
		cover?: string;
		status?: UserCardStatus;
		badge?: string;
		badgeTone?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
		/** Meta stats under the identity, e.g. followers */
		stats?: { label: string; value: string | number }[];
		primaryAction?: string;
		secondaryAction?: string;
		variant?: UserCardVariant;
		class?: string;
		actions?: Snippet;
		footer?: Snippet;
		onprimary?: () => void;
		onsecondary?: () => void;
		/** @deprecated use primaryAction */
		actionLabel?: string;
		/** @deprecated use onprimary */
		onaction?: () => void;
	}

	const {
		name,
		email,
		role,
		bio = '',
		location = '',
		avatar,
		cover = '',
		status,
		badge,
		badgeTone = 'primary',
		stats = [],
		primaryAction,
		secondaryAction = '',
		variant = 'profile',
		class: className = '',
		actions,
		footer,
		onprimary,
		onsecondary,
		actionLabel,
		onaction
	}: UserCardProps = $props();

	const resolvedPrimary = $derived(primaryAction ?? actionLabel ?? 'View profile');
	const handlePrimary = $derived(onprimary ?? onaction);
</script>

<article
	class={[
		'overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	{#if variant === 'cover'}
		<div class="relative h-24 w-full overflow-hidden bg-surface-overlay">
			{#if cover}
				<img src={cover} alt="" class="h-full w-full object-cover" />
			{:else}
				<div
					class="absolute inset-0 bg-gradient-to-br from-brand-400/80 via-brand-600/70 to-sky-700/60"
					aria-hidden="true"
				></div>
			{/if}
		</div>
		<div class="relative px-4 pb-4 pt-0">
			<div class="-mt-8 mb-3">
				<div
					class="inline-flex rounded-full bg-surface-elevated p-1 ring-1 ring-border shadow-sm"
				>
					<Avatar src={avatar} {name} size="xl" status={status ?? null} ringed={false} />
				</div>
			</div>
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div class="min-w-0 space-y-1">
					<div class="flex flex-wrap items-center gap-2">
						<h3 class="truncate text-base font-semibold tracking-tight text-primary">{name}</h3>
						{#if badge}
							<Badge size="sm" variant={badgeTone}>{badge}</Badge>
						{/if}
					</div>
					{#if role}
						<p class="text-xs text-secondary">{role}</p>
					{/if}
					{#if status}
						<StatusDot {status} size="sm" showLabel />
					{/if}
				</div>
				{#if actions}
					<div class="flex shrink-0 items-center gap-1">
						{@render actions()}
					</div>
				{/if}
			</div>
			{#if bio}
				<p class="mt-3 text-sm leading-relaxed text-secondary">{bio}</p>
			{/if}
			{#if email || location}
				<div class="mt-3 space-y-1.5 text-xs text-muted">
					{#if email}
						<p class="flex items-center gap-1.5 truncate">
							<Mail class="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
							{email}
						</p>
					{/if}
					{#if location}
						<p class="flex items-center gap-1.5 truncate">
							<MapPin class="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
							{location}
						</p>
					{/if}
				</div>
			{/if}
			{#if stats.length}
				<div class="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
					{#each stats as stat}
						<div class="text-center">
							<p class="text-sm font-semibold text-primary">{stat.value}</p>
							<p class="text-[10px] uppercase tracking-wide text-muted">{stat.label}</p>
						</div>
					{/each}
				</div>
			{/if}
			{#if resolvedPrimary || secondaryAction}
				<div class="mt-4 flex gap-2">
					{#if secondaryAction}
						<Button size="sm" variant="secondary" class="flex-1" onclick={() => onsecondary?.()}>
							{secondaryAction}
						</Button>
					{/if}
					{#if resolvedPrimary}
						<Button size="sm" variant="primary" class="flex-1" onclick={() => handlePrimary?.()}>
							{resolvedPrimary}
						</Button>
					{/if}
				</div>
			{/if}
		</div>
	{:else if variant === 'compact'}
		<div class="flex items-center gap-3 p-3">
			<Avatar src={avatar} {name} size="md" status={status ?? null} />
			<div class="min-w-0 flex-1">
				<div class="flex flex-wrap items-center gap-1.5">
					<p class="truncate text-sm font-semibold text-primary">{name}</p>
					{#if badge}
						<Badge size="sm" variant={badgeTone}>{badge}</Badge>
					{/if}
				</div>
				<p class="truncate text-xs text-muted">{role || email}</p>
			</div>
			{#if actions}
				{@render actions()}
			{:else if resolvedPrimary}
				<Button size="xs" variant="secondary" onclick={() => handlePrimary?.()}>
					{resolvedPrimary}
				</Button>
			{/if}
		</div>
	{:else}
		<!-- profile -->
		<div class="p-4 sm:p-5">
			<div class="flex items-start gap-3.5">
				<Avatar src={avatar} {name} size="lg" status={status ?? null} />
				<div class="min-w-0 flex-1 space-y-1">
					<div class="flex flex-wrap items-center gap-2">
						<h3 class="truncate text-sm font-semibold tracking-tight text-primary">{name}</h3>
						{#if badge}
							<Badge size="sm" variant={badgeTone}>{badge}</Badge>
						{/if}
					</div>
					{#if role}
						<p class="text-xs font-medium text-secondary">{role}</p>
					{/if}
					{#if email}
						<p class="truncate text-xs text-muted">{email}</p>
					{/if}
					{#if status}
						<div class="pt-0.5">
							<StatusDot {status} size="sm" showLabel />
						</div>
					{/if}
				</div>
				{#if actions}
					<div class="flex shrink-0 items-center gap-1">
						{@render actions()}
					</div>
				{/if}
			</div>

			{#if bio}
				<p class="mt-3 text-sm leading-relaxed text-secondary">{bio}</p>
			{/if}

			{#if location}
				<p class="mt-2 flex items-center gap-1.5 text-xs text-muted">
					<MapPin class="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
					{location}
				</p>
			{/if}

			{#if stats.length}
				<div class="mt-4 flex gap-4 border-t border-border pt-3">
					{#each stats as stat}
						<div>
							<p class="text-sm font-semibold text-primary">{stat.value}</p>
							<p class="text-[10px] uppercase tracking-wide text-muted">{stat.label}</p>
						</div>
					{/each}
				</div>
			{/if}

			{#if resolvedPrimary || secondaryAction}
				<div class="mt-4 flex gap-2">
					{#if secondaryAction}
						<Button size="sm" variant="ghost" class="flex-1" onclick={() => onsecondary?.()}>
							{secondaryAction}
						</Button>
					{/if}
					{#if resolvedPrimary}
						<Button
							size="sm"
							variant="secondary"
							class="flex-1"
							onclick={() => handlePrimary?.()}
						>
							{resolvedPrimary}
						</Button>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	{#if footer}
		<div class="border-t border-border bg-surface/40 px-4 py-3">
			{@render footer()}
		</div>
	{/if}
</article>
