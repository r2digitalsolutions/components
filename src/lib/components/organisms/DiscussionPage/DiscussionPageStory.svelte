<script lang="ts">
	import DiscussionPage from './DiscussionPage.svelte';
	import type { CommentItem } from '$lib/components/organisms/CommentThread/CommentThread.svelte';

	let comments = $state<CommentItem[]>([
		{
			id: '1',
			author: 'Maya Chen',
			avatar: 'https://i.pravatar.cc/80?img=20',
			content: 'Love the new StatCard — can we add a skeleton variant too?',
			date: Date.now() - 1000 * 60 * 40,
			replies: [
				{
					id: '1a',
					author: 'You',
					avatar: 'https://i.pravatar.cc/80?img=15',
					content: 'Yes — SkeletonCard is already in the library.',
					date: Date.now() - 1000 * 60 * 20
				}
			]
		},
		{
			id: '2',
			author: 'Jordan Lee',
			avatar: 'https://i.pravatar.cc/80?img=33',
			content: 'DocsLayout looks great for the handbook.',
			date: Date.now() - 1000 * 60 * 120
		}
	]);
</script>

<div class="mx-auto max-w-2xl p-4">
	<DiscussionPage
		bind:comments
		avatar="https://i.pravatar.cc/80?img=15"
		title="Design system feedback"
		description="Thread for component reviews and proposals."
	/>
</div>
