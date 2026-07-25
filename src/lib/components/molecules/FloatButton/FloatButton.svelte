<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	type FloatPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

	interface FloatButtonProps {
		label: string;
		position?: FloatPosition;
		/** Use `fixed` for viewport, `absolute` when nested in a positioned parent */
		placement?: 'fixed' | 'absolute';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
		size?: 'sm' | 'md' | 'lg' | 'xl';
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		label,
		position = 'bottom-right',
		placement = 'fixed',
		variant = 'primary',
		size = 'lg',
		disabled = false,
		class: className = '',
		children,
		onclick
	}: FloatButtonProps = $props();

	const corners: Record<FloatPosition, string> = {
		'bottom-right': 'bottom-6 right-6',
		'bottom-left': 'bottom-6 left-6',
		'top-right': 'top-6 right-6',
		'top-left': 'top-6 left-6'
	};
</script>

<div class={[placement, corners[position], 'z-50', className]}>
	<IconButton
		{label}
		{variant}
		{size}
		{disabled}
		rounded
		class="shadow-lg shadow-black/10 dark:shadow-black/40"
		{onclick}
	>
		{#if children}
			{@render children()}
		{:else}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
			</svg>
		{/if}
	</IconButton>
</div>
