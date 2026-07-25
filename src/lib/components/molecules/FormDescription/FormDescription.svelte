<script lang="ts">
	import type { Snippet } from 'svelte';
	import FieldHint from '$lib/components/atoms/FieldHint/FieldHint.svelte';

	interface FormDescriptionProps {
		/** Plain text helper (ignored when `children` is set) */
		text?: string;
		tone?: 'muted' | 'info' | 'success' | 'warning' | 'error';
		id?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		text = '',
		tone = 'muted',
		id,
		class: className = '',
		children
	}: FormDescriptionProps = $props();
</script>

{#if children}
	<div {id} class={['text-xs leading-relaxed text-muted', className]}>
		{@render children()}
	</div>
{:else if text}
	<FieldHint {text} {tone} {id} class={className} />
{/if}
