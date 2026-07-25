<script lang="ts">
	import Banner from '$lib/components/molecules/Banner/Banner.svelte';

	interface OfflineBannerProps {
		/** Force online/offline; when undefined, uses navigator.onLine */
		forced?: boolean | null;
		title?: string;
		description?: string;
		class?: string;
	}

	let {
		forced = null,
		title = "You're offline",
		description = 'Some features may be unavailable until your connection is restored.',
		class: className = ''
	}: OfflineBannerProps = $props();

	let online = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const sync = () => (online = navigator.onLine);
		window.addEventListener('online', sync);
		window.addEventListener('offline', sync);
		return () => {
			window.removeEventListener('online', sync);
			window.removeEventListener('offline', sync);
		};
	});

	const isOnline = $derived(forced === null ? online : forced);
</script>

{#if !isOnline}
	<Banner {title} {description} variant="warning" dismissible={false} class={className} />
{/if}
