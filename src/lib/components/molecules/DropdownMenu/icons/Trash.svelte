<script lang="ts">
	let {
		class: className = '',
		size = 16,
		strokeWidth = 2
	}: { class?: string; size?: number | string; strokeWidth?: number | string } = $props();
</script>

<svg
	class={className}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d="M3 6h18" />
	<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
	<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
</svg>
