<script lang="ts">
	import FadeMask from './FadeMask.svelte';
</script>

<div class="flex max-w-lg flex-col gap-6">
	<FadeMask edge="right" class="w-full">
		<div class="flex gap-3 overflow-x-auto pb-2">
			{#each Array.from({ length: 8 }, (_, i) => i) as i (i)}
				<div
					class="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated text-sm text-secondary"
				>
					Slide {i + 1}
				</div>
			{/each}
		</div>
	</FadeMask>

	<FadeMask edge="y" size="sm" class="max-h-24">
		<div class="space-y-2 text-sm text-primary">
			{#each Array.from({ length: 6 }, (_, i) => i) as i (i)}
				<p>Scrollable content line {i + 1} with vertical fade at edges.</p>
			{/each}
		</div>
	</FadeMask>
</div>
