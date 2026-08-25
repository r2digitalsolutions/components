<script lang="ts">
	export interface SegmentItem {
		id: string;
		label: string;
		disabled?: boolean;
	}

	interface SegmentedControlProps {
		items?: SegmentItem[];
		value?: string;
		size?: 'sm' | 'md' | 'lg';
		fullWidth?: boolean;
		class?: string;
		onchange?: (id: string) => void;
	}

	let {
		items = [],
		value = $bindable(''),
		size = 'md',
		fullWidth = false,
		class: className = '',
		onchange
	}: SegmentedControlProps = $props();

	const active = $derived(value || items.find((i) => !i.disabled)?.id || '');

	const sizeClasses = {
		sm: 'h-7 px-2.5 text-xs',
		md: 'h-9 px-3 text-sm',
		lg: 'h-10 px-4 text-sm'
	};

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}
</script>

<div
	class={[
		'inline-flex rounded-xl bg-surface-overlay p-1',
		fullWidth && 'flex w-full',
		className
	]}
	role="radiogroup"
>
	{#each items as item (item.id)}
		<button
			type="button"
			role="radio"
			aria-checked={active === item.id}
			disabled={item.disabled}
			onclick={() => select(item.id, item.disabled)}
			class={[
				'rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
				sizeClasses[size],
				fullWidth && 'flex-1',
				active === item.id
					? 'bg-brand-500 text-white shadow-sm'
					: 'text-secondary hover:bg-surface-elevated/70 hover:text-primary',
				item.disabled && 'cursor-not-allowed opacity-40'
			]}
		>
			{item.label}
		</button>
	{/each}
</div>
