<script lang="ts">
	import type { Snippet } from 'svelte';
	import Stepper, { type StepItem } from '$lib/components/molecules/Stepper/Stepper.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface WizardProps {
		steps?: StepItem[];
		current?: number;
		finishLabel?: string;
		nextLabel?: string;
		backLabel?: string;
		class?: string;
		/** Rendered for the active step; receives current index via closure in stories */
		children?: Snippet<[number]>;
		onfinish?: (index: number) => void;
		onchange?: (index: number) => void;
	}

	let {
		steps = [],
		current = $bindable(0),
		finishLabel = 'Finish',
		nextLabel = 'Continue',
		backLabel = 'Back',
		class: className = '',
		children,
		onfinish,
		onchange
	}: WizardProps = $props();

	const isFirst = $derived(current <= 0);
	const isLast = $derived(current >= steps.length - 1);

	function back() {
		if (isFirst) return;
		current -= 1;
		onchange?.(current);
	}

	function next() {
		if (isLast) {
			onfinish?.(current);
			return;
		}
		current += 1;
		onchange?.(current);
	}
</script>

<div class={['flex w-full flex-col gap-6', className]}>
	<Stepper bind:current {steps} />
	<div class="min-h-[120px]">
		{#if children}{@render children(current)}{/if}
	</div>
	<div class="flex items-center justify-between gap-3">
		<Button variant="secondary" disabled={isFirst} onclick={back}>{backLabel}</Button>
		<Button onclick={next}>{isLast ? finishLabel : nextLabel}</Button>
	</div>
</div>
