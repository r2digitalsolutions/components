<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface DownloadButtonProps {
		href?: string;
		filename?: string;
		label?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		disabled?: boolean;
		loading?: boolean;
		class?: string;
		onclick?: () => void;
	}

	const {
		href,
		filename,
		label = 'Download',
		size = 'sm',
		variant = 'secondary',
		disabled = false,
		loading = false,
		class: className = '',
		onclick
	}: DownloadButtonProps = $props();

	function handleClick(e: MouseEvent) {
		if (!href) {
			e.preventDefault();
			onclick?.();
			return;
		}
		onclick?.();
	}
</script>

{#if href}
	<a
		{href}
		download={filename}
		class="inline-flex no-underline"
		aria-disabled={disabled || loading}
		onclick={(e) => {
			if (disabled || loading) {
				e.preventDefault();
				return;
			}
			handleClick(e);
		}}
	>
		<Button {variant} {size} {disabled} {loading} class={className} type="button">
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
			</svg>
			{label}
		</Button>
	</a>
{:else}
	<Button {variant} {size} {disabled} {loading} class={className} onclick={handleClick}>
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
		</svg>
		{label}
	</Button>
{/if}
