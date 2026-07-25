<script lang="ts">
	import Form from './Form.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import FormPasswordInput from '$lib/components/molecules/FormPasswordInput/FormPasswordInput.svelte';
	import FormCheckbox from '$lib/components/molecules/FormCheckbox/FormCheckbox.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import FormTextarea from '$lib/components/molecules/FormTextarea/FormTextarea.svelte';
	import FormSelect from '$lib/components/molecules/FormSelect/FormSelect.svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import type { FormErrors } from '$lib/utils/formContext.js';

	type WorkspaceForm = {
		name: string;
		email: string;
		password: string;
		company: string;
		role: string;
		notes: string;
		terms: boolean;
	};

	let data = $state<WorkspaceForm>({
		name: '',
		email: '',
		password: '',
		company: '',
		role: '',
		notes: '',
		terms: false
	});
	let errors = $state<FormErrors>({});
	let loading = $state(false);
	let success = $state(false);

	function validate() {
		const next: FormErrors = {};
		if (!data.name.trim()) next.name = 'Name is required';
		if (!data.email.trim()) next.email = 'Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = 'Enter a valid email address';
		if (data.password.length < 8) next.password = 'Use at least 8 characters';
		if (!data.role) next.role = 'Select a role';
		if (!data.terms) next.terms = 'You must accept the terms';
		errors = next;
		return Object.keys(next).length === 0;
	}

	async function submit() {
		success = false;
		if (!validate()) return;

		loading = true;
		await new Promise((r) => setTimeout(r, 900));
		loading = false;
		success = true;
	}

	function reset() {
		data = {
			name: '',
			email: '',
			password: '',
			company: '',
			role: '',
			notes: '',
			terms: false
		};
		errors = {};
		success = false;
	}
</script>

<div class="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
	<div class="border-b border-border px-5 py-4">
		<p class="text-sm font-semibold text-primary">Create workspace</p>
		<p class="text-xs text-muted">Demo with bind:data, context-aware fields, and FormActions.</p>
	</div>

	<div class="p-5">
		{#if success}
			<div class="space-y-4">
				<Alert variant="success" title="Workspace created" dismissible={false}>
					<p class="text-sm">
						Welcome, {data.name || 'there'}. We sent a confirmation to
						<span class="font-medium">{data.email}</span>.
					</p>
				</Alert>
				<Button variant="secondary" onclick={reset}>Create another</Button>
			</div>
		{:else}
			<Form
				bind:data
				bind:errors
				{loading}
				title="Account details"
				description="Fields marked with * are required."
				onsubmit={submit}
			>
				<FormField name="name" label="Full name" placeholder="Alex Rivera" bindData required />
				<FormField
					name="email"
					label="Work email"
					type="email"
					placeholder="alex@company.com"
					bindData
					required
				/>
				<FormField
					name="company"
					label="Company"
					placeholder="Optional"
					helperText="Shown on invoices and invites."
					bindData
				/>
				<FormSelect
					name="role"
					label="Role"
					placeholder="Select a role…"
					options={[
						{ value: 'admin', label: 'Admin' },
						{ value: 'member', label: 'Member' },
						{ value: 'viewer', label: 'Viewer' }
					]}
					bindData
					required
				/>
				<FormPasswordInput
					name="password"
					label="Password"
					helperText="At least 8 characters"
					bindData
					required
				/>
				<FormTextarea
					name="notes"
					label="Notes"
					placeholder="Anything we should know?"
					rows={3}
					bindData
				/>
				<FormCheckbox
					name="terms"
					label="I agree to the Terms and Privacy Policy"
					bindData
				/>

				{#snippet footer()}
					<FormActions
						submitLabel="Create account"
						cancelLabel="Reset"
						variant="plain"
						align="end"
						fullWidth
						oncancel={reset}
					/>
				{/snippet}
			</Form>
		{/if}
	</div>
</div>
