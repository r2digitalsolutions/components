<script lang="ts">
	import MessageList, { type Message } from './MessageList.svelte';

	const messages: Message[] = [
		{
			id: '1',
			side: 'left',
			author: 'Alice',
			avatar: 'https://i.pravatar.cc/40?img=47',
			content: 'Hey! Did you check the latest design specs?',
			time: '10:28 AM'
		},
		{
			id: '2',
			side: 'right',
			author: 'You',
			content: 'Yes! Just finished reviewing them. They look great.',
			time: '10:29 AM',
			status: 'read'
		},
		{
			id: '3',
			side: 'left',
			author: 'Alice',
			avatar: 'https://i.pravatar.cc/40?img=47',
			content: 'Awesome! I especially liked the new color palette.',
			time: '10:29 AM'
		},
		{
			id: '4',
			side: 'left',
			author: 'Alice',
			content: 'Do you think we can ship by Friday?',
			time: '10:30 AM'
		},
		{
			id: '5',
			side: 'right',
			author: 'You',
			content: "I think so! The components are mostly done. Just need to write tests.",
			time: '10:31 AM',
			status: 'read'
		},
		{
			id: '6',
			side: 'right',
			author: 'You',
			content: 'Should be no problem 🚀',
			time: '10:31 AM',
			status: 'delivered'
		},
		{
			id: '7',
			side: 'left',
			author: 'Alice',
			avatar: 'https://i.pravatar.cc/40?img=47',
			content: 'Perfect! I will let the team know.',
			time: '10:32 AM'
		}
	];
</script>

<div class="w-full max-w-lg rounded-xl border border-border bg-surface-elevated overflow-hidden">
	<!-- Chat header -->
	<div class="flex items-center gap-3 border-b border-border px-4 py-3">
		<img src="https://i.pravatar.cc/40?img=47" alt="Alice" class="h-8 w-8 rounded-full object-cover" />
		<div>
			<p class="text-sm font-semibold text-primary">Alice</p>
			<p class="text-xs text-green-500">Online</p>
		</div>
	</div>

	<MessageList {messages} maxHeight={400} />

	<!-- Input area -->
	<div class="flex items-center gap-2 border-t border-border px-3 py-2.5">
		<input
			type="text"
			placeholder="Type a message..."
			class="min-w-0 flex-1 rounded-lg border border-border bg-surface-overlay px-3 py-2 text-sm text-primary placeholder:text-muted outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
		/>
		<button
			type="button"
			class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white transition-colors hover:bg-brand-600"
			aria-label="Send"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
			</svg>
		</button>
	</div>
</div>
