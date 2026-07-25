<script lang="ts">
	interface OverlayProps {
		open?: boolean;
		blur?: boolean;
		opacity?: 'light' | 'medium' | 'heavy';
		placement?: 'fixed' | 'absolute';
		zIndex?: string;
		class?: string;
		onclick?: () => void;
	}

	const {
		open = true,
		blur = true,
		opacity = 'medium',
		placement = 'fixed',
		zIndex = '40',
		class: className = '',
		onclick
	}: OverlayProps = $props();

	const tones = {
		light: 'bg-black/20',
		medium: 'bg-black/40',
		heavy: 'bg-black/60'
	};
</script>

{#if open}
	<button
		type="button"
		aria-label="Close overlay"
		class={[
			'inset-0 border-0 p-0',
			placement,
			tones[opacity],
			blur && 'backdrop-blur-sm',
			className
		]}
		style:z-index={zIndex}
		onclick={() => onclick?.()}
	></button>
{/if}
