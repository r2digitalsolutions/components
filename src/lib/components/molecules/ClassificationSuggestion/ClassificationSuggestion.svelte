<script lang="ts" generics="T">
	import ProgressBar from '$lib/components/atoms/ProgressBar/ProgressBar.svelte';

	interface ClassificationSuggestionProps {
		items?: readonly T[];
		getKey: (item: T) => string;
		getLabel: (item: T) => string;
		getConfidence: (item: T) => number;
		selectedKey?: string;
		disabled?: boolean;
		empty?: string;
		confidenceLabel?: (confidence: number) => string;
		onselect?: (item: T) => void;
		class?: string;
	}

	const {
		items = [],
		getKey,
		getLabel,
		getConfidence,
		selectedKey,
		disabled = false,
		empty = 'No classifications',
		confidenceLabel = (confidence) => `${Math.round(confidence * 100)}%`,
		onselect,
		class: className = ''
	}: ClassificationSuggestionProps = $props();
</script>

{#if items.length > 0}
	<ul class={['space-y-2', className]} aria-label="Classification suggestions">
		{#each items as item (getKey(item))}
			{@const key = getKey(item)}
			{@const confidence = getConfidence(item)}
			<li>
				<button
					type="button"
					class={[
						'rounded-xl px-3 py-2.5 focus-visible:ring-brand-500/40 w-full border text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
						selectedKey === key
							? 'border-border-strong bg-surface-overlay ring-border-strong ring-1'
							: 'border-border bg-surface-elevated hover:bg-surface-overlay',
						disabled || !onselect ? 'cursor-default' : 'cursor-pointer',
						disabled && 'opacity-50'
					]}
					disabled={disabled || !onselect}
					aria-pressed={onselect ? selectedKey === key : undefined}
					onclick={() => onselect?.(item)}
				>
					<span class="mb-1.5 gap-3 text-sm flex items-center justify-between">
						<span class="min-w-0 font-medium text-primary truncate">{getLabel(item)}</span>
						<span class="font-mono text-xs text-muted shrink-0">{confidenceLabel(confidence)}</span>
					</span>
					<ProgressBar
						value={confidence}
						max={1}
						size="sm"
						label={`${getLabel(item)} confidence`}
					/>
				</button>
			</li>
		{/each}
	</ul>
{:else}
	<p class={['text-sm text-muted', className]}>{empty}</p>
{/if}
