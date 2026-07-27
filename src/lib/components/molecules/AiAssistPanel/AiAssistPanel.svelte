<script lang="ts">
	import PromptInput from '$lib/components/molecules/PromptInput/PromptInput.svelte';
	import ChatBubble from '$lib/components/molecules/ChatBubble/ChatBubble.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export type AiAssistRole = 'user' | 'assistant' | 'system';

	export interface AiAssistMessage {
		id: string;
		role: AiAssistRole;
		content: string;
	}

	interface AiAssistPanelProps {
		messages?: AiAssistMessage[];
		snippets?: string[];
		title?: string;
		loading?: boolean;
		placeholder?: string;
		class?: string;
		onsubmit?: (prompt: string) => void;
		oninsert?: (text: string) => void;
		onstop?: () => void;
	}

	let {
		messages = $bindable<AiAssistMessage[]>([]),
		snippets = [],
		title = 'AI assist',
		loading = false,
		placeholder = 'Ask for help with this resource…',
		class: className = '',
		onsubmit,
		oninsert,
		onstop
	}: AiAssistPanelProps = $props();

	let draft = $state('');

	function submit(value: string) {
		const text = value.trim();
		if (!text) return;
		messages = [
			...messages,
			{ id: `m-${Date.now()}`, role: 'user', content: text }
		];
		draft = '';
		onsubmit?.(text);
	}
</script>

<aside
	class={[
		'flex h-full min-h-[360px] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated',
		className
	]}
	data-ai-assist-panel
>
	<header class="border-b border-border px-3 py-2">
		<p class="text-sm font-semibold text-primary">{title}</p>
	</header>

	{#if snippets.length}
		<div class="flex flex-wrap gap-1 border-b border-border px-3 py-2">
			{#each snippets as s (s)}
				<Button size="sm" variant="secondary" onclick={() => oninsert?.(s)}>{s}</Button>
			{/each}
		</div>
	{/if}

	<div class="flex-1 space-y-3 overflow-auto p-3">
		{#each messages as msg (msg.id)}
			{#if msg.role === 'assistant'}
				<div class="flex flex-col items-start gap-1">
					<ChatBubble content={msg.content} side="left" />
					{#if oninsert}
						<Button size="sm" variant="ghost" onclick={() => oninsert?.(msg.content)}>
							Insert
						</Button>
					{/if}
				</div>
			{:else if msg.role === 'system'}
				<p class="text-center text-[11px] text-muted">{msg.content}</p>
			{:else}
				<ChatBubble content={msg.content} side="right" />
			{/if}
		{/each}
		{#if !messages.length}
			<p class="py-8 text-center text-sm text-muted">Ask anything to get started.</p>
		{/if}
	</div>

	<div class="border-t border-border p-3">
		<PromptInput
			bind:value={draft}
			{placeholder}
			{loading}
			onsubmit={submit}
			onstop={onstop}
		/>
	</div>
</aside>
