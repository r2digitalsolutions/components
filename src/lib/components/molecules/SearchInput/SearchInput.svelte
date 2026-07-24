<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';

	interface SearchInputProps {
		value?: string;
		placeholder?: string;
		label?: string;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		oninput?: (e: Event) => void;
		onsubmit?: (value: string) => void;
		onchange?: (e: Event) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search…',
		label,
		disabled = false,
		size = 'md',
		class: className = '',
		oninput,
		onsubmit,
		onchange
	}: SearchInputProps = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') onsubmit?.(value);
	}
</script>

<div class={className} onkeydown={handleKeydown}>
	<Input
		{label}
		{placeholder}
		{disabled}
		{size}
		type="search"
		clearable
		bind:value
		{oninput}
		{onchange}
	>
		{#snippet leadIcon()}
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
			</svg>
		{/snippet}
	</Input>
</div>
