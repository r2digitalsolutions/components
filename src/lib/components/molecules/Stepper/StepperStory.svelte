<script lang="ts">
	import Stepper, { type StepItem } from './Stepper.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		orientation?: 'horizontal' | 'vertical';
		clickable?: boolean;
	}>();

	const steps: StepItem[] = [
		{ id: 'account', label: 'Account', description: 'Email & password' },
		{ id: 'profile', label: 'Profile', description: 'Name & avatar' },
		{ id: 'plan', label: 'Plan', description: 'Choose a tier', optional: true },
		{ id: 'done', label: 'Confirm', description: 'Review & finish' }
	];

	let current = $state(1);
</script>

<div class="max-w-2xl space-y-6">
	<Stepper
		{steps}
		bind:current
		orientation={props.orientation ?? 'horizontal'}
		clickable={props.clickable ?? true}
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
