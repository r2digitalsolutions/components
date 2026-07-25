<script lang="ts">
	import type { Snippet } from 'svelte';
	import Navbar from '$lib/components/organisms/Navbar/Navbar.svelte';
	import type { NavbarLink } from '$lib/components/organisms/Navbar/Navbar.svelte';
	import Footer from '$lib/components/organisms/Footer/Footer.svelte';
	import type { FooterGroup, FooterSocial } from '$lib/components/organisms/Footer/Footer.svelte';
	import LandingHero from '$lib/components/organisms/LandingHero/LandingHero.svelte';
	import Container from '$lib/components/atoms/Container/Container.svelte';
	import SectionHeader from '$lib/components/molecules/SectionHeader/SectionHeader.svelte';

	interface MarketingTemplateProps {
		brand?: string;
		navLinks?: NavbarLink[];
		heroTitle?: string;
		heroDescription?: string;
		heroImage?: string;
		footerGroups?: FooterGroup[];
		social?: FooterSocial[];
		class?: string;
		children?: Snippet;
		onprimary?: () => void;
	}

	const {
		brand = 'R2 Digi',
		navLinks = [
			{ id: 'product', label: 'Product' },
			{ id: 'pricing', label: 'Pricing' },
			{ id: 'docs', label: 'Docs' }
		],
		heroTitle = 'Ship polished interfaces faster',
		heroDescription = 'A full component system with templates for auth, dashboards, and marketing pages.',
		heroImage,
		footerGroups = [
			{
				id: 'product',
				title: 'Product',
				links: [
					{ id: 'components', label: 'Components', href: '#' },
					{ id: 'templates', label: 'Templates', href: '#' }
				]
			},
			{
				id: 'company',
				title: 'Company',
				links: [
					{ id: 'about', label: 'About', href: '#' },
					{ id: 'contact', label: 'Contact', href: '#' }
				]
			}
		],
		social = [],
		class: className = '',
		children,
		onprimary
	}: MarketingTemplateProps = $props();
</script>

<div class={['w-full bg-surface', className]}>
	<Navbar brand={brand} links={navLinks} />
	<main class="space-y-12 py-8">
		<Container size="6xl">
			<LandingHero
				{brand}
				title={heroTitle}
				description={heroDescription}
				image={heroImage}
				{onprimary}
			/>
		</Container>
		{#if children}
			<Container size="6xl" class="space-y-8">
				{@render children()}
			</Container>
		{:else}
			<Container size="6xl">
				<SectionHeader
					title="Everything you need"
					description="Compose pages from reusable layers instead of starting from scratch."
					divider={false}
				/>
			</Container>
		{/if}
	</main>
	<Footer brand={brand} groups={footerGroups} {social} />
</div>
