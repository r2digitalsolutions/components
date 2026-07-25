<script lang="ts">
	import type { Snippet } from 'svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import SettingsRow from '$lib/components/molecules/SettingsRow/SettingsRow.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';

	interface SettingsFormProps {
		name?: string;
		email?: string;
		newsletter?: boolean;
		marketing?: boolean;
		saving?: boolean;
		class?: string;
		extra?: Snippet;
		onsave?: (data: {
			name: string;
			email: string;
			newsletter: boolean;
			marketing: boolean;
		}) => void;
		oncancel?: () => void;
	}

	let {
		name = $bindable(''),
		email = $bindable(''),
		newsletter = $bindable(true),
		marketing = $bindable(false),
		saving = false,
		class: className = '',
		extra,
		onsave,
		oncancel
	}: SettingsFormProps = $props();

	function save() {
		onsave?.({ name, email, newsletter, marketing });
	}
</script>

<div class={['w-full max-w-2xl space-y-6', className]}>
	<FormSection title="Profile" description="How you appear across the product.">
		<div class="space-y-3">
			<Input label="Display name" bind:value={name} />
			<Input label="Email" type="email" bind:value={email} />
		</div>
	</FormSection>

	<FormSection title="Preferences" description="Control notifications and outreach.">
		<div class="divide-y divide-border overflow-hidden rounded-xl border border-border">
			<SettingsRow title="Product updates" description="Release notes and tips">
				{#snippet control()}
					<Toggle bind:checked={newsletter} />
				{/snippet}
			</SettingsRow>
			<SettingsRow title="Marketing emails" description="Occasional offers">
				{#snippet control()}
					<Toggle bind:checked={marketing} />
				{/snippet}
			</SettingsRow>
		</div>
	</FormSection>

	{#if extra}
		{@render extra()}
	{/if}

	<FormActions
		submitLabel="Save changes"
		cancelLabel="Cancel"
		loading={saving}
		onsubmit={save}
		oncancel={() => oncancel?.()}
	/>
</div>
