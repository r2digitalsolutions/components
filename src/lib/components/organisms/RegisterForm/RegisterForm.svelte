<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';

	interface RegisterFormProps {
		title?: string;
		subtitle?: string;
		loading?: boolean;
		class?: string;
		onsubmit?: (payload: {
			name: string;
			email: string;
			password: string;
			confirmPassword: string;
			terms: boolean;
		}) => void;
	}

	let {
		title = 'Create your account',
		subtitle = 'Start building with the component library',
		loading = false,
		class: className = '',
		onsubmit
	}: RegisterFormProps = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let terms = $state(false);

	function submit(e: Event) {
		e.preventDefault();
		onsubmit?.({ name, email, password, confirmPassword, terms });
	}
</script>

<Card class={`w-full max-w-md ${className}`} padding="lg">
	<div class="mb-6 space-y-1 text-center">
		<h1 class="text-xl font-semibold text-primary">{title}</h1>
		<p class="text-sm text-secondary">{subtitle}</p>
	</div>

	<form class="space-y-4" onsubmit={submit}>
		<FormField label="Name" placeholder="Alex Rivera" bind:value={name} required />
		<FormField label="Email" type="email" placeholder="you@company.com" bind:value={email} required />
		<PasswordInput bind:value={password} required label="Password" />
		<PasswordInput bind:value={confirmPassword} required label="Confirm password" />
		<Checkbox bind:checked={terms} label="I agree to the Terms and Privacy Policy" />
		<Button type="submit" fullWidth {loading}>Create account</Button>
	</form>
</Card>
