<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface CopyButtonProps {
		value: string;
		label?: string;
		copiedLabel?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		class?: string;
		oncopy?: () => void;
	}

	let {
		value,
		label = 'Copy',
		copiedLabel = 'Copied',
		size = 'sm',
		variant = 'secondary',
		class: className = '',
		oncopy
	}: CopyButtonProps = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(value);
			copied = true;
			oncopy?.();
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1600);
		} catch {
			copied = false;
		}
	}
</script>

<Button {variant} {size} class={className} onclick={copy}>
	{#if copied}
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
		</svg>
		{copiedLabel}
	{:else}
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<rect x="9" y="9" width="13" height="13" rx="2" />
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
		</svg>
		{label}
	{/if}
</Button>
