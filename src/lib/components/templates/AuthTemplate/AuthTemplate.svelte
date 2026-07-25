<script lang="ts">
	import type { Snippet } from 'svelte';
	import AuthShell from '$lib/components/organisms/AuthShell/AuthShell.svelte';
	import AuthCard from '$lib/components/molecules/AuthCard/AuthCard.svelte';

	interface AuthTemplateProps {
		title?: string;
		description?: string;
		brand?: string;
		tagline?: string;
		fullHeight?: boolean;
		class?: string;
		footer?: Snippet;
		children?: Snippet;
	}

	const {
		title = 'Sign in',
		description = 'Welcome back to your workspace.',
		brand = 'R2 Digi',
		tagline = 'Build once. Reuse everywhere.',
		fullHeight = true,
		class: className = '',
		footer,
		children
	}: AuthTemplateProps = $props();
</script>

<AuthShell {brand} {tagline} {fullHeight} class={className}>
	<AuthCard {title} {description} {brand} {footer}>
		{@render children?.()}
	</AuthCard>
</AuthShell>
