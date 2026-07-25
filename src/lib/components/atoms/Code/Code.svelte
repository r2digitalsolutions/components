<script lang="ts">
	import type { Snippet } from 'svelte';

	type CodeSize = 'sm' | 'md';

	interface CodeProps {
		size?: CodeSize;
		/** Copyable block style vs inline */
		block?: boolean;
		class?: string;
		children?: Snippet;
	}

	const { size = 'sm', block = false, class: className = '', children }: CodeProps = $props();

	const sizeClasses: Record<CodeSize, string> = {
		sm: 'text-xs',
		md: 'text-sm'
	};
</script>

{#if block}
	<pre
		class={[
			'overflow-x-auto rounded-xl border border-border bg-surface-overlay px-3 py-2 font-mono text-primary',
			sizeClasses[size],
			className
		]}><code>{@render children?.()}</code></pre>
{:else}
	<code
		class={[
			'rounded-md border border-border bg-surface-overlay px-1.5 py-0.5 font-mono text-primary',
			sizeClasses[size],
			className
		]}>{@render children?.()}</code>
{/if}
