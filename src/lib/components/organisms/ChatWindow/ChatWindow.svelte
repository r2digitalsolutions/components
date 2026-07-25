<script lang="ts">
	import MessageList, { type Message } from '$lib/components/molecules/MessageList/MessageList.svelte';
	import TypingIndicator from '$lib/components/molecules/TypingIndicator/TypingIndicator.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface ChatWindowProps {
		title?: string;
		messages?: Message[];
		typingNames?: string[];
		placeholder?: string;
		class?: string;
		onsend?: (text: string) => void;
	}

	let {
		title = 'Chat',
		messages = $bindable<Message[]>([]),
		typingNames = [],
		placeholder = 'Type a message…',
		class: className = '',
		onsend
	}: ChatWindowProps = $props();

	let draft = $state('');

	function send() {
		const text = draft.trim();
		if (!text) return;
		const msg: Message = {
			id: `msg-${Date.now()}`,
			content: text,
			side: 'right',
			author: 'You',
			time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			status: 'sent'
		};
		messages = [...messages, msg];
		draft = '';
		onsend?.(text);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
</script>

<div
	class={['flex h-[480px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated', className]}
>
	<header class="border-b border-border px-4 py-3">
		<p class="text-sm font-semibold text-primary">{title}</p>
	</header>

	<div class="min-h-0 flex-1">
		<MessageList {messages} maxHeight="100%" class="h-full" />
	</div>

	{#if typingNames.length}
		<div class="px-4 pb-2">
			<TypingIndicator names={typingNames} size="sm" />
		</div>
	{/if}

	<footer class="flex items-end gap-2 border-t border-border p-3">
		<textarea
			class="min-h-[40px] flex-1 resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/30"
			rows="1"
			{placeholder}
			bind:value={draft}
			onkeydown={onKey}
		></textarea>
		<Button size="sm" onclick={send}>Send</Button>
	</footer>
</div>
