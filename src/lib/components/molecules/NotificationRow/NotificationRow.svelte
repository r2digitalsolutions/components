<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';

	export type NotificationRowType = 'info' | 'success' | 'warning' | 'error';

	export interface NotificationRowData {
		id: string;
		title: string;
		description?: string;
		time?: string | Date | number;
		read?: boolean;
		avatar?: string;
		type?: NotificationRowType;
	}

	interface NotificationRowProps {
		item: NotificationRowData;
		class?: string;
		onclick?: (item: NotificationRowData) => void;
	}

	const { item, class: className = '', onclick }: NotificationRowProps = $props();

	const typeDot: Record<NotificationRowType, string> = {
		info: 'bg-sky-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500'
	};
</script>

<button
	type="button"
	class={[
		'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
		item.read
			? 'bg-transparent hover:bg-surface-overlay'
			: 'bg-brand-50/60 hover:bg-brand-50 dark:bg-brand-950/30 dark:hover:bg-brand-950/50',
		className
	]}
	onclick={() => onclick?.(item)}
>
	{#if item.avatar}
		<Avatar src={item.avatar} alt="" size="sm" />
	{:else}
		<span
			class={['mt-2 h-2 w-2 shrink-0 rounded-full', typeDot[item.type ?? 'info']]}
			aria-hidden="true"
		></span>
	{/if}

	<div class="min-w-0 flex-1">
		<div class="flex items-start justify-between gap-2">
			<p
				class={[
					'truncate text-sm',
					item.read ? 'font-medium text-secondary' : 'font-semibold text-primary'
				]}
			>
				{item.title}
			</p>
			{#if item.time}
				<span class="shrink-0 text-[11px] text-muted">
					<TimeAgo date={item.time} />
				</span>
			{/if}
		</div>
		{#if item.description}
			<p class="mt-0.5 line-clamp-2 text-xs text-muted">{item.description}</p>
		{/if}
	</div>

	{#if !item.read}
		<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden="true"></span>
	{/if}
</button>
