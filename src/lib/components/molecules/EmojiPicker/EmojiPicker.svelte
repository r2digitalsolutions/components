<script lang="ts">
	export interface EmojiCategory {
		id: string;
		label: string;
		emojis: string[];
	}

	interface EmojiPickerProps {
		categories?: EmojiCategory[];
		class?: string;
		onselect?: (emoji: string) => void;
	}

	const defaultCategories: EmojiCategory[] = [
		{
			id: 'smileys',
			label: 'Smileys',
			emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😜', '🤔', '😎', '😢', '😭']
		},
		{
			id: 'gestures',
			label: 'Gestures',
			emojis: ['👍', '👎', '👏', '🙌', '👋', '🤝', '🙏', '💪', '✌️', '🤞', '👌', '🤘', '👀', '🧠', '💬', '🔥']
		},
		{
			id: 'objects',
			label: 'Objects',
			emojis: ['⭐', '💡', '📎', '📌', '✏️', '📁', '📦', '🛒', '🎁', '🔔', '🔒', '🔑', '⚙️', '🧭', '📱', '💻']
		}
	];

	let {
		categories = defaultCategories,
		class: className = '',
		onselect
	}: EmojiPickerProps = $props();

	let query = $state('');
	let active = $state(categories[0]?.id ?? '');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const cat = categories.find((c) => c.id === active) ?? categories[0];
		if (!cat) return [];
		if (!q) return cat.emojis;
		return categories.flatMap((c) => c.emojis).filter((e) => e.includes(q) || true).slice(0, 40);
	});
</script>

<div
	class={['w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-lg', className]}
	role="dialog"
	aria-label="Emoji picker"
>
	<div class="border-b border-border p-2">
		<input
			class="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-primary outline-none focus:ring-2 focus:ring-brand-500/30"
			placeholder="Search…"
			bind:value={query}
		/>
	</div>
	<div class="flex gap-1 border-b border-border px-2 py-1.5">
		{#each categories as cat (cat.id)}
			<button
				type="button"
				class={[
					'rounded-md px-2 py-1 text-xs',
					active === cat.id ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300' : 'text-secondary hover:bg-surface-overlay'
				]}
				onclick={() => (active = cat.id)}
			>
				{cat.label}
			</button>
		{/each}
	</div>
	<div class="grid max-h-48 grid-cols-8 gap-1 overflow-y-auto p-2">
		{#each filtered as emoji}
			<button
				type="button"
				class="flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-surface-overlay"
				onclick={() => onselect?.(emoji)}
			>
				{emoji}
			</button>
		{/each}
	</div>
</div>
