<script lang="ts">
	import Form from './Form.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Alert from '$lib/components/molecules/Alert/Alert.svelte';

	let errors = $state<Record<string, string>>({});
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let company = $state('');
	let terms = $state(false);
	let loading = $state(false);
	let success = $state(false);

	function validate() {
		const next: Record<string, string> = {};
		if (!name.trim()) next.name = 'Name is required';
		if (!email.trim()) next.email = 'Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
		if (password.length < 8) next.password = 'Use at least 8 characters';
		if (!terms) next.terms = 'You must accept the terms';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function clearField(field: string) {
		if (errors[field]) {
			const next = { ...errors };
			delete next[field];
			errors = next;
		}
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
		name = '';
		email = '';
		password = '';
		company = '';
		terms = false;
		errors = {};
		success = false;
	}
</script>

<div class="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
	<div class="border-b border-border px-5 py-4">
		<p class="text-sm font-semibold text-primary">Create workspace</p>
		<p class="text-xs text-muted">Demo form with validation, loading, and success states.</p>
	</div>

	<div class="p-5">
		{#if success}
			<div class="space-y-4">
				<Alert variant="success" title="Workspace created" dismissible={false}>
					<p class="text-sm">
						Welcome, {name || 'there'}. We sent a confirmation to
						<span class="font-medium">{email}</span>.
					</p>
				</Alert>
				<Button variant="secondary" onclick={reset}>Create another</Button>
			</div>
		{:else}
			<Form
				bind:errors
				{loading}
				title="Account details"
				description="Fields marked with * are required."
				onsubmit={submit}
			>
				<FormField
					label="Full name"
					placeholder="Alex Rivera"
					bind:value={name}
					errorMessage={errors.name}
					required
					oninput={() => clearField('name')}
				/>

				<FormField
					label="Work email"
					type="email"
					placeholder="alex@company.com"
					bind:value={email}
					errorMessage={errors.email}
					required
					oninput={() => clearField('email')}
				/>

				<FormField
					label="Company"
					placeholder="Optional"
					bind:value={company}
					helperText="Shown on invoices and invites."
				/>

				<PasswordInput
					label="Password"
					bind:value={password}
					required
					helperText={errors.password ?? 'At least 8 characters'}
					status={errors.password ? 'error' : 'default'}
					oninput={() => clearField('password')}
				/>

				<div class="space-y-1">
					<Checkbox bind:checked={terms} label="I agree to the Terms and Privacy Policy" />
					{#if errors.terms}
						<p class="text-xs text-red-500">{errors.terms}</p>
					{/if}
				</div>

				{#snippet footer()}
					<Button type="submit" {loading} fullWidth>Create account</Button>
					<Button type="button" variant="ghost" fullWidth disabled={loading} onclick={reset}>
						Reset
					</Button>
				{/snippet}
			</Form>
		{/if}
	</div>
</div>
