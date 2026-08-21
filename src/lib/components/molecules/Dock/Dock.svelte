<script lang="ts">
	import type { Snippet } from 'svelte';

	export type DockSize = 'mini' | 'sm' | 'md';

	interface DockProps {
		size?: DockSize;
		class?: string;
		children?: Snippet;
	}

	let { size = 'mini', class: className = '', children }: DockProps = $props();

	const sizes: Record<DockSize, string> = {
		mini: 'rounded-full p-0.5',
		sm: 'rounded-full p-0.5',
		md: 'rounded-2xl p-1'
	};
</script>

<div
	class={[
		'border-border/70 bg-surface-overlay/80 shadow-sm backdrop-blur-md isolate inline-flex items-center overflow-hidden border',
		sizes[size],
		className
	]}
>
	{@render children?.()}
</div>
