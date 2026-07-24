<script lang="ts">
	import '../app.css';
	import { themeStore } from '$lib/utils/theme.svelte.js';
	import ToastContainer from '$lib/components/organisms/Toast/ToastContainer.svelte';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen bg-surface text-primary transition-colors duration-200">
	{@render children()}
</div>

<!-- Global toast notifications -->
<ToastContainer position="bottom-right" />
