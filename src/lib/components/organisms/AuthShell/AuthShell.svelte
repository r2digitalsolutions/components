<script lang="ts">
	import type { Snippet } from 'svelte';
	import Center from '$lib/components/atoms/Center/Center.svelte';
	import Container from '$lib/components/atoms/Container/Container.svelte';

	interface AuthShellProps {
		brand?: string;
		tagline?: string;
		footer?: string;
		class?: string;
		children?: Snippet;
		aside?: Snippet;
	}

	const {
		brand = 'R2DigiSolutions',
		tagline = 'Build faster with a cohesive design system.',
		footer = '© R2DigiSolutions. All rights reserved.',
		class: className = '',
		children,
		aside
	}: AuthShellProps = $props();
</script>

<div class={['min-h-[32rem] w-full bg-surface', className]}>
	<div class="grid min-h-[32rem] w-full lg:grid-cols-2">
		{#if aside}
			<div class="relative hidden overflow-hidden lg:block">
				{@render aside()}
			</div>
		{:else}
			<div
				class="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 p-10 text-white lg:flex lg:flex-col lg:justify-between"
			>
				<div class="space-y-3">
					<p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Welcome</p>
					<h1 class="max-w-sm text-3xl font-semibold tracking-tight">{brand}</h1>
					<p class="max-w-sm text-sm leading-relaxed text-white/80">{tagline}</p>
				</div>
				<p class="text-xs text-white/50">{footer}</p>
			</div>
		{/if}

		<Center padding="lg" fill class="bg-surface">
			<Container size="sm" padding="none">
				<div class="mb-6 text-center lg:hidden">
					<p class="text-lg font-semibold text-primary">{brand}</p>
					<p class="mt-1 text-sm text-muted">{tagline}</p>
				</div>
				{#if children}
					{@render children()}
				{/if}
			</Container>
		</Center>
	</div>
</div>
