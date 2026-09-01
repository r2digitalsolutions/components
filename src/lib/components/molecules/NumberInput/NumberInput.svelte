<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';

	interface NumberInputProps {
		name?: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		helperText?: string;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		status?: 'default' | 'error' | 'success' | 'warning';
		/** Stepper UI: none | stacked (▲▼) | sides (− +) */
		controls?: 'none' | 'stacked' | 'sides';
		class?: string;
		onchange?: (value: number) => void;
	}

	let {
		name,
		value = $bindable(0),
		min,
		max,
		step = 1,
		label,
		helperText,
		disabled = false,
		size = 'md',
		status = 'default',
		controls = 'sides',
		class: className = '',
		onchange
	}: NumberInputProps = $props();

	let text = $state(String(value));

	const canDec = $derived(!disabled && (min === undefined || value > min));
	const canInc = $derived(!disabled && (max === undefined || value < max));

	const btnSize = $derived(
		{ sm: 'h-5 w-5 text-xs', md: 'h-6 w-6 text-sm', lg: 'h-7 w-7 text-base' }[size]
	);

	function clamp(n: number) {
		let next = n;
		if (min !== undefined) next = Math.max(min, next);
		if (max !== undefined) next = Math.min(max, next);
		return next;
	}

	/** Avoid float noise like `30.31000000000005` when stepping by 0.01. */
	function decimalsForStep(s: number): number {
		const str = String(s);
		const dot = str.indexOf('.');
		return dot === -1 ? 0 : str.length - dot - 1;
	}

	function roundToStep(n: number): number {
		const decimals = decimalsForStep(step);
		if (decimals <= 0) return Math.round(n);
		const factor = 10 ** decimals;
		return Math.round((n + Number.EPSILON) * factor) / factor;
	}

	function formatValue(n: number): string {
		const decimals = decimalsForStep(step);
		return decimals > 0 ? n.toFixed(decimals) : String(n);
	}

	$effect(() => {
		text = formatValue(value);
	});

	function commit(raw: string) {
		const parsed = Number(raw);
		if (Number.isNaN(parsed)) {
			text = formatValue(value);
			return;
		}
		const next = clamp(roundToStep(parsed));
		value = next;
		text = formatValue(next);
		onchange?.(next);
	}

	function nudge(dir: 1 | -1) {
		if (disabled) return;
		if (dir < 0 && !canDec) return;
		if (dir > 0 && !canInc) return;
		const next = clamp(roundToStep(value + dir * step));
		value = next;
		text = formatValue(next);
		onchange?.(next);
	}
</script>

<div class={['number-input w-full', className]}>
	{#if controls === 'sides'}
		<Input
			{name}
			{label}
			{helperText}
			{disabled}
			{size}
			{status}
			type="number"
			bind:value={text}
			onblur={() => commit(text)}
			onchange={() => commit(text)}
		>
			{#snippet leadIcon()}
				<button
					type="button"
					tabindex="-1"
					disabled={!canDec}
					onclick={() => nudge(-1)}
					class={[
						'inline-flex items-center justify-center rounded-md border border-border bg-surface-overlay text-secondary transition-colors',
						'hover:bg-surface hover:text-primary disabled:cursor-not-allowed disabled:opacity-40',
						btnSize
					]}
					aria-label="Decrement"
				>
					<span class="leading-none" aria-hidden="true">−</span>
				</button>
			{/snippet}
			{#snippet trailIcon()}
				<button
					type="button"
					tabindex="-1"
					disabled={!canInc}
					onclick={() => nudge(1)}
					class={[
						'inline-flex items-center justify-center rounded-md border border-border bg-surface-overlay text-secondary transition-colors',
						'hover:bg-surface hover:text-primary disabled:cursor-not-allowed disabled:opacity-40',
						btnSize
					]}
					aria-label="Increment"
				>
					<span class="leading-none" aria-hidden="true">+</span>
				</button>
			{/snippet}
		</Input>
	{:else if controls === 'stacked'}
		<Input
			{name}
			{label}
			{helperText}
			{disabled}
			{size}
			{status}
			type="number"
			bind:value={text}
			onblur={() => commit(text)}
			onchange={() => commit(text)}
		>
			{#snippet trailIcon()}
				<span class="flex flex-col -mr-1">
					<button
						type="button"
						tabindex="-1"
						disabled={!canInc}
						onclick={() => nudge(1)}
						class="rounded px-1 text-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Increment"
					>
						<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
						</svg>
					</button>
					<button
						type="button"
						tabindex="-1"
						disabled={!canDec}
						onclick={() => nudge(-1)}
						class="rounded px-1 text-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Decrement"
					>
						<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
				</span>
			{/snippet}
		</Input>
	{:else}
		<Input
			{name}
			{label}
			{helperText}
			{disabled}
			{size}
			{status}
			type="number"
			bind:value={text}
			onblur={() => commit(text)}
			onchange={() => commit(text)}
		/>
	{/if}
</div>

<style>
	.number-input :global(input[type='number']) {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.number-input :global(input[type='number']::-webkit-outer-spin-button),
	.number-input :global(input[type='number']::-webkit-inner-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
