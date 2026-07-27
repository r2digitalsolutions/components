<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Prose from '$lib/components/atoms/Prose/Prose.svelte';

	interface ThreadReplyProps {
		author: string;
		body: string;
		avatar?: string;
		time?: string;
		depth?: number;
		class?: string;
		onreply?: () => void;
	}

	const {
		author,
		body,
		avatar,
		time = '',
		depth = 0,
		class: className = '',
		onreply
	}: ThreadReplyProps = $props();

	const nest = $derived(Math.min(depth, 4));
</script>

<article
	class={['flex gap-2.5', className]}
	style={nest > 0 ? `margin-left: ${nest * 1.25}rem` : undefined}
>
	<Avatar src={avatar} name={author} size="sm" ringed={false} class="mt-0.5 shrink-0" />

	<div class="min-w-0 flex-1">
		<header class="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
			<span class="text-sm font-semibold text-primary">{author}</span>
			{#if time}
				<time class="text-[11px] text-muted">{time}</time>
			{/if}
		</header>

		<div class="rounded-xl border border-border bg-surface-overlay px-3 py-2">
			<Prose size="sm">
				{#snippet children()}
					<p>{body}</p>
				{/snippet}
			</Prose>
		</div>

		{#if onreply}
			<div class="mt-1.5">
				<Button size="xs" variant="ghost" onclick={() => onreply()}>Reply</Button>
			</div>
		{/if}
	</div>
</article>
