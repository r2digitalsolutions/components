<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SafeAreaProps {
		top?: boolean;
		bottom?: boolean;
		left?: boolean;
		right?: boolean;
		/** Extra padding on top of safe insets */
		offset?: string;
		class?: string;
		children?: Snippet;
	}

	const {
		top = true,
		bottom = true,
		left = false,
		right = false,
		offset = '0px',
		class: className = '',
		children
	}: SafeAreaProps = $props();

	const style = $derived(
		[
			top &&
				`padding-top: max(${offset}, env(safe-area-inset-top, 0px), var(--phone-safe-top, 0px))`,
			bottom &&
				`padding-bottom: max(${offset}, env(safe-area-inset-bottom, 0px), var(--phone-safe-bottom, 0px))`,
			left && `padding-left: max(${offset}, env(safe-area-inset-left, 0px))`,
			right && `padding-right: max(${offset}, env(safe-area-inset-right, 0px))`
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<div class={['w-full', className]} style={style}>
	{@render children?.()}
</div>
