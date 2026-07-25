<script lang="ts">
	import ReactionBar from './ReactionBar.svelte';
	import type { ReactionItem } from './ReactionBar.svelte';

	let items = $state<ReactionItem[]>([
		{ emoji: '👍', count: 12, reacted: true },
		{ emoji: '❤️', count: 4 },
		{ emoji: '🔥', count: 2 },
		{ emoji: '👀', count: 1 }
	]);
</script>

<div class="rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-3 text-sm text-primary">Shipped the new Chart + Sparkline components.</p>
	<ReactionBar bind:items />
</div>
