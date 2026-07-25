<script lang="ts">
	import type { Snippet } from 'svelte';
	import Label from '$lib/components/atoms/Label/Label.svelte';
	import FieldHint from '$lib/components/atoms/FieldHint/FieldHint.svelte';

	interface InputGroupProps {
		label?: string;
		value?: string;
		placeholder?: string;
		prefix?: string;
		suffix?: string;
		disabled?: boolean;
		required?: boolean;
		hint?: string;
		type?: 'text' | 'email' | 'url' | 'number' | 'tel';
		class?: string;
		prefixSlot?: Snippet;
		suffixSlot?: Snippet;
		oninput?: (e: Event) => void;
	}

	let {
		label,
		value = $bindable(''),
		placeholder = '',
		prefix,
		suffix,
		disabled = false,
		required = false,
		hint,
		type = 'text',
		class: className = '',
		prefixSlot,
		suffixSlot,
		oninput
	}: InputGroupProps = $props();

	const id = `ig-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class={['w-full space-y-1.5', className]}>
	{#if label}
		<Label for={id} {required}>{label}</Label>
	{/if}
	<div
		class={[
			'flex h-10 overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-sm',
			'focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20',
			disabled && 'opacity-50'
		]}
	>
		{#if prefix || prefixSlot}
			<span
				class="inline-flex items-center border-r border-border bg-surface-overlay px-3 text-sm text-muted"
			>
				{#if prefixSlot}
					{@render prefixSlot()}
				{:else}
					{prefix}
				{/if}
			</span>
		{/if}
		<input
			{id}
			{type}
			{placeholder}
			{disabled}
			{required}
			bind:value
			{oninput}
			class="min-w-0 flex-1 bg-transparent px-3 text-sm text-primary outline-none placeholder:text-muted"
		/>
		{#if suffix || suffixSlot}
			<span
				class="inline-flex items-center border-l border-border bg-surface-overlay px-3 text-sm text-muted"
			>
				{#if suffixSlot}
					{@render suffixSlot()}
				{:else}
					{suffix}
				{/if}
			</span>
		{/if}
	</div>
	{#if hint}
		<FieldHint text={hint} />
	{/if}
</div>
