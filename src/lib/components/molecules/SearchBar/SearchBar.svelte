<script lang="ts">
	import type { Snippet } from 'svelte';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Kbd from '$lib/components/atoms/Kbd/Kbd.svelte';

	interface SearchBarProps {
		value?: string;
		placeholder?: string;
		buttonLabel?: string;
		/** Hide the submit button (Enter still submits) */
		showButton?: boolean;
		loading?: boolean;
		disabled?: boolean;
		/**
		 * joined — input + button in one chrome (default)
		 * soft — header-style field with shortcut hint
		 * plain — minimal underline-less soft field
		 */
		variant?: 'joined' | 'soft' | 'plain';
		size?: 'sm' | 'md' | 'lg';
		/** Shortcut hint, e.g. "⌘K" — shown when empty (soft/plain) or always trailing */
		shortcut?: string;
		class?: string;
		/** Extra controls to the right of the field (filters, etc.) */
		actions?: Snippet;
		onsubmit?: (value: string) => void;
		onclear?: () => void;
		oninput?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search…',
		buttonLabel = 'Search',
		showButton = true,
		loading = false,
		disabled = false,
		variant = 'joined',
		size = 'md',
		shortcut = '',
		class: className = '',
		actions,
		onsubmit,
		onclear,
		oninput
	}: SearchBarProps = $props();

	const inputId = `searchbar-${Math.random().toString(36).slice(2, 9)}`;
	const busy = $derived(disabled || loading);
	const hasValue = $derived(value.trim().length > 0);
	const showShortcut = $derived(Boolean(shortcut) && !hasValue && !loading);

	const heightClass = $derived(size === 'sm' ? 'h-9' : size === 'lg' ? 'h-12' : 'h-10');
	const textClass = $derived(size === 'lg' ? 'text-base' : 'text-sm');
	const iconClass = $derived(size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4');
	const btnPad = $derived(size === 'sm' ? 'px-3 text-xs' : size === 'lg' ? 'px-5 text-sm' : 'px-4 text-sm');

	function submit() {
		if (busy) return;
		onsubmit?.(value);
	}

	function clear() {
		value = '';
		onclear?.();
		oninput?.('');
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submit();
		} else if (e.key === 'Escape' && hasValue) {
			e.preventDefault();
			clear();
		}
	}

	function handleInput(e: Event) {
		value = (e.currentTarget as HTMLInputElement).value;
		oninput?.(value);
	}
</script>

<div class={['w-full', className]}>
	<div
		class={[
			'flex w-full items-center transition-all duration-200',
			heightClass,
			variant === 'joined' &&
				'items-stretch gap-1 rounded-xl border border-border bg-surface-elevated p-1 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20',
			variant === 'soft' &&
				'items-center gap-2 rounded-xl border border-border/80 bg-surface-overlay/80 px-3 focus-within:border-brand-500 focus-within:bg-surface-elevated focus-within:ring-2 focus-within:ring-brand-500/20',
			variant === 'plain' &&
				'items-center gap-2 rounded-lg border border-transparent bg-surface-overlay px-3 focus-within:border-border focus-within:bg-surface-elevated',
			busy && 'opacity-60'
		]}
	>
		<label for={inputId} class="sr-only">{placeholder}</label>

		<span class={['flex shrink-0 items-center text-muted', variant === 'joined' && 'pl-2']} aria-hidden="true">
			{#if loading}
				<LoaderCircle class={['animate-spin', iconClass]} strokeWidth={2} />
			{:else}
				<Search class={iconClass} strokeWidth={2} />
			{/if}
		</span>

		<input
			id={inputId}
			type="search"
			class={[
				'min-w-0 flex-1 self-center bg-transparent text-primary outline-none placeholder:text-muted',
				'disabled:cursor-not-allowed',
				'[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
				textClass,
				variant === 'joined' && 'px-1'
			]}
			{placeholder}
			{disabled}
			value={value}
			autocomplete="off"
			spellcheck="false"
			aria-busy={loading}
			oninput={handleInput}
			onkeydown={onKeydown}
		/>

		{#if hasValue && !loading}
			<button
				type="button"
				class="my-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-overlay hover:text-primary"
				aria-label="Clear search"
				disabled={busy}
				onclick={clear}
			>
				<X class="h-3.5 w-3.5" strokeWidth={2} />
			</button>
		{/if}

		{#if showShortcut}
			<span class="my-auto hidden shrink-0 sm:inline-flex">
				<Kbd size="sm">{shortcut}</Kbd>
			</span>
		{/if}

		{#if showButton && variant === 'joined'}
			<button
				type="button"
				class={[
					'inline-flex shrink-0 items-center justify-center self-stretch rounded-lg font-medium transition-colors',
					'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
					'disabled:cursor-not-allowed disabled:opacity-60',
					btnPad
				]}
				disabled={busy}
				onclick={submit}
			>
				{buttonLabel}
			</button>
		{:else if showButton && variant !== 'joined'}
			<button
				type="button"
				class={[
					'inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition-colors',
					'bg-brand-500 text-white hover:bg-brand-600',
					'disabled:cursor-not-allowed disabled:opacity-60',
					size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-xs'
				]}
				disabled={busy}
				onclick={submit}
			>
				{buttonLabel}
			</button>
		{/if}
	</div>

	{#if actions}
		<div class="mt-2 flex flex-wrap items-center gap-2">
			{@render actions()}
		</div>
	{/if}
</div>
