<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	type CloseButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	type CloseButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	interface CloseButtonProps {
		label?: string;
		variant?: CloseButtonVariant;
		size?: CloseButtonSize;
		rounded?: boolean;
		disabled?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
	}

	const {
		label = 'Close',
		variant = 'ghost',
		size = 'sm',
		rounded = false,
		disabled = false,
		class: className = '',
		onclick
	}: CloseButtonProps = $props();
</script>

<IconButton {label} {variant} {size} {rounded} {disabled} class={className} {onclick}>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
	</svg>
</IconButton>
