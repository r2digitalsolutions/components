<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Stepper, { type StepItem } from '$lib/components/molecules/Stepper/Stepper.svelte';
	import StepHeader from '$lib/components/molecules/StepHeader/StepHeader.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';

	interface WizardProps {
		steps?: StepItem[];
		current?: number;
		finishLabel?: string;
		nextLabel?: string;
		backLabel?: string;
		eyebrow?: string;
		hint?: string;
		/** Forwarded to Stepper */
		orientation?: 'horizontal' | 'vertical';
		size?: 'sm' | 'md' | 'lg';
		variant?: 'numbered' | 'dots';
		showDescription?: boolean;
		showConnectors?: boolean;
		clickable?: boolean;
		nonLinear?: boolean;
		/** Show StepHeader from the active step's label/description */
		showStepHeader?: boolean;
		canNext?: boolean;
		loading?: boolean;
		disabled?: boolean;
		class?: string;
		/** Active step body; receives current index */
		children?: Snippet<[number]>;
		/** Replaces the default StepHeader */
		header?: Snippet<[number]>;
		/** Replaces the default FormActions footer */
		footer?: Snippet;
		onfinish?: (index: number) => void;
		onchange?: (index: number) => void;
		onnext?: (index: number) => void;
		onback?: (index: number) => void;
	}

	let {
		steps = [],
		current = $bindable(0),
		finishLabel = 'Finish',
		nextLabel = 'Continue',
		backLabel = 'Back',
		eyebrow = 'Setup',
		hint = '',
		orientation = 'horizontal',
		size = 'md',
		variant = 'numbered',
		showDescription = true,
		showConnectors = true,
		clickable = false,
		nonLinear = false,
		showStepHeader = true,
		canNext = true,
		loading = false,
		disabled = false,
		class: className = '',
		children,
		header,
		footer,
		onfinish,
		onchange,
		onnext,
		onback
	}: WizardProps = $props();

	const total = $derived(steps.length);
	const safeCurrent = $derived(total === 0 ? 0 : Math.min(Math.max(current, 0), total - 1));
	const active = $derived(steps[safeCurrent]);
	const isFirst = $derived(safeCurrent <= 0);
	const isLast = $derived(total === 0 || safeCurrent >= total - 1);
	const stepNumber = $derived(safeCurrent + 1);

	function goTo(index: number, source: 'back' | 'next' | 'stepper' | 'sync' = 'sync') {
		if (index < 0 || index >= total) return;
		if (index !== current) current = index;
		onchange?.(index);
		if (source === 'back') onback?.(index);
		if (source === 'next') onnext?.(index);
	}

	function back() {
		if (isFirst || loading || disabled) return;
		goTo(safeCurrent - 1, 'back');
	}

	function next() {
		if (loading || disabled || !canNext) return;
		if (isLast) {
			onfinish?.(safeCurrent);
			return;
		}
		goTo(safeCurrent + 1, 'next');
	}

	function onStepperChange(index: number) {
		onchange?.(index);
	}
</script>

<div
	class={[
		'flex w-full flex-col gap-5',
		orientation === 'vertical' && 'sm:flex-row sm:items-start sm:gap-8',
		className
	]}
	role="region"
	aria-label="Wizard"
>
	<div class={['w-full', orientation === 'vertical' && 'sm:w-56 sm:shrink-0']}>
		<Stepper
			{steps}
			bind:current={current}
			{orientation}
			{size}
			{variant}
			{showDescription}
			{showConnectors}
			{clickable}
			{nonLinear}
			onchange={onStepperChange}
		/>
	</div>

	<div class="min-w-0 flex-1">
		<Card padding="none" chrome={false} class="overflow-hidden">
			<div class="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
				{#if header}
					{@render header(safeCurrent)}
				{:else if showStepHeader && active}
					<StepHeader
						step={stepNumber}
						{total}
						{eyebrow}
						title={active.label}
						description={active.description}
					/>
				{/if}

				<div
					class="min-h-30"
					aria-live="polite"
					aria-atomic="true"
					aria-label={active ? `Step ${stepNumber} of ${total}: ${active.label}` : 'Wizard content'}
				>
					{#if children}
						{@render children(safeCurrent)}
					{/if}
				</div>
			</div>

			{#if footer}
				{@render footer()}
			{:else}
				<FormActions
					submitLabel={isLast ? finishLabel : nextLabel}
					cancelLabel={backLabel}
					showCancel={!isFirst}
					align="between"
					variant="bar"
					{loading}
					{disabled}
					submitDisabled={!canNext}
					{hint}
					onsubmit={next}
					oncancel={back}
				/>
			{/if}
		</Card>
	</div>
</div>
