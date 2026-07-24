<script lang="ts">
	export interface TabItem {
		id: string;
		label: string;
		disabled?: boolean;
	}

	interface TabsProps {
		items?: TabItem[];
		value?: string;
		variant?: 'underline' | 'pills';
		fullWidth?: boolean;
		class?: string;
		onchange?: (id: string) => void;
	}

	let {
		items = [],
		value = $bindable(''),
		variant = 'underline',
		fullWidth = false,
		class: className = '',
		onchange
	}: TabsProps = $props();

	const activeId = $derived(value || items.find((i) => !i.disabled)?.id || items[0]?.id || '');

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}

	function onKeydown(event: KeyboardEvent, index: number) {
		const enabled = items
			.map((item, i) => ({ item, i }))
			.filter(({ item }) => !item.disabled);
		if (!enabled.length) return;

		const pos = enabled.findIndex(({ i }) => i === index);
		if (pos < 0) return;

		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			event.preventDefault();
			const next =
				event.key === 'ArrowRight'
					? enabled[(pos + 1) % enabled.length]
					: enabled[(pos - 1 + enabled.length) % enabled.length];
			select(next.item.id);
			const el = document.getElementById(`tab-${next.item.id}`);
			el?.focus();
		} else if (event.key === 'Home') {
			event.preventDefault();
			select(enabled[0].item.id);
			document.getElementById(`tab-${enabled[0].item.id}`)?.focus();
		} else if (event.key === 'End') {
			event.preventDefault();
			const last = enabled[enabled.length - 1];
			select(last.item.id);
			document.getElementById(`tab-${last.item.id}`)?.focus();
		}
	}
</script>

<div
	class={['w-full', className]}
	role="tablist"
	aria-orientation="horizontal"
>
	<div
		class={[
			'flex gap-1',
			variant === 'underline' && 'border-b border-border',
			variant === 'pills' && 'rounded-xl bg-surface-overlay p-1',
			fullWidth && 'w-full'
		]}
	>
		{#each items as item, index (item.id)}
			<button
				type="button"
				id={`tab-${item.id}`}
				role="tab"
				aria-selected={activeId === item.id}
				aria-controls={`panel-${item.id}`}
				tabindex={activeId === item.id ? 0 : -1}
				disabled={item.disabled}
				onclick={() => select(item.id, item.disabled)}
				onkeydown={(e) => onKeydown(e, index)}
				class={[
					'relative px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
					fullWidth && 'flex-1 text-center',
					item.disabled && 'opacity-40 cursor-not-allowed',
					variant === 'underline' &&
						(activeId === item.id
							? 'text-brand-700 dark:text-brand-300'
							: 'text-secondary hover:text-primary'),
					variant === 'pills' &&
						(activeId === item.id
							? 'rounded-lg bg-surface-elevated text-primary shadow-sm'
							: 'rounded-lg text-secondary hover:text-primary')
				]}
			>
				{item.label}
				{#if variant === 'underline' && activeId === item.id}
					<span
						class="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-600"
						aria-hidden="true"
					></span>
				{/if}
			</button>
		{/each}
	</div>
</div>
