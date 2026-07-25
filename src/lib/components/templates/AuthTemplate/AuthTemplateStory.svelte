<script lang="ts">
	import AuthTemplate from './AuthTemplate.svelte';
	import type { AuthTemplateView } from './AuthTemplate.svelte';
	import type { AuthAsideSide } from '$lib/components/organisms/AuthShell/AuthShell.svelte';

	interface Props {
		view?: AuthTemplateView;
		asideSide?: AuthAsideSide;
	}

	let { view = 'signin', asideSide = 'left' }: Props = $props();

	let mode = $state<AuthTemplateView>(view);
	let status = $state('');

	$effect(() => {
		mode = view;
	});

	/** Make Storybook canvas fill the iframe so AuthShell can be full-page */
	$effect(() => {
		if (typeof document === 'undefined') return;

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

<div class="flex h-full min-h-dvh w-full flex-1 flex-col">
	<AuthTemplate
		bind:view={mode}
		{asideSide}
		fullHeight
		brand="R2 Digi"
		tagline="Build once. Reuse everywhere."
		headline="Sign in to continue"
		class="flex-1"
		onsignin={(p) => (status = `Signed in as ${p.email}`)}
		onsignup={(p) => (status = `Account created for ${p.email}`)}
		onforgot={(p) => (status = `Reset link sent to ${p.email}`)}
		onsocial={() => (status = 'Continue with Google')}
	/>
</div>

{#if status}
	<p
		class="pointer-events-none fixed bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted shadow-md"
	>
		{status}
	</p>
{/if}
