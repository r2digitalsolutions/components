<script lang="ts">
	import Form from '$lib/components/molecules/Form/Form.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import FormGroup from '$lib/components/molecules/FormGroup/FormGroup.svelte';
	import FormRadioGroup from '$lib/components/molecules/FormRadioGroup/FormRadioGroup.svelte';
	import FormNumberInput from '$lib/components/molecules/FormNumberInput/FormNumberInput.svelte';
	import FormDatePicker from '$lib/components/molecules/FormDatePicker/FormDatePicker.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import LocaleSwitcher from '$lib/components/molecules/LocaleSwitcher/LocaleSwitcher.svelte';
	import { validateForm } from '$lib/utils/formValidate.js';
	import { i18n, type LocaleCode } from '$lib/utils/i18n.svelte.js';
	import type { FormErrors } from '$lib/utils/formContext.js';

	let locale = $state<LocaleCode>(i18n.locale);
	let data = $state({
		name: '',
		email: '',
		plan: '',
		seats: 1,
		start: ''
	});
	let errors = $state<FormErrors>({});

	$effect(() => {
		i18n.set(locale);
	});

	function submit() {
		errors = validateForm(
			data,
			{
				name: 'required',
				email: ['required', 'email'],
				plan: 'required',
				seats: ['min:1', 'max:50'],
				start: 'required'
			},
			{ t: (key, params) => i18n.t(key, params) }
		);
	}
</script>

<div class="max-w-md space-y-4 rounded-2xl border border-border bg-surface-elevated p-4">
	<div class="flex items-center justify-between gap-3">
		<div>
			<p class="text-sm font-semibold text-primary">i18n store</p>
			<p class="text-xs text-muted">locale: {i18n.locale}</p>
		</div>
		<LocaleSwitcher
			bind:value={locale}
			locales={[
				{ code: 'es', label: 'Español', flag: '🇪🇸' },
				{ code: 'en', label: 'English', flag: '🇬🇧' },
				{ code: 'pt', label: 'Português', flag: '🇵🇹' },
				{ code: 'fr', label: 'Français', flag: '🇫🇷' },
				{ code: 'de', label: 'Deutsch', flag: '🇩🇪' }
			]}
			size="sm"
		/>
	</div>

	<Form bind:data bind:errors onsubmit={submit}>
		<FormGroup legend="Account" description="i18n.set('es') · i18n.t('save')" variant="inset">
			<FormField name="name" label="Name" bindData required />
			<FormField name="email" label="Email" type="email" bindData required />
		</FormGroup>

		<FormRadioGroup
			name="plan"
			label="Plan"
			options={[
				{ value: 'free', label: 'Free' },
				{ value: 'pro', label: 'Pro' }
			]}
			bindData
		/>
		<FormNumberInput name="seats" label="Seats" min={1} max={50} bindData />
		<FormDatePicker name="start" label="Start date" bindData />

		{#snippet footer()}
			<FormActions variant="plain" showCancel={false} />
		{/snippet}
	</Form>
</div>
