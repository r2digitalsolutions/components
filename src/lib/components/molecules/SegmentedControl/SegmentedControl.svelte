<script lang="ts">
	import type { Component } from 'svelte';

	export interface SegmentItem {
		id: string;
		label: string;
		disabled?: boolean;
		icon?: Component<{ class?: string; size?: number | string; strokeWidth?: number | string }>;
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

	/** Avoid `$derived` here: SSR with async parent snippets has flaked on `$.derived` (undefined). */
	function getActive() {
		const list = Array.isArray(items) ? items : [];
		return value || list.find((i) => !i.disabled)?.id || '';
	}

	const sizeClasses = {
		sm: 'h-7 gap-1 px-2.5 text-xs',
		md: 'h-9 gap-1.5 px-3 text-sm',
		lg: 'h-10 gap-1.5 px-4 text-sm'
	};

	const iconSize = {
		sm: 12,
		md: 14,
		lg: 16
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
		{@const isActive = getActive() === item.id}
		{@const Icon = item.icon}
		<button
			type="button"
			role="radio"
			aria-checked={isActive}
			disabled={item.disabled}
			onclick={() => select(item.id, item.disabled)}
			class={[
				'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
				sizeClasses[size],
				fullWidth && 'flex-1',
				isActive
					? 'bg-brand-500 text-white shadow-sm'
					: 'text-secondary hover:bg-surface-elevated/70 hover:text-primary',
				item.disabled && 'cursor-not-allowed opacity-40'
			]}
		>
			{#if Icon}
				<Icon class="shrink-0" size={iconSize[size]} strokeWidth={2.25} />
			{/if}
			<span>{item.label}</span>
		</button>
	{/each}
</div>
