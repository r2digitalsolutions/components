<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface ForgotPasswordFormProps {
		title?: string;
		subtitle?: string;
		loading?: boolean;
		class?: string;
		onsubmit?: (payload: { email: string }) => void;
		onback?: () => void;
	}

	let {
		title = 'Reset your password',
		subtitle = "Enter your email and we'll send a reset link.",
		loading = false,
		class: className = '',
		onsubmit,
		onback
	}: ForgotPasswordFormProps = $props();

	let email = $state('');

	function submit(e: Event) {
		e.preventDefault();
		onsubmit?.({ email });
	}
</script>

<Card class={`mx-auto w-full max-w-md ${className}`} padding="lg">
	<div class="mb-6 space-y-1 text-center">
		<h1 class="text-xl font-semibold text-primary">{title}</h1>
		<p class="text-sm text-secondary">{subtitle}</p>
	</div>

	<form class="space-y-4" onsubmit={submit}>
		<FormField label="Email" type="email" placeholder="you@company.com" bind:value={email} required />
		<Button type="submit" fullWidth {loading}>Send reset link</Button>
	</form>

	{#if onback}
		<button type="button" class="mt-4 w-full text-center text-xs font-medium text-brand-600 hover:underline" onclick={onback}>
			Back to sign in
		</button>
	{/if}
</Card>
