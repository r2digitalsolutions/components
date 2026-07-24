<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ButtonGroupProps {
		attached?: boolean;
		orientation?: 'horizontal' | 'vertical';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
		'aria-label'?: string;
	}

	let {
		attached = true,
		orientation = 'horizontal',
		size = 'md',
		class: className = '',
		children,
		'aria-label': ariaLabel = 'Button group'
	}: ButtonGroupProps = $props();
</script>

<div
	role="group"
	aria-label={ariaLabel}
	data-size={size}
	data-attached={attached ? 'true' : 'false'}
	data-orientation={orientation}
	class={[
		'button-group inline-flex',
		orientation === 'vertical' ? 'flex-col' : 'flex-row',
		attached && 'attached',
		!attached && (orientation === 'vertical' ? 'gap-2' : 'gap-2'),
		className
	]}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.button-group.attached :global(> *) {
		border-radius: 0;
	}

	.button-group.attached[data-orientation='horizontal'] :global(> *:first-child) {
		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: 0.5rem;
	}

	.button-group.attached[data-orientation='horizontal'] :global(> *:last-child) {
		border-top-right-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}

	.button-group.attached[data-orientation='vertical'] :global(> *:first-child) {
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}

	.button-group.attached[data-orientation='vertical'] :global(> *:last-child) {
		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}

	.button-group.attached[data-orientation='horizontal'] :global(> *:not(:first-child)) {
		margin-left: -1px;
	}

	.button-group.attached[data-orientation='vertical'] :global(> *:not(:first-child)) {
		margin-top: -1px;
	}
</style>
