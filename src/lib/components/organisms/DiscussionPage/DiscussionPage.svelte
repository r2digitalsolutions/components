<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import CommentThread from '$lib/components/organisms/CommentThread/CommentThread.svelte';
	import type { CommentItem } from '$lib/components/organisms/CommentThread/CommentThread.svelte';
	import CommentComposer from '$lib/components/molecules/CommentComposer/CommentComposer.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';

	interface DiscussionPageProps {
		title?: string;
		description?: string;
		comments?: CommentItem[];
		avatar?: string;
		name?: string;
		class?: string;
		onpost?: (content: string) => void;
		onreply?: (parentId: string, content: string) => void;
	}

	let {
		title = 'Discussion',
		description = 'Share feedback and keep the conversation moving.',
		comments = $bindable<CommentItem[]>([]),
		avatar,
		name = 'You',
		class: className = '',
		onpost,
		onreply
	}: DiscussionPageProps = $props();

	let draft = $state('');

	function post(content: string) {
		const item: CommentItem = {
			id: `c-${Date.now()}`,
			author: name,
			avatar,
			content,
			date: Date.now()
		};
		comments = [item, ...comments];
		onpost?.(content);
	}

	function reply(parentId: string, content: string) {
		comments = comments.map((c) =>
			c.id === parentId
				? {
						...c,
						replies: [
							...(c.replies ?? []),
							{
								id: `r-${Date.now()}`,
								author: name,
								avatar,
								content,
								date: Date.now()
							}
						]
					}
				: c
		);
		onreply?.(parentId, content);
	}
</script>

<div class={['w-full space-y-5', className]}>
	<PageHeader {title} {description} />

	<CommentComposer bind:value={draft} {avatar} {name} onsubmit={post} />

	<Card padding="lg" chrome={false}>
		{#if comments.length === 0}
			<p class="text-sm text-muted">No comments yet. Start the discussion above.</p>
		{:else}
			<CommentThread {comments} onreply={reply} />
		{/if}
	</Card>
</div>
