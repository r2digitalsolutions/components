<script lang="ts">
	export interface WidgetCatalogItem {
		id: string;
		label: string;
		description?: string;
		/** Suggested default grid size */
		defaultW?: number;
		defaultH?: number;
		icon?: string;
	}

	interface WidgetPickerProps {
		widgets: WidgetCatalogItem[];
		title?: string;
		columns?: 1 | 2 | 3;
		class?: string;
		onselect?: (id: string) => void;
	}

	const {
		widgets,
		title = 'Add widget',
		columns = 2,
		class: className = '',
		onselect
	}: WidgetPickerProps = $props();

	const columnClasses: Record<1 | 2 | 3, string> = {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-2 sm:grid-cols-3'
	};
</script>

<section
	class={['rounded-xl border border-border bg-surface-elevated p-4', className]}
	aria-label={title}
>
	<h3 class="mb-3 text-sm font-semibold text-primary">{title}</h3>

	<div class={['grid gap-2', columnClasses[columns]]} role="group" aria-label="Widget catalog">
		{#each widgets as widget (widget.id)}
			<button
				type="button"
				class={[
					'flex flex-col items-start gap-2 rounded-xl border border-border bg-surface p-3 text-left transition-colors',
					'hover:border-brand-500/30 hover:bg-surface-overlay',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30'
				]}
				onclick={() => onselect?.(widget.id)}
			>
				<span
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-base text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
					aria-hidden="true"
				>
					{widget.icon ?? '📦'}
				</span>
				<span>
					<span class="block text-sm font-medium text-primary">{widget.label}</span>
					{#if widget.description}
						<span class="mt-0.5 block text-xs leading-relaxed text-muted">{widget.description}</span>
					{/if}
				</span>
			</button>
		{/each}
	</div>
</section>
