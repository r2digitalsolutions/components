<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';

	interface SearchInputProps {
		value?: string;
		placeholder?: string;
		label?: string;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		/** Accessible label for the submit control. */
		submitLabel?: string;
		/** Show the trailing submit button. Default true. */
		showSubmit?: boolean;
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
		submitLabel = 'Search',
		showSubmit = true,
		oninput,
		onsubmit,
		onchange
	}: SearchInputProps = $props();

	const submitButtonSize = $derived(size === 'sm' ? 'xs' : 'sm');

	function submit() {
		onsubmit?.(value);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		submit();
	}
</script>

{#snippet leadIcon()}
	<svg
		class="h-4 w-4"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
		/>
	</svg>
{/snippet}

{#snippet trailIcon()}
	<IconButton
		type="button"
		variant="ghost"
		size={submitButtonSize}
		label={submitLabel}
		{disabled}
		class="-me-1.5"
		onclick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			submit();
		}}
	>
		<svg
			class="h-full w-full"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
			/>
		</svg>
	</IconButton>
{/snippet}

<Input
	{label}
	{placeholder}
	{disabled}
	{size}
	type="search"
	clearable
	class={className}
	bind:value
	{oninput}
	{onchange}
	onkeydown={handleKeydown}
	{leadIcon}
	trailIcon={showSubmit ? trailIcon : undefined}
/>
