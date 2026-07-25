<script lang="ts">
	import Wizard from './Wizard.svelte';
	import type { StepItem } from '$lib/components/molecules/Stepper/Stepper.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let props = $props<{
		orientation?: 'horizontal' | 'vertical';
		size?: 'sm' | 'md' | 'lg';
		variant?: 'numbered' | 'dots';
		clickable?: boolean;
		nonLinear?: boolean;
		showDescription?: boolean;
		showConnectors?: boolean;
		showStepHeader?: boolean;
		loading?: boolean;
		canNext?: boolean;
		withError?: boolean;
	}>();

	const baseSteps: StepItem[] = [
		{ id: 'account', label: 'Account', description: 'Email and password' },
		{ id: 'profile', label: 'Profile', description: 'Display name and avatar' },
		{ id: 'done', label: 'Confirm', description: 'Review and finish setup' }
	];

	const steps = $derived<StepItem[]>(
		props.withError
			? baseSteps.map((step, i) => (i === 1 ? { ...step, error: true } : step))
			: baseSteps
	);

	let current = $state(0);
	let email = $state('');
	let password = $state('');
	let displayName = $state('');
	let finished = $state(false);

	const canAdvance = $derived.by(() => {
		if (props.canNext === false) return false;
		if (current === 0) return email.trim().length > 3 && password.length >= 6;
		if (current === 1) return displayName.trim().length > 1;
		return true;
	});
</script>

<div class="w-[40rem] max-w-full p-4">
	{#if finished}
		<div class="rounded-2xl border border-border bg-surface-elevated px-6 py-10 text-center">
			<Text size="lg" class="font-semibold text-primary">Setup complete</Text>
			<Text size="sm" tone="muted" class="mt-2">
				{displayName || 'Your account'} is ready · {email}
			</Text>
			<button
				type="button"
				class="mt-5 text-sm font-medium text-brand-600 hover:underline"
				onclick={() => {
					finished = false;
					current = 0;
				}}
			>
				Start over
			</button>
		</div>
	{:else}
		<Wizard
			{steps}
			bind:current
			orientation={props.orientation ?? 'horizontal'}
			size={props.size ?? 'md'}
			variant={props.variant ?? 'numbered'}
			clickable={props.clickable ?? false}
			nonLinear={props.nonLinear ?? false}
			showDescription={props.showDescription ?? true}
			showConnectors={props.showConnectors ?? true}
			showStepHeader={props.showStepHeader ?? true}
			loading={props.loading ?? false}
			canNext={canAdvance}
			hint={current === 0 ? 'Password must be at least 6 characters' : ''}
			onfinish={() => (finished = true)}
		>
			{#snippet children(index)}
				{#if index === 0}
					<div class="space-y-4">
						<FormField label="Email" type="email" bind:value={email} required />
						<FormField label="Password" type="password" bind:value={password} required />
					</div>
				{:else if index === 1}
					<div class="space-y-4">
						<FormField label="Display name" bind:value={displayName} required />
						<Text size="sm" tone="muted">Shown on your profile and in comments.</Text>
					</div>
				{:else}
					<div class="space-y-2 rounded-xl border border-border bg-surface px-4 py-3">
						<Text size="sm"><span class="text-muted">Email</span> · {email}</Text>
						<Text size="sm"><span class="text-muted">Name</span> · {displayName}</Text>
					</div>
				{/if}
			{/snippet}
		</Wizard>
	{/if}
</div>
