<script lang="ts">
	import ChatBubble from './ChatBubble.svelte';

	let {
		side = 'left',
		content = 'Hey! How are you doing today?',
		author = 'Alice',
		time = '10:30 AM',
		status = 'read'
	}: {
		side?: 'left' | 'right';
		content?: string;
		author?: string;
		time?: string;
		status?: 'sent' | 'delivered' | 'read';
	} = $props();
</script>

<div class="w-full max-w-md p-4 rounded-xl bg-surface-elevated border border-border">
	<ChatBubble
		{content}
		{side}
		{author}
		{time}
		{status}
		avatar={side === 'left' ? 'https://i.pravatar.cc/40?img=47' : undefined}
	/>
</div>
