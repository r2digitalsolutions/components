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
	<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
	<path d="M14 2v4a2 2 0 0 0 2 2h4" />
</svg>
