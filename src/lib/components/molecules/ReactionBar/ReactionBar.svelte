<script lang="ts">
	export interface ReactionItem {
		emoji: string;
		count: number;
		reacted?: boolean;
	}

	interface ReactionBarProps {
		items?: ReactionItem[];
		class?: string;
		onreact?: (emoji: string, reacted: boolean) => void;
	}

	let {
		items = $bindable<ReactionItem[]>([
			{ emoji: '👍', count: 3 },
			{ emoji: '❤️', count: 1 },
			{ emoji: '🎉', count: 0 }
		]),
		class: className = '',
		onreact
	}: ReactionBarProps = $props();

	function toggle(emoji: string) {
		items = items.map((r) => {
			if (r.emoji !== emoji) return r;
			const reacted = !r.reacted;
			return { ...r, reacted, count: Math.max(0, r.count + (reacted ? 1 : -1)) };
		});
		const next = items.find((r) => r.emoji === emoji);
		onreact?.(emoji, !!next?.reacted);
	}
</script>

<div class={['inline-flex flex-wrap gap-1.5', className]} role="group" aria-label="Reactions">
	{#each items as item (item.emoji)}
		<button
			type="button"
			onclick={() => toggle(item.emoji)}
			class={[
				'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-colors',
				item.reacted
					? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300'
					: 'border-border bg-surface-elevated text-secondary hover:bg-surface-overlay'
			]}
			aria-pressed={item.reacted}
		>
			<span aria-hidden="true">{item.emoji}</span>
			<span class="tabular-nums font-medium">{item.count}</span>
		</button>
	{/each}
</div>
