<script lang="ts">
	import type { Snippet } from 'svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface SearchBarProps {
		value?: string;
		placeholder?: string;
		buttonLabel?: string;
		loading?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		actions?: Snippet;
		onsubmit?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search…',
		buttonLabel = 'Search',
		loading = false,
		disabled = false,
		size = 'md',
		class: className = '',
		actions,
		onsubmit
	}: SearchBarProps = $props();

	function submit() {
		if (disabled || loading) return;
		onsubmit?.(value);
	}
</script>

<div
	class={[
		'flex w-full flex-col gap-2 sm:flex-row sm:items-center',
		className
	]}
>
	<div class="min-w-0 flex-1">
		<SearchInput
			bind:value
			{placeholder}
			{disabled}
			{size}
			onsubmit={submit}
		/>
	</div>
	<div class="flex shrink-0 items-center gap-2">
		{#if actions}
			{@render actions()}
		{/if}
		<Button {size} {loading} {disabled} onclick={submit}>{buttonLabel}</Button>
	</div>
</div>
