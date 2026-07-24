<script lang="ts">
	export interface StepItem {
		id: string;
		label: string;
		description?: string;
		optional?: boolean;
	}

	interface StepperProps {
		steps?: StepItem[];
		/** Zero-based index of the current step */
		current?: number;
		orientation?: 'horizontal' | 'vertical';
		class?: string;
		onchange?: (index: number, step: StepItem) => void;
		/** Allow clicking completed / previous steps */
		clickable?: boolean;
	}

	let {
		steps = [],
		current = $bindable(0),
		orientation = 'horizontal',
		class: className = '',
		onchange,
		clickable = false
	}: StepperProps = $props();

	function goTo(index: number) {
		if (!clickable) return;
		if (index < 0 || index >= steps.length) return;
		if (index > current) return;
		current = index;
		onchange?.(index, steps[index]);
	}

	function status(index: number): 'complete' | 'current' | 'upcoming' {
		if (index < current) return 'complete';
		if (index === current) return 'current';
		return 'upcoming';
	}
</script>

<nav class={['w-full', className]} aria-label="Progress">
	{#if orientation === 'horizontal'}
		<ol class="flex w-full items-start">
			{#each steps as step, index (step.id)}
				{@const state = status(index)}
				<li class="flex min-w-0 flex-1 flex-col items-center">
					<div class="flex w-full items-center">
						{#if index > 0}
							<div
								class={['h-0.5 flex-1 rounded-full', index <= current ? 'bg-brand-500' : 'bg-border']}
								aria-hidden="true"
							></div>
						{/if}
						<button
							type="button"
							disabled={!clickable || index > current}
							onclick={() => goTo(index)}
							aria-current={state === 'current' ? 'step' : undefined}
							class={[
								'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
								state === 'complete' && 'border-brand-500 bg-brand-500 text-white',
								state === 'current' && 'border-brand-500 bg-surface-elevated text-brand-600',
								state === 'upcoming' && 'border-border bg-surface-elevated text-muted',
								clickable && index <= current ? 'cursor-pointer' : 'cursor-default'
							]}
						>
							{#if state === 'complete'}
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							{:else}
								{index + 1}
							{/if}
						</button>
						{#if index < steps.length - 1}
							<div
								class={['h-0.5 flex-1 rounded-full', index < current ? 'bg-brand-500' : 'bg-border']}
								aria-hidden="true"
							></div>
						{/if}
					</div>
					<div class="mt-2 px-1 text-center">
						<p class={['text-sm font-medium', state === 'upcoming' ? 'text-muted' : 'text-primary']}>
							{step.label}
							{#if step.optional}
								<span class="text-xs font-normal text-muted"> (optional)</span>
							{/if}
						</p>
						{#if step.description}
							<p class="mt-0.5 text-xs text-secondary">{step.description}</p>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	{:else}
		<ol class="flex flex-col">
			{#each steps as step, index (step.id)}
				{@const state = status(index)}
				<li class="flex gap-3">
					<div class="flex flex-col items-center">
						<button
							type="button"
							disabled={!clickable || index > current}
							onclick={() => goTo(index)}
							aria-current={state === 'current' ? 'step' : undefined}
							class={[
								'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
								state === 'complete' && 'border-brand-500 bg-brand-500 text-white',
								state === 'current' && 'border-brand-500 bg-surface-elevated text-brand-600',
								state === 'upcoming' && 'border-border bg-surface-elevated text-muted',
								clickable && index <= current ? 'cursor-pointer' : 'cursor-default'
							]}
						>
							{#if state === 'complete'}
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							{:else}
								{index + 1}
							{/if}
						</button>
						{#if index < steps.length - 1}
							<div
								class={['my-1 w-0.5 flex-1 min-h-8 rounded-full', index < current ? 'bg-brand-500' : 'bg-border']}
								aria-hidden="true"
							></div>
						{/if}
					</div>
					<div class="min-w-0 flex-1 pb-6 pt-1">
						<p class={['text-sm font-medium', state === 'upcoming' ? 'text-muted' : 'text-primary']}>
							{step.label}
							{#if step.optional}
								<span class="text-xs font-normal text-muted"> (optional)</span>
							{/if}
						</p>
						{#if step.description}
							<p class="mt-0.5 text-xs text-secondary">{step.description}</p>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</nav>
