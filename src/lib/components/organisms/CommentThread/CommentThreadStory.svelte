<script lang="ts">
	import CommentThread, { type CommentItem } from './CommentThread.svelte';

	const comments: CommentItem[] = [
		{
			id: '1',
			author: 'Alex Rivera',
			content: 'Love the new TOC component — scroll spy feels snappy.',
			date: Date.now() - 1000 * 60 * 45,
			replies: [
				{
					id: '1a',
					author: 'Sam Chen',
					content: 'Agreed. We should wire it into the docs shell next.',
					date: Date.now() - 1000 * 60 * 20
				}
			]
		},
		{
			id: '2',
			author: 'Jordan Lee',
			content: 'Can we add keyboard support to SortableList?',
			date: Date.now() - 1000 * 60 * 10
		}
	];
</script>

<CommentThread {comments} class="w-full max-w-lg" />
