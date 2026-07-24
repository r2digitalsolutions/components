<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';

	interface LoginFormProps {
		title?: string;
		subtitle?: string;
		loading?: boolean;
		class?: string;
		onsubmit?: (payload: { email: string; password: string; remember: boolean }) => void;
	}

	let {
		title = 'Welcome back',
		subtitle = 'Sign in to continue to your workspace',
		loading = false,
		class: className = '',
		onsubmit
	}: LoginFormProps = $props();

	let email = $state('');
	let password = $state('');
	let remember = $state(true);

	function submit(e: Event) {
		e.preventDefault();
		onsubmit?.({ email, password, remember });
	}
</script>

<Card class={`w-full max-w-md ${className}`} padding="lg">
	<div class="mb-6 space-y-1 text-center">
		<h1 class="text-xl font-semibold text-primary">{title}</h1>
		<p class="text-sm text-secondary">{subtitle}</p>
	</div>

	<form class="space-y-4" onsubmit={submit}>
		<FormField
			label="Email"
			type="email"
			placeholder="you@company.com"
			bind:value={email}
			required
		/>

		<PasswordInput bind:value={password} required label="Password" />

		<div class="flex items-center justify-between gap-3">
			<Checkbox bind:checked={remember} label="Remember me" />
			<button type="button" class="text-xs font-medium text-brand-600 hover:underline">
				Forgot password?
			</button>
		</div>

		<Button type="submit" fullWidth {loading}>Sign in</Button>
	</form>

	<div class="my-5"><Divider label="or" /></div>

	<Button variant="secondary" fullWidth type="button">Continue with Google</Button>

	<p class="mt-4 text-center text-xs text-muted">
		No account?
		<button type="button" class="font-medium text-brand-600 hover:underline">Create one</button>
	</p>
</Card>
