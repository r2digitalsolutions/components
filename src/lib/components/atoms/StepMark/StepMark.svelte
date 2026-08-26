<script lang="ts">
	export type StepMarkState = 'complete' | 'current' | 'upcoming';

	interface StepMarkProps {
		step?: number;
		state?: StepMarkState;
		label?: string;
		size?: 'sm' | 'md';
		class?: string;
	}

	const {
		step = 1,
		state = 'upcoming',
		label,
		size = 'md',
		class: className = ''
	}: StepMarkProps = $props();

	const dims = $derived(size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs');
</script>

<span class={['inline-flex items-center gap-2', className]}>
	<span
		class={[
			'inline-flex shrink-0 items-center justify-center rounded-full font-semibold tabular-nums transition-colors',
			dims,
			state === 'complete' && 'bg-brand-500 text-white',
			state === 'current' && 'bg-brand-500 text-white',
			state === 'upcoming' && 'bg-surface-overlay text-muted ring-1 ring-border'
		]}
		aria-current={state === 'current' ? 'step' : undefined}
	>
		{#if state === 'complete'}
			<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
			</svg>
		{:else}
			{step}
		{/if}
	</span>
	{#if label}
		<span
			class={[
				'text-sm',
				state === 'upcoming' ? 'text-muted' : 'font-medium text-primary'
			]}
		>
			{label}
		</span>
	{/if}
</span>
