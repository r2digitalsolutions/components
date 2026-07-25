<script lang="ts">
	export type PulseTone = 'brand' | 'success' | 'warning' | 'danger' | 'info';

	interface PulseDotProps {
		tone?: PulseTone;
		size?: 'sm' | 'md' | 'lg';
		pulse?: boolean;
		label?: string;
		class?: string;
	}

	const {
		tone = 'brand',
		size = 'md',
		pulse = true,
		label,
		class: className = ''
	}: PulseDotProps = $props();

	const colors: Record<PulseTone, string> = {
		brand: 'bg-brand-500',
		success: 'bg-emerald-500',
		warning: 'bg-amber-500',
		danger: 'bg-red-500',
		info: 'bg-sky-500'
	};

	const sizes = { sm: 'h-2 w-2', md: 'h-2.5 w-2.5', lg: 'h-3.5 w-3.5' };
</script>

<span class={['relative inline-flex', className]} role="status" aria-label={label ?? tone}>
	<span class={['rounded-full', colors[tone], sizes[size]]} aria-hidden="true"></span>
	{#if pulse}
		<span
			class={['absolute inset-0 animate-ping rounded-full opacity-50', colors[tone], sizes[size]]}
			aria-hidden="true"
		></span>
	{/if}
</span>
