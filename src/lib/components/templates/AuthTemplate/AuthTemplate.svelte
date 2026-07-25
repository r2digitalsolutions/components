<script lang="ts">
	import type { Snippet } from 'svelte';
	import AuthShell from '$lib/components/organisms/AuthShell/AuthShell.svelte';
	import type { AuthAsideSide } from '$lib/components/organisms/AuthShell/AuthShell.svelte';
	import LoginForm from '$lib/components/organisms/LoginForm/LoginForm.svelte';
	import RegisterForm from '$lib/components/organisms/RegisterForm/RegisterForm.svelte';
	import ForgotPasswordForm from '$lib/components/organisms/ForgotPasswordForm/ForgotPasswordForm.svelte';

	export type AuthTemplateView = 'signin' | 'signup' | 'forgot';

	interface AuthTemplateProps {
		view?: AuthTemplateView;
		brand?: string;
		tagline?: string;
		headline?: string;
		footer?: string;
		highlights?: string[];
		asideSide?: AuthAsideSide;
		mobileHero?: boolean;
		fullHeight?: boolean;
		fillParent?: boolean;
		loading?: boolean;
		class?: string;
		/** Custom form — replaces the built-in view */
		children?: Snippet;
		aside?: Snippet;
		onsignin?: (payload: { email: string; password: string; remember: boolean }) => void;
		onsignup?: (payload: {
			name: string;
			email: string;
			password: string;
			confirmPassword: string;
			terms: boolean;
		}) => void;
		onforgot?: (payload: { email: string }) => void;
		onsocial?: () => void;
		onviewchange?: (view: AuthTemplateView) => void;
	}

	let {
		view = $bindable<AuthTemplateView>('signin'),
		brand = 'R2 Digi',
		tagline = 'Build once. Reuse everywhere.',
		headline = 'Sign in to continue',
		footer = '© R2DigiSolutions. All rights reserved.',
		highlights = [
			'Reusable atoms, molecules, and page templates',
			'Consistent tokens across product surfaces',
			'Ship auth, dashboards, and marketing faster'
		],
		asideSide = 'left',
		mobileHero = true,
		fullHeight = true,
		fillParent = false,
		loading = false,
		class: className = '',
		children,
		aside,
		onsignin,
		onsignup,
		onforgot,
		onsocial,
		onviewchange
	}: AuthTemplateProps = $props();

	function go(next: AuthTemplateView) {
		view = next;
		onviewchange?.(next);
	}

	const shellHeadline = $derived(
		view === 'signup'
			? 'Create your workspace'
			: view === 'forgot'
				? 'Recover access'
				: headline
	);
</script>

<AuthShell
	{brand}
	{tagline}
	headline={shellHeadline}
	{footer}
	{highlights}
	{asideSide}
	{mobileHero}
	{fullHeight}
	{fillParent}
	class={className}
	{aside}
>
	{#if children}
		{@render children()}
	{:else if view === 'signup'}
		<RegisterForm
			{loading}
			onsubmit={(payload) => onsignup?.(payload)}
		/>
		<p class="mt-4 text-center text-xs text-muted">
			Already have an account?
			<button
				type="button"
				class="font-medium text-brand-600 hover:underline dark:text-brand-400"
				onclick={() => go('signin')}
			>
				Sign in
			</button>
		</p>
	{:else if view === 'forgot'}
		<ForgotPasswordForm
			{loading}
			onsubmit={(payload) => onforgot?.(payload)}
			onback={() => go('signin')}
		/>
	{:else}
		<LoginForm
			variant="card"
			align="center"
			{loading}
			title="Sign in"
			subtitle="Welcome back to your workspace."
			onsubmit={(payload) => onsignin?.(payload)}
			onforgot={() => go('forgot')}
			onsignup={() => go('signup')}
			onsocial={() => onsocial?.()}
		/>
	{/if}
</AuthShell>
