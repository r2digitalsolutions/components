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
	<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
	<path d="M4 16V4a2 2 0 0 1 2-2h10" />
</svg>
