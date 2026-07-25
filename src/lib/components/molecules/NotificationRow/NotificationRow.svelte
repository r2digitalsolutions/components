<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';
	import Check from '@lucide/svelte/icons/check';
	import Info from '@lucide/svelte/icons/info';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import X from '@lucide/svelte/icons/x';

	export type NotificationRowType = 'info' | 'success' | 'warning' | 'error';

	export interface NotificationRowData {
		id: string;
		title: string;
		description?: string;
		time?: string | Date | number;
		read?: boolean;
		avatar?: string;
		actor?: string;
		type?: NotificationRowType;
	}

	interface NotificationRowProps {
		item: NotificationRowData;
		/** Compact = denser padding for popovers */
		density?: 'comfortable' | 'compact';
		class?: string;
		actions?: Snippet;
		onclick?: (item: NotificationRowData) => void;
	}

	const {
		item,
		density = 'comfortable',
		class: className = '',
		actions,
		onclick
	}: NotificationRowProps = $props();

	const type = $derived(item.type ?? 'info');

	const typeIconBg: Record<NotificationRowType, string> = {
		info: 'bg-sky-500',
		success: 'bg-emerald-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500'
	};
</script>

<button
	type="button"
	class={[
		'group flex w-full items-start gap-3 text-left transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/30',
		density === 'comfortable' ? 'px-3.5 py-3' : 'px-3 py-2.5',
		item.read
			? 'bg-transparent hover:bg-surface-overlay/80'
			: 'bg-brand-50/50 hover:bg-brand-50 dark:bg-brand-950/25 dark:hover:bg-brand-950/40',
		className
	]}
	onclick={() => onclick?.(item)}
>
	<div class="relative mt-0.5 shrink-0">
		{#if item.avatar}
			<Avatar src={item.avatar} name={item.actor} alt="" size="sm" ringed={false} />
		{:else}
			<span
				class={[
					'flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm',
					typeIconBg[type]
				]}
				aria-hidden="true"
			>
				{#if type === 'success'}
					<Check class="h-3.5 w-3.5" strokeWidth={2.5} />
				{:else if type === 'warning'}
					<TriangleAlert class="h-3.5 w-3.5" strokeWidth={2.25} />
				{:else if type === 'error'}
					<X class="h-3.5 w-3.5" strokeWidth={2.5} />
				{:else}
					<Info class="h-3.5 w-3.5" strokeWidth={2.25} />
				{/if}
			</span>
		{/if}

		{#if !item.read}
			<span
				class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-elevated bg-brand-500"
				aria-label="Unread"
			></span>
		{/if}
	</div>

	<div class="min-w-0 flex-1">
		<div class="flex items-baseline justify-between gap-3">
			<p
				class={[
					'truncate text-sm leading-snug',
					item.read ? 'font-medium text-secondary' : 'font-semibold text-primary'
				]}
			>
				{item.title}
			</p>
			{#if item.time}
				<span class="shrink-0 text-[11px] tabular-nums text-muted">
					{#if typeof item.time === 'string' && Number.isNaN(Date.parse(item.time)) && Number.isNaN(Number(item.time))}
						{item.time}
					{:else}
						<TimeAgo date={item.time} />
					{/if}
				</span>
			{/if}
		</div>

		{#if item.description}
			<p class="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">{item.description}</p>
		{/if}

		{#if actions}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="mt-2 flex flex-wrap items-center gap-1.5"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				{@render actions()}
			</div>
		{/if}
	</div>
</button>
