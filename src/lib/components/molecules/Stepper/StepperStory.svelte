<script lang="ts">
	import Stepper, { type StepItem } from './Stepper.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		orientation?: 'horizontal' | 'vertical';
		size?: 'sm' | 'md' | 'lg';
		variant?: 'numbered' | 'dots';
		clickable?: boolean;
		nonLinear?: boolean;
		showDescription?: boolean;
		showConnectors?: boolean;
		withError?: boolean;
	}>();

	const baseSteps: StepItem[] = [
		{ id: 'account', label: 'Account', description: 'Email & password' },
		{ id: 'profile', label: 'Profile', description: 'Name & avatar' },
		{ id: 'plan', label: 'Plan', description: 'Choose a tier', optional: true },
		{ id: 'done', label: 'Confirm', description: 'Review & finish' }
	];

	const steps = $derived<StepItem[]>(
		props.withError
			? baseSteps.map((step, i) => (i === 1 ? { ...step, error: true } : step))
			: baseSteps
	);

	let current = $state(1);
</script>

<div class="w-[36rem] max-w-full space-y-6">
	<Stepper
		{steps}
		bind:current
		orientation={props.orientation ?? 'horizontal'}
		size={props.size ?? 'md'}
		variant={props.variant ?? 'numbered'}
		clickable={props.clickable ?? true}
		nonLinear={props.nonLinear ?? false}
		showDescription={props.showDescription ?? true}
		showConnectors={props.showConnectors ?? true}
	/>

	<div class="flex gap-2">
		<Button
			variant="secondary"
			size="sm"
			disabled={current === 0}
			onclick={() => (current = Math.max(0, current - 1))}
		>
			Back
		</Button>
		<Button
			size="sm"
			disabled={current >= steps.length - 1}
			onclick={() => (current = Math.min(steps.length - 1, current + 1))}
		>
			Continue
		</Button>
	</div>
</div>
