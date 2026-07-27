<script lang="ts">
	import type { MarqueeRect as MarqueeRectBox } from '$lib/utils/marqueeSelect.js';

	interface MarqueeRectProps {
		rect?: MarqueeRectBox | null;
		class?: string;
	}

	let { rect = null, class: className = '' }: MarqueeRectProps = $props();
</script>

{#if rect && rect.width > 0 && rect.height > 0}
	<div
		class={[
			'pointer-events-none absolute z-50 rounded-sm border border-brand-500 bg-brand-500/15',
			className
		]}
		style={`left:${rect.x}px;top:${rect.y}px;width:${rect.width}px;height:${rect.height}px`}
		aria-hidden="true"
	></div>
{/if}
