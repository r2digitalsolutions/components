<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FormField from '$lib/components/molecules/FormField/FormField.svelte';
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';

	export type LoginFormVariant = 'card' | 'plain';
	export type LoginFormAlign = 'center' | 'start';

	interface LoginFormProps {
		title?: string;
		subtitle?: string;
		loading?: boolean;
		/** card = elevated panel · plain = bare form (auth shells) */
		variant?: LoginFormVariant;
		align?: LoginFormAlign;
		showSocial?: boolean;
		showSignup?: boolean;
		submitLabel?: string;
		class?: string;
		onsubmit?: (payload: { email: string; password: string; remember: boolean }) => void;
		onforgot?: () => void;
		onsignup?: () => void;
		onsocial?: () => void;
	}

	let {
		title = 'Welcome back',
		subtitle = 'Sign in to continue to your workspace',
		loading = false,
		variant = 'card',
		align = 'center',
		showSocial = true,
		showSignup = true,
		submitLabel = 'Sign in',
		class: className = '',
		onsubmit,
		onforgot,
		onsignup,
		onsocial
	}: LoginFormProps = $props();

	let email = $state('');
	let password = $state('');
	let remember = $state(true);

	function submit(e: Event) {
		e.preventDefault();
		onsubmit?.({ email, password, remember });
	}

	const alignClass = $derived(align === 'center' ? 'text-center' : 'text-start');
</script>

{#snippet body()}
	<div class={['mb-6 space-y-1', alignClass]}>
		<h1 class="text-xl font-semibold tracking-tight text-primary sm:text-2xl">{title}</h1>
		{#if subtitle}
			<p class="text-sm text-secondary">{subtitle}</p>
		{/if}
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

		<div class="flex flex-wrap items-center justify-between gap-2">
			<Checkbox bind:checked={remember} label="Remember me" />
			<button
				type="button"
				class="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
				onclick={() => onforgot?.()}
			>
				Forgot password?
			</button>
		</div>

		<Button type="submit" fullWidth size="lg" {loading}>{submitLabel}</Button>
	</form>

	{#if showSocial}
		<div class="my-5"><Divider label="or" /></div>

		<Button variant="secondary" fullWidth type="button" onclick={() => onsocial?.()}>
			<svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="currentColor"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="currentColor"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				/>
				<path
					fill="currentColor"
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				/>
				<path
					fill="currentColor"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				/>
			</svg>
			Continue with Google
		</Button>
	{/if}

	{#if showSignup}
		<p class={['mt-5 text-xs text-muted', alignClass]}>
			No account?
			<button
				type="button"
				class="font-medium text-brand-600 hover:underline dark:text-brand-400"
				onclick={() => onsignup?.()}
			>
				Create one
			</button>
		</p>
	{/if}
{/snippet}

{#if variant === 'card'}
	<Card class={`w-full max-w-md ${className}`} padding="lg" variant="elevated">
		{@render body()}
	</Card>
{:else}
	<div class={['w-full max-w-md', className]}>
		{@render body()}
	</div>
{/if}
