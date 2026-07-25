<script lang="ts">
	import type { Snippet } from 'svelte';
	import Banner from '$lib/components/molecules/Banner/Banner.svelte';

	interface UnsavedChangesProps {
		dirty?: boolean;
		showBanner?: boolean;
		title?: string;
		description?: string;
		class?: string;
		actions?: Snippet;
	}

	let {
		dirty = false,
		showBanner = true,
		title = 'Unsaved changes',
		description = 'You have unsaved changes. Leave without saving?',
		class: className = '',
		actions
	}: UnsavedChangesProps = $props();

	$effect(() => {
		if (typeof window === 'undefined') return;
		const handler = (e: BeforeUnloadEvent) => {
			if (!dirty) return;
			e.preventDefault();
			e.returnValue = '';
		};
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	});
</script>

{#if dirty && showBanner}
	<Banner {title} {description} variant="warning" dismissible={false} class={className}>
		{#if actions}{@render actions()}{/if}
	</Banner>
{/if}
