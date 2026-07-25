<script lang="ts">
	export interface ChecklistItem {
		id: string;
		label: string;
		done?: boolean;
	}

	interface ChecklistProps {
		items?: ChecklistItem[];
		class?: string;
	}

	const { items = [], class: className = '' }: ChecklistProps = $props();
</script>

<ul class={['flex flex-col gap-2', className]} role="list">
	{#each items as item (item.id)}
		<li class="flex items-start gap-2.5">
			<span
				class={[
					'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
					item.done
						? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
						: 'border border-border bg-surface-overlay text-muted'
				]}
				aria-hidden="true"
			>
				{#if item.done}
					<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				{/if}
			</span>
			<span class={['text-sm', item.done ? 'text-secondary line-through' : 'text-primary']}>
				{item.label}
			</span>
		</li>
	{/each}
</ul>
