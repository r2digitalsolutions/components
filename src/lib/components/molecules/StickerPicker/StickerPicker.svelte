<script lang="ts">
	export interface Sticker {
		id: string;
		label: string;
		emoji: string;
	}

	const DEFAULT_STICKERS: Sticker[] = [
		{ id: 'thumbs-up', label: 'Thumbs up', emoji: '👍' },
		{ id: 'heart', label: 'Heart', emoji: '❤️' },
		{ id: 'fire', label: 'Fire', emoji: '🔥' },
		{ id: 'party', label: 'Party', emoji: '🎉' },
		{ id: 'eyes', label: 'Eyes', emoji: '👀' },
		{ id: 'rocket', label: 'Rocket', emoji: '🚀' },
		{ id: 'check', label: 'Check', emoji: '✅' },
		{ id: 'clap', label: 'Clap', emoji: '👏' },
		{ id: 'think', label: 'Thinking', emoji: '🤔' },
		{ id: 'wave', label: 'Wave', emoji: '👋' },
		{ id: 'star', label: 'Star', emoji: '⭐' },
		{ id: 'bug', label: 'Bug', emoji: '🐛' }
	];

	interface StickerPickerProps {
		stickers?: Sticker[];
		columns?: number;
		class?: string;
		onselect?: (id: string) => void;
	}

	const {
		stickers,
		columns = 6,
		class: className = '',
		onselect
	}: StickerPickerProps = $props();

	const items = $derived(stickers?.length ? stickers : DEFAULT_STICKERS);
</script>

<div
	class={['grid gap-1 rounded-xl border border-border bg-surface-elevated p-2', className]}
	style={`grid-template-columns: repeat(${columns}, minmax(0, 1fr));`}
	role="listbox"
	aria-label="Sticker picker"
>
	{#each items as sticker (sticker.id)}
		<button
			type="button"
			role="option"
			class={[
				'flex aspect-square items-center justify-center rounded-lg text-xl transition-colors',
				'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30'
			]}
			title={sticker.label}
			aria-label={sticker.label}
			aria-selected={false}
			onclick={() => onselect?.(sticker.id)}
		>
			{sticker.emoji}
		</button>
	{/each}
</div>
