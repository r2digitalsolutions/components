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
	<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
	<polyline points="16 6 12 2 8 6" />
	<line x1="12" x2="12" y1="2" y2="15" />
</svg>
