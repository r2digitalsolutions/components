<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	interface CameraButtonProps {
		label?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		disabled?: boolean;
		accept?: string;
		capture?: 'user' | 'environment';
		class?: string;
		oncapture?: (file: File) => void;
	}

	const {
		label = 'Take photo',
		size = 'lg',
		variant = 'primary',
		disabled = false,
		accept = 'image/*',
		capture = 'environment',
		class: className = '',
		oncapture
	}: CameraButtonProps = $props();

	let inputEl = $state<HTMLInputElement | null>(null);

	function open() {
		if (disabled) return;
		inputEl?.click();
	}

	function onchange(e: Event) {
		const file = (e.currentTarget as HTMLInputElement).files?.[0];
		if (file) oncapture?.(file);
		(e.currentTarget as HTMLInputElement).value = '';
	}
</script>

<div class={['inline-flex', className]}>
	<IconButton {label} {size} {variant} {disabled} rounded onclick={open}>
		<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"
			/>
			<circle cx="12" cy="13" r="3.5" />
		</svg>
	</IconButton>
	<input
		bind:this={inputEl}
		type="file"
		class="sr-only"
		{accept}
		{capture}
		{disabled}
		{onchange}
	/>
</div>
