<script lang="ts">
	interface RatingProps {
		value?: number;
		max?: number;
		size?: 'sm' | 'md' | 'lg';
		readonly?: boolean;
		class?: string;
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(0),
		max = 5,
		size = 'md',
		readonly = false,
		class: className = '',
		onchange
	}: RatingProps = $props();

	let hover = $state(0);

	const iconSize = $derived(
		{ sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' }[size]
	);

	function setValue(next: number) {
		if (readonly) return;
		value = next;
		onchange?.(next);
	}
</script>

<div
	class={['inline-flex items-center gap-0.5', className]}
	role={readonly ? 'img' : 'radiogroup'}
	aria-label="Rating"
>
	{#each Array.from({ length: max }, (_, i) => i + 1) as star (star)}
		{@const active = (hover || value) >= star}
		<button
			type="button"
			disabled={readonly}
			aria-label={`${star} star${star === 1 ? '' : 's'}`}
			aria-checked={value === star}
			role={readonly ? undefined : 'radio'}
			onmouseenter={() => !readonly && (hover = star)}
			onmouseleave={() => (hover = 0)}
			onclick={() => setValue(star)}
			class={[
				'rounded p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
				readonly ? 'cursor-default' : 'cursor-pointer',
				active ? 'text-amber-400' : 'text-border-strong'
			]}
		>
			<svg class={iconSize} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path
					d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.77l-5.8 3.05 1.11-6.47-4.7-4.58 6.49-.94L12 2.5z"
				/>
			</svg>
		</button>
	{/each}
</div>
