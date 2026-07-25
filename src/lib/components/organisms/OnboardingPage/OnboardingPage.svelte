<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Stepper from '$lib/components/molecules/Stepper/Stepper.svelte';
	import type { StepItem } from '$lib/components/molecules/Stepper/Stepper.svelte';
	import StepHeader from '$lib/components/molecules/StepHeader/StepHeader.svelte';
	import Checklist from '$lib/components/molecules/Checklist/Checklist.svelte';
	import type { ChecklistItem } from '$lib/components/molecules/Checklist/Checklist.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import ChipSelect from '$lib/components/molecules/ChipSelect/ChipSelect.svelte';

	interface OnboardingPageProps {
		steps?: StepItem[];
		step?: number;
		checklist?: ChecklistItem[];
		class?: string;
		onfinish?: (payload: { workspace: string; goals: string[] }) => void;
	}

	let {
		steps = [
			{ id: 'workspace', label: 'Workspace' },
			{ id: 'goals', label: 'Goals' },
			{ id: 'ready', label: 'Ready' }
		],
		step = $bindable(0),
		checklist = [
			{ id: '1', label: 'Create workspace', done: true },
			{ id: '2', label: 'Pick goals', done: false },
			{ id: '3', label: 'Invite teammates', done: false }
		],
		class: className = '',
		onfinish
	}: OnboardingPageProps = $props();

	let workspace = $state('Acme Design');
	let goals = $state<string[]>(['ship-faster']);

	const total = $derived(steps.length);
	const current = $derived(Math.min(step, total - 1) + 1);

	function next() {
		if (step < total - 1) step += 1;
		else onfinish?.({ workspace, goals });
	}

	function back() {
		if (step > 0) step -= 1;
	}
</script>

<div class={['mx-auto w-full max-w-2xl space-y-5', className]}>
	<Stepper steps={steps} bind:current={step} />

	<Card padding="lg" chrome={false}>
		{#if step === 0}
			<StepHeader
				step={current}
				{total}
				eyebrow="Onboarding"
				title="Name your workspace"
				description="You can change this later in settings."
			/>
			<div class="mt-5">
				<FormField label="Workspace name" bind:value={workspace} required />
			</div>
		{:else if step === 1}
			<StepHeader
				step={current}
				{total}
				eyebrow="Onboarding"
				title="What do you want to achieve?"
				description="We’ll tailor recommendations to your goals."
			/>
			<div class="mt-5">
				<ChipSelect
					label="Goals"
					bind:value={goals}
					options={[
						{ id: 'ship-faster', label: 'Ship faster' },
						{ id: 'design-system', label: 'Design system' },
						{ id: 'a11y', label: 'Accessibility' },
						{ id: 'analytics', label: 'Analytics' }
					]}
				/>
			</div>
		{:else}
			<StepHeader
				step={current}
				{total}
				eyebrow="Onboarding"
				title="You're ready to go"
				description="Here’s a quick checklist before you dive in."
			/>
			<div class="mt-5">
				<Checklist items={checklist} />
			</div>
		{/if}

		<div class="mt-6">
			<FormActions
				submitLabel={step === total - 1 ? 'Finish' : 'Continue'}
				cancelLabel="Back"
				showCancel={step > 0}
				align="between"
				onsubmit={next}
				oncancel={back}
			/>
		</div>
	</Card>
</div>
