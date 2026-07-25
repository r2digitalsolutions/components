<script lang="ts">
	export interface FacetOption {
		id: string;
		label: string;
		count?: number;
		disabled?: boolean;
	}

	interface FacetGroupProps {
		/** Facet field id (e.g. brand) */
		id?: string;
		title: string;
		options?: FacetOption[];
		value?: string[];
		multiple?: boolean;
		/** Visible options before "Show more" */
		limit?: number;
		showMoreLabel?: string;
		showLessLabel?: string;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		id,
		title,
		options = [],
		value = $bindable([] as string[]),
		multiple = true,
		limit = 6,
		showMoreLabel = 'Show more',
		showLessLabel = 'Show less',
		class: className = '',
		onchange
	}: FacetGroupProps = $props();

	let expanded = $state(false);

	const visible = $derived(expanded || options.length <= limit ? options : options.slice(0, limit));
	const hiddenCount = $derived(Math.max(0, options.length - limit));

	function toggle(optionId: string) {
		const option = options.find((o) => o.id === optionId);
		if (option?.disabled) return;

		if (multiple) {
			value = value.includes(optionId)
				? value.filter((v) => v !== optionId)
				: [...value, optionId];
		} else {
			value = value.includes(optionId) ? [] : [optionId];
		}
		onchange?.(value);
	}
</script>

<section class={['space-y-2', className]} aria-labelledby={id ? `${id}-title` : undefined}>
	<h3
		id={id ? `${id}-title` : undefined}
		class="text-xs font-semibold uppercase tracking-wide text-muted"
	>
		{title}
	</h3>
	<ul class="space-y-1" role="group" aria-label={title}>
		{#each visible as option (option.id)}
			{@const active = value.includes(option.id)}
			<li>
				<label
					class={[
						'flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 text-sm transition-colors',
						option.disabled
							? 'cursor-not-allowed opacity-50'
							: 'hover:bg-surface-overlay'
					]}
				>
					<input
						type={multiple ? 'checkbox' : 'radio'}
						name={id ?? title}
						class="h-3.5 w-3.5 rounded border-border text-brand-500 focus:ring-brand-500/30"
						checked={active}
						disabled={option.disabled}
						onchange={() => toggle(option.id)}
					/>
					<span class="min-w-0 flex-1 truncate text-secondary">{option.label}</span>
					{#if option.count !== undefined}
						<span class="shrink-0 tabular-nums text-[11px] text-muted">{option.count}</span>
					{/if}
				</label>
			</li>
		{/each}
	</ul>
	{#if hiddenCount > 0}
		<button
			type="button"
			class="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
			onclick={() => (expanded = !expanded)}
		>
			{expanded ? showLessLabel : `${showMoreLabel} (${hiddenCount})`}
		</button>
	{/if}
</section>
