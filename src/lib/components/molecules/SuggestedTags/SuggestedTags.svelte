<script lang="ts" generics="T">
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';

	interface SuggestedTagsProps {
		items?: readonly T[];
		getKey: (item: T) => string;
		getLabel: (item: T) => string;
		getConfidence?: (item: T) => number | undefined;
		selectedKeys?: readonly string[];
		disabled?: boolean;
		empty?: string;
		confidenceLabel?: (confidence: number) => string;
		onselectionchange?: (item: T, selected: boolean) => void;
		class?: string;
	}

	const {
		items = [],
		getKey,
		getLabel,
		getConfidence,
		selectedKeys = [],
		disabled = false,
		empty = 'No suggested tags',
		confidenceLabel = (confidence) => `${Math.round(confidence * 100)}%`,
		onselectionchange,
		class: className = ''
	}: SuggestedTagsProps = $props();

	const selected = $derived(new Set(selectedKeys));
</script>

{#if items.length > 0}
	<ul class={['gap-2 flex flex-wrap', className]} aria-label="Suggested tags">
		{#each items as item (getKey(item))}
			{@const key = getKey(item)}
			{@const confidence = getConfidence?.(item)}
			<li>
				<Chip
					variant="default"
					selected={selected.has(key)}
					{disabled}
					onclick={onselectionchange
						? () => onselectionchange?.(item, !selected.has(key))
						: undefined}
				>
					{getLabel(item)}
					{#if confidence !== undefined}
						<span class="ml-1 font-mono opacity-70">{confidenceLabel(confidence)}</span>
					{/if}
				</Chip>
			</li>
		{/each}
	</ul>
{:else}
	<p class={['text-sm text-muted', className]}>{empty}</p>
{/if}
