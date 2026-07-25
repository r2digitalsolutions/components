<script lang="ts">
	import type { Snippet } from 'svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';

	interface FormGroupProps {
		/** Accessible group title (`<legend>`) */
		legend?: string;
		description?: string;
		/** Soft bordered panel around the group */
		variant?: 'plain' | 'card' | 'inset';
		gap?: 'sm' | 'md' | 'lg';
		columns?: 1 | 2;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		legend,
		description,
		variant = 'plain',
		gap = 'md',
		columns = 1,
		disabled = false,
		class: className = '',
		children
	}: FormGroupProps = $props();

	const gapClass = $derived(gap === 'sm' ? 'gap-3' : gap === 'lg' ? 'gap-6' : 'gap-4');
</script>

<fieldset
	class={[
		'min-w-0',
		variant === 'card' &&
			'rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm sm:p-5',
		variant === 'inset' && 'rounded-xl border border-border bg-surface-overlay/40 p-4',
		disabled && 'pointer-events-none opacity-60',
		className
	]}
	{disabled}
>
	{#if legend}
		<legend
			class={[
				'px-0.5 text-sm font-semibold text-primary',
				variant !== 'plain' && 'mb-1'
			]}
		>
			{legend}
		</legend>
	{/if}

	{#if description}
		<FormDescription class="mb-3" text={description} />
	{/if}

	<div
		class={[
			'flex flex-col',
			gapClass,
			columns === 2 && 'md:grid md:grid-cols-2'
		]}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
</fieldset>
