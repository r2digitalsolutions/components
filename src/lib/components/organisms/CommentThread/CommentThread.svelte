<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export interface CommentItem {
		id: string;
		author: string;
		avatar?: string;
		content: string;
		date: Date | string | number;
		replies?: CommentItem[];
	}

	interface CommentThreadProps {
		comments?: CommentItem[];
		class?: string;
		onreply?: (parentId: string, content: string) => void;
	}

	let {
		comments = [],
		class: className = '',
		onreply
	}: CommentThreadProps = $props();

	let replyTo = $state<string | null>(null);
	let draft = $state('');

	function submitReply(parentId: string) {
		const text = draft.trim();
		if (!text) return;
		onreply?.(parentId, text);
		draft = '';
		replyTo = null;
	}
</script>

{#snippet commentNode(item: CommentItem, depth: number)}
	<article class={['flex gap-3', depth > 0 && 'ml-8 mt-3']}>
		<Avatar name={item.author} src={item.avatar} size="sm" />
		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-baseline gap-2">
				<span class="text-sm font-medium text-primary">{item.author}</span>
				<TimeAgo date={item.date} class="text-xs text-muted" />
			</div>
			<p class="mt-1 text-sm text-secondary">{item.content}</p>
			<button
				type="button"
				class="mt-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
				onclick={() => {
					replyTo = item.id;
					draft = '';
				}}
			>
				Reply
			</button>

			{#if replyTo === item.id}
				<div class="mt-2 space-y-2">
					<textarea
						class="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/30"
						rows="2"
						placeholder={`Reply to ${item.author}…`}
						bind:value={draft}
					></textarea>
					<div class="flex gap-2">
						<Button size="xs" onclick={() => submitReply(item.id)}>Reply</Button>
						<Button size="xs" variant="ghost" onclick={() => (replyTo = null)}>Cancel</Button>
					</div>
				</div>
			{/if}

			{#if item.replies?.length}
				{#each item.replies as reply (reply.id)}
					{@render commentNode(reply, depth + 1)}
				{/each}
			{/if}
		</div>
	</article>
{/snippet}

<div class={['space-y-4', className]}>
	{#each comments as comment (comment.id)}
		{@render commentNode(comment, 0)}
	{/each}
</div>
