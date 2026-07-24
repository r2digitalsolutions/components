<script lang="ts">
	export type MessageStatus = 'sent' | 'delivered' | 'read';
	export type MessageSide = 'left' | 'right';

	interface ChatBubbleProps {
		content: string;
		side?: MessageSide;
		author?: string;
		time?: string;
		avatar?: string;
		status?: MessageStatus;
		class?: string;
	}

	let {
		content,
		side = 'left',
		author,
		time,
		avatar,
		status,
		class: className = ''
	}: ChatBubbleProps = $props();

	const isRight = $derived(side === 'right');
</script>

<div class={['flex gap-2.5', isRight ? 'flex-row-reverse' : 'flex-row', className]}>
	<!-- Avatar -->
	{#if avatar}
		<img
			src={avatar}
			alt={author ?? ''}
			class="h-8 w-8 shrink-0 rounded-full object-cover self-end"
		/>
	{:else if author}
		<div class={['h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold self-end', isRight ? 'bg-brand-500 text-white' : 'bg-surface-overlay text-secondary']}>
			{author.charAt(0).toUpperCase()}
		</div>
	{/if}

	<div class={['flex max-w-[72%] flex-col gap-1', isRight ? 'items-end' : 'items-start']}>
		{#if author}
			<span class="px-1 text-xs font-medium text-muted">{author}</span>
		{/if}

		<div
			class={[
				'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
				isRight
					? 'rounded-br-sm bg-brand-500 text-white'
					: 'rounded-bl-sm bg-surface-overlay text-primary border border-border'
			]}
		>
			{content}
		</div>

		<div class={['flex items-center gap-1.5 px-1', isRight ? 'flex-row-reverse' : 'flex-row']}>
			{#if time}
				<span class="text-[11px] text-muted">{time}</span>
			{/if}
			{#if status && isRight}
				{#if status === 'sent'}
					<svg class="h-3 w-3 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-label="Sent">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				{:else if status === 'delivered'}
					<svg class="h-3 w-3 text-muted" viewBox="0 0 24 24" fill="currentColor" aria-label="Delivered">
						<path d="M2 13l4 4L15 7M7 13l4 4L20 7" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				{:else if status === 'read'}
					<svg class="h-3 w-3 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-label="Read">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2 12l4 4L15 6M8 12l4 4L21 6" />
					</svg>
				{/if}
			{/if}
		</div>
	</div>
</div>
