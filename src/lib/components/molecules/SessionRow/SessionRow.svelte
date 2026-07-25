<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Time from '$lib/components/atoms/Time/Time.svelte';
	import Monitor from '@lucide/svelte/icons/monitor';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import Tablet from '@lucide/svelte/icons/tablet';

	export type SessionDevice = 'desktop' | 'mobile' | 'tablet';

	export interface SessionInfo {
		id: string;
		device?: SessionDevice;
		browser?: string;
		os?: string;
		location?: string;
		ip?: string;
		lastActiveAt: Date | string | number;
		current?: boolean;
	}

	interface SessionRowProps {
		session: SessionInfo;
		class?: string;
		onrevoke?: (id: string) => void;
	}

	const ICONS = {
		desktop: Monitor,
		mobile: Smartphone,
		tablet: Tablet
	} as const;

	let { session, class: className = '', onrevoke }: SessionRowProps = $props();

	const Icon = $derived(ICONS[session.device ?? 'desktop']);
	const title = $derived(
		[session.browser, session.os].filter(Boolean).join(' · ') || 'Unknown device'
	);
</script>

<div
	class={[
		'flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-3 sm:flex-row sm:items-center sm:gap-4',
		session.current && 'border-brand-500/40 ring-1 ring-brand-500/15',
		className
	]}
>
	<span
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-secondary"
	>
		<Icon class="h-5 w-5" strokeWidth={2} />
	</span>

	<div class="min-w-0 flex-1 space-y-1">
		<div class="flex flex-wrap items-center gap-2">
			<p class="text-sm font-semibold text-primary">{title}</p>
			{#if session.current}
				<Badge size="sm" variant="success" dot>This device</Badge>
			{/if}
		</div>
		<p class="text-xs text-muted">
			{#if session.location}{session.location} · {/if}
			{#if session.ip}<span class="font-mono">{session.ip}</span> · {/if}
			Last active <Time date={session.lastActiveAt} format="datetime" class="text-xs text-muted" />
		</p>
	</div>

	{#if onrevoke && !session.current}
		<Button size="xs" variant="ghost" class="shrink-0 self-start sm:self-center" onclick={() => onrevoke?.(session.id)}>
			Revoke
		</Button>
	{/if}
</div>
