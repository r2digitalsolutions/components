<script lang="ts">
	import ScrollArea from './ScrollArea.svelte';

	let props = $props<{
		maxHeight?: number;
		orientation?: 'vertical' | 'horizontal' | 'both';
		hideScrollbar?: boolean;
	}>();
</script>

<div class="p-6 flex flex-col gap-6">
	<div class="w-80">
		<p class="text-xs text-secondary mb-2 font-medium">Vertical scroll</p>
		<ScrollArea
			maxHeight={props.maxHeight ?? 200}
			orientation={props.orientation ?? 'vertical'}
			hideScrollbar={props.hideScrollbar ?? false}
			class="rounded-lg border border-border bg-surface-elevated"
		>
			<ul class="p-2">
				{#each Array.from({ length: 20 }, (_, i) => i + 1) as n}
					<li class="px-3 py-2 text-sm text-primary rounded-md hover:bg-surface-overlay transition-colors">
						Item {n}
					</li>
				{/each}
			</ul>
		</ScrollArea>
	</div>

	<div class="w-80">
		<p class="text-xs text-secondary mb-2 font-medium">Horizontal scroll</p>
		<ScrollArea
			orientation="horizontal"
			class="rounded-lg border border-border bg-surface-elevated"
		>
			<div class="flex gap-3 p-3" style="width:max-content">
				{#each Array.from({ length: 10 }, (_, i) => i + 1) as n}
					<div class="shrink-0 w-24 h-16 rounded-lg bg-surface-overlay border border-border flex items-center justify-center text-sm font-medium text-secondary">
						Card {n}
					</div>
				{/each}
			</div>
		</ScrollArea>
	</div>
</div>
