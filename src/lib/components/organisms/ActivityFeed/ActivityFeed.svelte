<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';

	export interface ActivityItem {
		id: string;
		actor: string;
		avatar?: string;
		action: string;
		target?: string;
		date: Date | string | number;
		meta?: string;
	}

	interface ActivityFeedProps {
		items?: ActivityItem[];
		class?: string;
	}

	let { items = [], class: className = '' }: ActivityFeedProps = $props();
</script>

<ol class={['relative space-y-0 border-l border-border', className]}>
	{#each items as item (item.id)}
		<li class="relative ml-6 pb-6 last:pb-0">
			<span
				class="absolute -left-[1.55rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-elevated"
			>
				<Avatar name={item.actor} src={item.avatar} size="xs" ringed={false} />
			</span>
			<div class="space-y-0.5">
				<p class="text-sm text-primary">
					<span class="font-medium">{item.actor}</span>
					<span class="text-secondary"> {item.action} </span>
					{#if item.target}
						<span class="font-medium">{item.target}</span>
					{/if}
				</p>
				{#if item.meta}
					<p class="text-xs text-muted">{item.meta}</p>
				{/if}
				<TimeAgo date={item.date} class="text-xs text-muted" />
			</div>
		</li>
	{/each}
</ol>
