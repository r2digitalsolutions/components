<script lang="ts">
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormToggleProps {
		id?: string;
		name?: string;
		label?: string;
		helperText?: string;
		errorMessage?: string;
		checked?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		labelPosition?: 'left' | 'right';
		/** Sync with `form.data[name]` when inside `<Form>`. */
		bindData?: boolean;
		/** Bordered row layout (settings-style) */
		variant?: 'plain' | 'row';
		class?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		id,
		name,
		label,
		helperText,
		errorMessage,
		checked = $bindable(false),
		disabled = false,
		size = 'md',
		labelPosition = 'right',
		bindData = false,
		variant = 'row',
		class: className = '',
		onchange
	}: FormToggleProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, disabled, form })
	);

	$effect(() => {
		if (!bindData || !name || !form) return;
		applyFormDataSync({
			fromCtx: form.data[name],
			getLocal: () => checked,
			setLocal: (v) => {
				checked = v;
			},
			map: (raw) => (typeof raw === 'boolean' ? raw : undefined)
		});
	});

	function handleChange(next: boolean) {
		checked = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
		onchange?.(next);
	}
</script>

<div class={['w-full', className]}>
	{#if variant === 'row'}
		<div
			class={[
				'flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5',
				resolved.error ? 'border-red-400' : 'border-border'
			]}
		>
			<div class="min-w-0">
				{#if label}
					<p class="text-sm font-medium text-primary">{label}</p>
				{/if}
				{#if resolved.error}
					<FormError message={resolved.error} class="mt-0.5" />
				{:else if helperText}
					<FormDescription text={helperText} class="mt-0.5" />
				{/if}
			</div>
			<Toggle
				{id}
				{size}
				disabled={resolved.disabled}
				labelPosition="right"
				bind:checked
				onchange={handleChange}
			/>
		</div>
	{:else}
		<div class="flex flex-col gap-1">
			<Toggle
				{id}
				{label}
				{size}
				{labelPosition}
				disabled={resolved.disabled}
				bind:checked
				onchange={handleChange}
			/>
			{#if resolved.error}
				<FormError message={resolved.error} />
			{:else if helperText}
				<FormDescription text={helperText} />
			{/if}
		</div>
	{/if}
</div>
