<script lang="ts">
	import AuthShell from './AuthShell.svelte';
	import type { AuthAsideSide } from './AuthShell.svelte';
	import LoginForm from '$lib/components/organisms/LoginForm/LoginForm.svelte';
	import type { LoginFormVariant } from '$lib/components/organisms/LoginForm/LoginForm.svelte';
	import PhoneFrame from '$lib/components/molecules/PhoneFrame/PhoneFrame.svelte';

	let {
		brand = 'R2DigiSolutions',
		tagline = 'Build faster with a cohesive design system.',
		headline = 'Sign in to continue',
		fullHeight = true,
		asideSide = 'left' as AuthAsideSide,
		mobileHero = true,
		formVariant = 'card' as LoginFormVariant,
		formAlign = 'center' as 'center' | 'start',
		preview = 'desktop' as 'desktop' | 'mobile' | 'compact'
	}: {
		brand?: string;
		tagline?: string;
		headline?: string;
		fullHeight?: boolean;
		asideSide?: AuthAsideSide;
		mobileHero?: boolean;
		formVariant?: LoginFormVariant;
		formAlign?: 'center' | 'start';
		preview?: 'desktop' | 'mobile' | 'compact';
	} = $props();

	let submitted = $state('');

	/** Storybook canvas: force the preview root to fill the iframe so the shell reaches the bottom. */
	$effect(() => {
		if (preview === 'mobile' || typeof document === 'undefined') return;
		if (preview === 'desktop' && !fullHeight) return;

		const html = document.documentElement;
		const body = document.body;
		const root = document.getElementById('storybook-root');

		const prev = {
			htmlHeight: html.style.height,
			htmlMinHeight: html.style.minHeight,
			bodyHeight: body.style.height,
			bodyMinHeight: body.style.minHeight,
			bodyMargin: body.style.margin,
			rootHeight: root?.style.height ?? '',
			rootMinHeight: root?.style.minHeight ?? '',
			rootDisplay: root?.style.display ?? '',
			rootFlex: root?.style.flexDirection ?? ''
		};

		html.style.height = '100%';
		html.style.minHeight = '100%';
		body.style.height = '100%';
		body.style.minHeight = '100%';
		body.style.margin = '0';
		if (root) {
			root.style.height = '100%';
			root.style.minHeight = '100%';
			root.style.display = 'flex';
			root.style.flexDirection = 'column';
		}

		return () => {
			html.style.height = prev.htmlHeight;
			html.style.minHeight = prev.htmlMinHeight;
			body.style.height = prev.bodyHeight;
			body.style.minHeight = prev.bodyMinHeight;
			body.style.margin = prev.bodyMargin;
			if (root) {
				root.style.height = prev.rootHeight;
				root.style.minHeight = prev.rootMinHeight;
				root.style.display = prev.rootDisplay;
				root.style.flexDirection = prev.rootFlex;
			}
		};
	});
</script>

{#snippet form()}
	<LoginForm
		variant={formVariant}
		align={formAlign}
		onsubmit={(p) => {
			submitted = p.email;
		}}
	/>
	{#if submitted}
		<p class="mt-3 text-center text-xs text-muted">Signed in as {submitted}</p>
	{/if}
{/snippet}

{#if preview === 'mobile'}
	<div class="flex min-h-dvh w-full items-center justify-center bg-surface-overlay/40 p-6">
		<PhoneFrame size="md" class="shadow-2xl">
			<div class="h-full min-h-0">
				<AuthShell
					{brand}
					{tagline}
					{headline}
					fillParent
					{asideSide}
					{mobileHero}
					class="h-full"
				>
					{@render form()}
				</AuthShell>
			</div>
		</PhoneFrame>
	</div>
{:else if preview === 'compact'}
	<!-- Framed embed that still fills the canvas height so the aside reaches the bottom -->
	<div class="box-border flex h-full min-h-dvh w-full flex-1 flex-col bg-surface-overlay/30 p-4 sm:p-6">
		<div
			class="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
		>
			<AuthShell
				{brand}
				{tagline}
				{headline}
				fillParent
				{asideSide}
				{mobileHero}
				class="h-full min-h-0 flex-1"
			>
				{@render form()}
			</AuthShell>
		</div>
	</div>
{:else}
	<div class={fullHeight ? 'flex h-full min-h-dvh w-full flex-1 flex-col' : 'w-full'}>
		<AuthShell
			{brand}
			{tagline}
			{headline}
			{fullHeight}
			{asideSide}
			{mobileHero}
			class={fullHeight ? 'flex-1' : 'h-full'}
		>
			{@render form()}
		</AuthShell>
	</div>
{/if}
