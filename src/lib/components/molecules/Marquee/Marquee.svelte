<script lang="ts">
	import type { Snippet } from 'svelte';

	interface MarqueeProps {
		speed?: number;
		pauseOnHover?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		speed = 30,
		pauseOnHover = true,
		class: className = '',
		children
	}: MarqueeProps = $props();
</script>

<div
	class={['group relative overflow-hidden whitespace-nowrap', className]}
	role="marquee"
	aria-label="Scrolling content"
>
	<div
		class={[
			'inline-flex min-w-full animate-[marquee_var(--marquee-duration)_linear_infinite]',
			pauseOnHover && 'group-hover:[animation-play-state:paused]'
		]}
		style={`--marquee-duration: ${speed}s`}
	>
		<div class="flex shrink-0 items-center gap-8 px-4">
			{#if children}{@render children()}{/if}
		</div>
		<div class="flex shrink-0 items-center gap-8 px-4" aria-hidden="true">
			{#if children}{@render children()}{/if}
		</div>
	</div>
</div>

<style>
	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
</style>
