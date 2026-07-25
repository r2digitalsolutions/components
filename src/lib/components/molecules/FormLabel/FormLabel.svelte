<script lang="ts">
	import type { Snippet } from 'svelte';
	import Label from '$lib/components/atoms/Label/Label.svelte';

	interface FormLabelProps {
		for?: string;
		required?: boolean;
		optional?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
	}

	let {
		for: htmlFor,
		required = false,
		optional = false,
		size = 'md',
		class: className = '',
		children
	}: FormLabelProps = $props();
</script>

<Label {required} {optional} {size} for={htmlFor} class={className}>
	{#if children}
		{@render children()}
	{/if}
</Label>
