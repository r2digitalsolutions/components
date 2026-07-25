<script lang="ts">
	import StatusDot from '$lib/components/atoms/StatusDot/StatusDot.svelte';

	interface NetworkStatusProps {
		forced?: boolean | null;
		showLabel?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		forced = null,
		showLabel = true,
		size = 'md',
		class: className = ''
	}: NetworkStatusProps = $props();

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

<StatusDot
	status={isOnline ? 'online' : 'offline'}
	label={isOnline ? 'Online' : 'Offline'}
	{showLabel}
	{size}
	pulse={isOnline}
	class={className}
/>
