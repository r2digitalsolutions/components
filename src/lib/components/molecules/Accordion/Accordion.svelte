<script lang="ts">
	export interface AccordionItem {
		id: string;
		title: string;
		content: string;
		disabled?: boolean;
	}

	interface AccordionProps {
		items?: AccordionItem[];
		/** Controlled open ids. Single mode uses the first id. */
		value?: string[];
		type?: 'single' | 'multiple';
		collapsible?: boolean;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		items = [],
		value = $bindable<string[]>([]),
		type = 'single',
		collapsible = true,
		class: className = '',
		onchange
	}: AccordionProps = $props();

	function isOpen(id: string) {
		return value.includes(id);
	}

	function toggle(id: string, disabled?: boolean) {
		if (disabled) return;

		let next: string[];
		if (type === 'single') {
			if (isOpen(id)) next = collapsible ? [] : [id];
			else next = [id];
		} else {
			next = isOpen(id) ? value.filter((v) => v !== id) : [...value, id];
		}
		value = next;
		onchange?.(next);
	}
</script>

<div class={['flex w-full flex-col gap-2', className]}>
	{#each items as item (item.id)}
		{@const open = isOpen(item.id)}
		<div
			class={[
				'overflow-hidden rounded-xl border border-border bg-surface-elevated',
				item.disabled && 'opacity-50'
			]}
		>
			<h3>
				<button
					type="button"
					id={`acc-trigger-${item.id}`}
					aria-expanded={open}
					aria-controls={`acc-panel-${item.id}`}
					disabled={item.disabled}
					onclick={() => toggle(item.id, item.disabled)}
					class={[
						'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-primary transition-colors',
						'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/30',
						item.disabled && 'cursor-not-allowed'
					]}
				>
					<span>{item.title}</span>
					<svg
						class={['h-4 w-4 shrink-0 text-secondary transition-transform', open && 'rotate-180']}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			</h3>
			{#if open}
				<div
					id={`acc-panel-${item.id}`}
					role="region"
					aria-labelledby={`acc-trigger-${item.id}`}
					class="border-t border-border px-4 py-3 text-sm leading-relaxed text-secondary"
				>
					{item.content}
				</div>
			{/if}
		</div>
	{/each}
</div>
