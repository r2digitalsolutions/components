<script lang="ts">
	import ChatWindow from './ChatWindow.svelte';
	import type { Message } from '$lib/components/molecules/MessageList/MessageList.svelte';

	let messages = $state<Message[]>([
		{
			id: '1',
			content: 'Hey! How is the new component pack looking?',
			side: 'left',
			author: 'Sam',
			time: '09:41'
		},
		{
			id: '2',
			content: 'Really solid — shipping ChatWindow next.',
			side: 'right',
			author: 'You',
			time: '09:42',
			status: 'read'
		}
	]);
</script>

<ChatWindow bind:messages title="Design team" typingNames={['Sam']} />
