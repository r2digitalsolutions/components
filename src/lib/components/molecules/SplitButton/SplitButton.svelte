<script lang="ts">
	import DropdownMenu from '$lib/components/molecules/DropdownMenu/DropdownMenu.svelte';
	import type { DropdownItem } from '$lib/components/molecules/DropdownMenu/DropdownMenu.svelte';

	type SplitVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	type SplitSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	interface SplitButtonProps {
		label: string;
		items?: DropdownItem[];
		variant?: SplitVariant;
		size?: SplitSize;
		disabled?: boolean;
		loading?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		onselect?: (id: string, item: DropdownItem) => void;
	}

	let {
		label,
		items = [],
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		class: className = '',
		onclick,
		onselect
	}: SplitButtonProps = $props();

	const isDisabled = $derived(disabled || loading);

	const heightClasses: Record<SplitSize, string> = {
		xs: 'h-7',
		sm: 'h-8',
		md: 'h-10',
		lg: 'h-11',
		xl: 'h-12'
	};

	const labelPad: Record<SplitSize, string> = {
		xs: 'px-2.5 text-xs gap-1',
		sm: 'px-3 text-sm gap-1.5',
		md: 'px-4 text-sm gap-2',
		lg: 'px-5 text-base gap-2',
		xl: 'px-6 text-base gap-2.5'
	};

	const menuWidth: Record<SplitSize, string> = {
		xs: 'w-7',
		sm: 'w-8',
		md: 'w-10',
		lg: 'w-11',
		xl: 'w-12'
	};

	const chevronSize: Record<SplitSize, string> = {
		xs: 'h-3 w-3',
		sm: 'h-3.5 w-3.5',
		md: 'h-4 w-4',
		lg: 'h-4 w-4',
		xl: 'h-5 w-5'
	};

	const shellClasses: Record<SplitVariant, string> = {
		primary: 'bg-brand-500 text-white shadow-sm',
		secondary: 'bg-surface-elevated text-primary border border-border shadow-sm',
		ghost: 'text-secondary',
		outline: 'border-2 border-brand-500 text-brand-600 dark:text-brand-400',
		destructive: 'bg-red-500 text-white shadow-sm'
	};

	const hoverMain: Record<SplitVariant, string> = {
		primary: 'hover:bg-brand-600 active:bg-brand-700',
		secondary: 'hover:bg-surface-overlay',
		ghost: 'hover:bg-surface-overlay hover:text-primary',
		outline: 'hover:bg-brand-50 dark:hover:bg-brand-950',
		destructive: 'hover:bg-red-600 active:bg-red-700'
	};

	const hoverMenu: Record<SplitVariant, string> = {
		primary: 'hover:bg-brand-600/80',
		secondary: 'hover:bg-surface-overlay',
		ghost: 'hover:bg-surface-overlay hover:text-primary',
		outline: 'hover:bg-brand-50 dark:hover:bg-brand-950',
		destructive: 'hover:bg-red-600/80'
	};

	const dividerClasses: Record<SplitVariant, string> = {
		primary: 'bg-white/25',
		secondary: 'bg-border',
		ghost: 'bg-border',
		outline: 'bg-brand-500/40',
		destructive: 'bg-white/25'
	};

	const focusRing: Record<SplitVariant, string> = {
		primary: 'focus-visible:ring-brand-500',
		secondary: 'focus-visible:ring-brand-500',
		ghost: 'focus-visible:ring-brand-500',
		outline: 'focus-visible:ring-brand-500',
		destructive: 'focus-visible:ring-red-500'
	};
</script>

<div
	class={[
		'split-button inline-flex items-stretch overflow-hidden rounded-lg',
		heightClasses[size],
		shellClasses[variant],
		isDisabled && 'opacity-50',
		className
	]}
	role="group"
	aria-label={label}
>
	<button
		type="button"
		class={[
			'inline-flex h-full items-center justify-center font-medium transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
			labelPad[size],
			hoverMain[variant],
			focusRing[variant],
			isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
		]}
		disabled={isDisabled}
		aria-busy={loading}
		onclick={(e) => onclick?.(e)}
	>
		{#if loading}
			<svg
				class={['animate-spin', chevronSize[size]]}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				></path>
			</svg>
		{/if}
		{label}
	</button>

	<span class={['w-px shrink-0 self-stretch', dividerClasses[variant]]} aria-hidden="true"></span>

	<DropdownMenu
		{items}
		disabled={isDisabled}
		align="end"
		label="{label} options"
		class="split-button-menu"
		onselect={(id, item) => onselect?.(id, item)}
	>
		{#snippet trigger()}
			<span
				class={[
					'inline-flex h-full items-center justify-center transition-colors',
					menuWidth[size],
					hoverMenu[variant]
				]}
				aria-hidden="true"
			>
				<svg
					class={chevronSize[size]}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</span>
		{/snippet}
	</DropdownMenu>
</div>

<style>
	/* Classes on DropdownMenu root are outside this component's scope — use :global */
	.split-button :global(.split-button-menu) {
		display: flex;
		height: 100%;
		align-self: stretch;
		color: inherit;
	}

	.split-button :global(.split-button-menu > button) {
		display: flex;
		height: 100%;
		min-height: 0 !important;
		align-items: stretch;
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
		padding: 0 !important;
		box-shadow: none !important;
		color: inherit !important;
	}

	.split-button :global(.split-button-menu > button:hover) {
		background: transparent !important;
	}

	.split-button :global(.split-button-menu > button:focus-visible) {
		outline: none;
		box-shadow: inset 0 0 0 2px color-mix(in oklab, currentColor 35%, transparent);
	}
</style>
