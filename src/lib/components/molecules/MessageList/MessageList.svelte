<script lang="ts">
	import ChatBubble, { type MessageSide, type MessageStatus } from '../ChatBubble/ChatBubble.svelte';

	export interface Message {
		id: string;
		content: string;
		side: MessageSide;
		author?: string;
		time?: string;
		avatar?: string;
		status?: MessageStatus;
	}

	interface MessageListProps {
		messages?: Message[];
		maxHeight?: number | string;
		class?: string;
	}

	let {
		messages = [],
		maxHeight = 480,
		class: className = ''
	}: MessageListProps = $props();

	let listEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		messages;
		if (listEl) {
			listEl.scrollTop = listEl.scrollHeight;
		}
	});

	function isSameAuthorGroup(messages: Message[], index: number): boolean {
		if (index === 0) return false;
		return messages[index].author === messages[index - 1].author &&
			messages[index].side === messages[index - 1].side;
	}
</script>

<div
	bind:this={listEl}
	class={['overflow-y-auto', className]}
	style={`max-height: ${typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight};`}
	role="log"
	aria-live="polite"
	aria-label="Message list"
>
	<div class="flex flex-col gap-3 p-4">
		{#each messages as message, i (message.id)}
			<ChatBubble
				content={message.content}
				side={message.side}
				author={isSameAuthorGroup(messages, i) ? undefined : message.author}
				time={message.time}
				avatar={isSameAuthorGroup(messages, i) ? undefined : message.avatar}
				status={message.status}
				class={isSameAuthorGroup(messages, i) ? 'mt-0.5' : 'mt-1'}
			/>
		{/each}
	</div>
</div>
