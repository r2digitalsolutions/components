<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	interface ShareButtonProps {
		url?: string;
		title?: string;
		text?: string;
		label?: string;
		/** Prefer Web Share API when available */
		native?: boolean;
		iconOnly?: boolean;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		class?: string;
		onshare?: () => void;
		oncopy?: () => void;
	}

	let {
		url,
		title = '',
		text = '',
		label = 'Share',
		native = true,
		iconOnly = false,
		size = 'sm',
		variant = 'secondary',
		class: className = '',
		onshare,
		oncopy
	}: ShareButtonProps = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const shareUrl = $derived(url ?? (typeof window !== 'undefined' ? window.location.href : ''));

	async function share() {
		if (native && typeof navigator !== 'undefined' && navigator.share) {
			try {
				await navigator.share({ url: shareUrl, title, text });
				onshare?.();
				return;
			} catch {
				/* user cancelled or unsupported payload — fall through to copy */
			}
		}

		try {
			await navigator.clipboard.writeText(shareUrl);
			copied = true;
			oncopy?.();
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1600);
		} catch {
			copied = false;
		}
	}
</script>

{#if iconOnly}
	<IconButton
		{label}
		{size}
		{variant}
		class={className}
		onclick={share}
	>
		{#if copied}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
				/>
			</svg>
		{/if}
	</IconButton>
{:else}
	<Button {variant} {size} class={className} onclick={share}>
		{#if copied}
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
			</svg>
			Copied
		{:else}
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
				/>
			</svg>
			{label}
		{/if}
	</Button>
{/if}
