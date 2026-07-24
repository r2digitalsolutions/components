<script lang="ts">
	import type { Snippet } from 'svelte';

	interface LabelProps {
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
	}: LabelProps = $props();

	const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base'
	};
</script>

<label
	for={htmlFor}
	class={[
		'inline-flex items-center gap-1 font-medium text-primary',
		sizeClasses[size],
		className
	]}
>
	{#if children}
		{@render children()}
	{/if}
	{#if required}
		<span class="text-red-500" aria-hidden="true">*</span>
	{:else if optional}
		<span class="font-normal text-muted">(optional)</span>
	{/if}
</label>
