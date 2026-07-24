<script lang="ts">
	export interface StepItem {
		id: string;
		label: string;
		description?: string;
		optional?: boolean;
		disabled?: boolean;
		error?: boolean;
	}

	interface StepperProps {
		steps?: StepItem[];
		/** Zero-based index of the current step */
		current?: number;
		orientation?: 'horizontal' | 'vertical';
		size?: 'sm' | 'md' | 'lg';
		/** Numbered circles (default) or minimal dots */
		variant?: 'numbered' | 'dots';
		/** Show step descriptions when provided */
		showDescription?: boolean;
		/** Draw connector lines between steps */
		showConnectors?: boolean;
		/** Allow clicking steps (respects nonLinear / disabled) */
		clickable?: boolean;
		/** When clickable, allow jumping to any non-disabled step */
		nonLinear?: boolean;
		class?: string;
		onchange?: (index: number, step: StepItem) => void;
	}

	let {
		steps = [],
		current = $bindable(0),
		orientation = 'horizontal',
		size = 'md',
		variant = 'numbered',
		showDescription = true,
		showConnectors = true,
		clickable = false,
		nonLinear = false,
		class: className = '',
		onchange
	}: StepperProps = $props();

	const circleSize = $derived.by(() => {
		const sizes = {
			sm: {
				box: 'h-6 w-6 text-[10px]',
				icon: 'h-3 w-3',
				dot: 'h-2.5 w-2.5',
				lineTop: variant === 'dots' ? 'top-[5px]' : 'top-3'
			},
			md: {
				box: 'h-8 w-8 text-xs',
				icon: 'h-4 w-4',
				dot: 'h-3 w-3',
				lineTop: variant === 'dots' ? 'top-1.5' : 'top-4'
			},
			lg: {
				box: 'h-10 w-10 text-sm',
				icon: 'h-5 w-5',
				dot: 'h-3.5 w-3.5',
				lineTop: variant === 'dots' ? 'top-[7px]' : 'top-5'
			}
		};
		return sizes[size];
	});

	const labelSize = $derived(
		{
			sm: { label: 'text-xs', desc: 'text-[11px] leading-snug' },
			md: { label: 'text-sm', desc: 'text-xs' },
			lg: { label: 'text-base', desc: 'text-sm' }
		}[size]
	);

	function canNavigate(index: number) {
		if (!clickable) return false;
		const step = steps[index];
		if (!step || step.disabled) return false;
		if (nonLinear) return true;
		return index <= current;
	}

	function goTo(index: number) {
		if (!canNavigate(index)) return;
		if (index < 0 || index >= steps.length) return;
		current = index;
		onchange?.(index, steps[index]);
	}

	function status(index: number): 'complete' | 'current' | 'upcoming' | 'error' {
		const step = steps[index];
		if (step?.error) return 'error';
		if (index < current) return 'complete';
		if (index === current) return 'current';
		return 'upcoming';
	}

	function circleClasses(state: ReturnType<typeof status>) {
		return [
			'relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors',
			variant === 'dots' ? circleSize.dot : circleSize.box,
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
			state === 'complete' && 'border-brand-500 bg-brand-500 text-white',
			state === 'current' && 'border-brand-500 bg-surface-elevated text-brand-600',
			state === 'error' && 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400',
			state === 'upcoming' && 'border-border bg-surface-elevated text-muted'
		];
	}
</script>

{#snippet indicator(state: ReturnType<typeof status>, step: StepItem, index: number)}
	{#if variant === 'dots'}
		<span class="sr-only">{step.label}</span>
	{:else if state === 'complete'}
		<svg
			class={circleSize.icon}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
		</svg>
	{:else if state === 'error'}
		<svg
			class={circleSize.icon}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
		</svg>
	{:else}
		{index + 1}
	{/if}
{/snippet}

{#snippet stepLabel(state: ReturnType<typeof status>, step: StepItem, centered = false)}
	<p
		class={[
			'font-medium leading-snug',
			labelSize.label,
			state === 'upcoming' || step.disabled ? 'text-muted' : 'text-primary',
			state === 'error' && 'text-red-600 dark:text-red-400'
		]}
	>
		{step.label}
		{#if step.optional}
			{#if centered}
				<span class="block text-[0.7em] font-normal text-muted sm:inline sm:text-xs">
					(optional)
				</span>
			{:else}
				<span class="text-xs font-normal text-muted"> (optional)</span>
			{/if}
		{/if}
	</p>
	{#if showDescription && step.description}
		<p class={['mt-0.5 text-secondary', labelSize.desc]}>{step.description}</p>
	{/if}
{/snippet}

<nav class={['w-full', className]} aria-label="Progress">
	{#if orientation === 'horizontal'}
		<ol class="flex w-full">
			{#each steps as step, index (step.id)}
				{@const state = status(index)}
				{@const navigable = canNavigate(index)}
				<li class="relative flex min-w-0 flex-1 flex-col items-center">
					{#if showConnectors && index < steps.length - 1}
						<div
							class={[
								'absolute left-1/2 h-0.5 w-full -translate-y-1/2',
								circleSize.lineTop,
								index < current ? 'bg-brand-500' : 'bg-border'
							]}
							aria-hidden="true"
						></div>
					{/if}

					<button
						type="button"
						disabled={!navigable}
						onclick={() => goTo(index)}
						aria-current={state === 'current' || state === 'error' ? 'step' : undefined}
						aria-disabled={step.disabled || undefined}
						class={[
							circleClasses(state),
							step.disabled && 'opacity-40',
							navigable ? 'cursor-pointer' : 'cursor-default'
						]}
					>
						{@render indicator(state, step, index)}
					</button>

					<div class="mt-2 w-full max-w-[9rem] px-1 text-center sm:max-w-[11rem]">
						{@render stepLabel(state, step, true)}
					</div>
				</li>
			{/each}
		</ol>
	{:else}
		<ol class="flex flex-col">
			{#each steps as step, index (step.id)}
				{@const state = status(index)}
				{@const navigable = canNavigate(index)}
				<li class="flex gap-3">
					<div class="flex flex-col items-center">
						<button
							type="button"
							disabled={!navigable}
							onclick={() => goTo(index)}
							aria-current={state === 'current' || state === 'error' ? 'step' : undefined}
							aria-disabled={step.disabled || undefined}
							class={[
								circleClasses(state),
								step.disabled && 'opacity-40',
								navigable ? 'cursor-pointer' : 'cursor-default'
							]}
						>
							{@render indicator(state, step, index)}
						</button>
						{#if showConnectors && index < steps.length - 1}
							<div
								class={[
									'my-1 w-0.5 flex-1 rounded-full',
									variant === 'dots' ? 'min-h-6' : 'min-h-8',
									index < current ? 'bg-brand-500' : 'bg-border'
								]}
								aria-hidden="true"
							></div>
						{/if}
					</div>
					<div
						class={[
							'min-w-0 flex-1',
							index < steps.length - 1 ? 'pb-6' : 'pb-0',
							variant === 'dots' ? 'pt-0' : 'pt-1'
						]}
					>
						{@render stepLabel(state, step)}
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</nav>
