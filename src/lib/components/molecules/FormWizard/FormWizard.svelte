<script lang="ts" generics="TData extends FormDataValues = FormDataValues">
	import type { Snippet } from 'svelte';
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import Wizard from '$lib/components/organisms/Wizard/Wizard.svelte';
	import type { StepItem } from '$lib/components/molecules/Stepper/Stepper.svelte';
	import type { FormDataValues, FormErrors } from '$lib/utils/formContext.js';

	interface FormWizardProps {
		data?: TData;
		errors?: FormErrors;
		steps?: StepItem[];
		current?: number;
		title?: string;
		description?: string;
		finishLabel?: string;
		nextLabel?: string;
		backLabel?: string;
		canNext?: boolean;
		loading?: boolean;
		disabled?: boolean;
		showErrorSummary?: boolean;
		class?: string;
		/** Active step body; receives current index */
		children?: Snippet<[number]>;
		header?: Snippet<[number]>;
		footer?: Snippet;
		onfinish?: (index: number) => void;
		onchange?: (index: number) => void;
		onnext?: (index: number) => void;
		onback?: (index: number) => void;
		onsubmit?: (e: SubmitEvent) => void;
	}

	let {
		data = $bindable({} as TData),
		errors = $bindable<FormErrors>({}),
		steps = [],
		current = $bindable(0),
		title,
		description,
		finishLabel = 'Finish',
		nextLabel = 'Continue',
		backLabel = 'Back',
		canNext = true,
		loading = false,
		disabled = false,
		showErrorSummary = true,
		class: className = '',
		children,
		header,
		footer,
		onfinish,
		onchange,
		onnext,
		onback,
		onsubmit
	}: FormWizardProps = $props();
</script>

<Form
	bind:data
	bind:errors
	{title}
	{description}
	{loading}
	{disabled}
	{showErrorSummary}
	class={className}
	{onsubmit}
>
	<Wizard
		{steps}
		bind:current
		{finishLabel}
		{nextLabel}
		{backLabel}
		{canNext}
		{loading}
		{disabled}
		{children}
		{header}
		{footer}
		{onfinish}
		{onchange}
		{onnext}
		{onback}
	/>
</Form>
