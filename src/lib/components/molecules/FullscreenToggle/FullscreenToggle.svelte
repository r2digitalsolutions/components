<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	interface FullscreenToggleProps {
		target?: HTMLElement | null;
		active?: boolean;
		size?: 'sm' | 'md' | 'lg';
		enterLabel?: string;
		exitLabel?: string;
		class?: string;
		onchange?: (active: boolean) => void;
	}

	let {
		target = null,
		active = $bindable(false),
		size = 'md',
		enterLabel = 'Enter fullscreen',
		exitLabel = 'Exit fullscreen',
		class: className = '',
		onchange
	}: FullscreenToggleProps = $props();

	$effect(() => {
		function onChange() {
			active = !!document.fullscreenElement;
			onchange?.(active);
		}
		document.addEventListener('fullscreenchange', onChange);
		return () => document.removeEventListener('fullscreenchange', onChange);
	});

	async function toggle() {
		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			} else {
				const el = target ?? document.documentElement;
				await el.requestFullscreen();
			}
		} catch {
			/* ignored — browser may block without gesture */
		}
	}
</script>

<IconButton
	variant="ghost"
	{size}
	label={active ? exitLabel : enterLabel}
	aria-pressed={active}
	class={className}
	onclick={toggle}
>
	{#if active}
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 9H5v4M15 9h4v4M9 15H5v-4M15 15h4v-4" />
		</svg>
	{:else}
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 3H5a2 2 0 00-2 2v4M15 3h4a2 2 0 012 2v4M9 21H5a2 2 0 01-2-2v-4M15 21h4a2 2 0 002-2v-4" />
		</svg>
	{/if}
</IconButton>
