<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import AvatarLabel from '$lib/components/molecules/AvatarLabel/AvatarLabel.svelte';
	import TimeAgo from '$lib/components/molecules/TimeAgo/TimeAgo.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	export type NoteTone = 'default' | 'yellow' | 'green' | 'sky' | 'rose';

	interface NoteCardProps {
		title?: string;
		body: string;
		author?: string;
		avatar?: string;
		date?: Date | string | number;
		tone?: NoteTone;
		class?: string;
		actions?: Snippet;
		onpin?: () => void;
	}

	const {
		title,
		body,
		author,
		avatar,
		date,
		tone = 'yellow',
		class: className = '',
		actions,
		onpin
	}: NoteCardProps = $props();

	const tones: Record<NoteTone, string> = {
		default: '',
		yellow: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50',
		green: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900/50',
		sky: 'bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:border-sky-900/50',
		rose: 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50'
	};
</script>

<Card
	padding="md"
	chrome={false}
	class={['border', tones[tone], className].filter(Boolean).join(' ')}
>
	<div class="mb-2 flex items-start justify-between gap-2">
		{#if title}
			<p class="text-sm font-semibold text-primary">{title}</p>
		{:else}
			<span></span>
		{/if}
		<div class="flex items-center gap-1">
			{#if actions}{@render actions()}{/if}
			{#if onpin}
				<IconButton label="Pin note" size="xs" onclick={() => onpin()}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 17v5m0-5l-4-4V7h8v6l-4 4z" />
					</svg>
				</IconButton>
			{/if}
		</div>
	</div>
	<Text size="sm" tone="primary">{body}</Text>
	{#if author || date}
		<div class="mt-3 flex items-center justify-between gap-2">
			{#if author}
				<AvatarLabel name={author} {avatar} size="xs" />
			{:else}
				<span></span>
			{/if}
			{#if date}
				<span class="text-[11px] text-muted"><TimeAgo {date} /></span>
			{/if}
		</div>
	{/if}
</Card>
