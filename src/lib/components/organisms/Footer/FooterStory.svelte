<script lang="ts">
	import Footer, {
		type FooterGroup,
		type FooterLink,
		type FooterSocial,
		type FooterVariant
	} from './Footer.svelte';
	import NewsletterSignup from '$lib/components/molecules/NewsletterSignup/NewsletterSignup.svelte';

	type Example = 'product' | 'minimal' | 'centered' | 'mega' | 'compact' | 'newsletter' | 'docs';

	let props = $props<{
		example?: Example;
		variant?: FooterVariant;
		brand?: string;
		description?: string;
		badge?: string;
	}>();

	let last = $state('—');
	let email = $state('');

	const example = $derived(props.example ?? 'product');

	const productGroups: FooterGroup[] = [
		{
			id: 'product',
			title: 'Product',
			links: [
				{ id: 'features', label: 'Features', href: '/features' },
				{ id: 'pricing', label: 'Pricing', href: '/pricing' },
				{ id: 'changelog', label: 'Changelog', href: '/changelog', badge: 'New' },
				{ id: 'integrations', label: 'Integrations', href: '/integrations' }
			]
		},
		{
			id: 'company',
			title: 'Company',
			links: [
				{ id: 'about', label: 'About', href: '/about' },
				{ id: 'blog', label: 'Blog', href: '/blog' },
				{ id: 'careers', label: 'Careers', href: '/careers' },
				{
					id: 'contact',
					label: 'Contact',
					onclick: () => (last = 'contact:onclick')
				}
			]
		},
		{
			id: 'resources',
			title: 'Resources',
			links: [
				{ id: 'docs', label: 'Docs', href: '/docs' },
				{ id: 'guides', label: 'Guides', href: '/guides' },
				{
					id: 'status',
					label: 'Status',
					href: 'https://status.example.com',
					external: true
				}
			]
		}
	];

	const megaGroups: FooterGroup[] = [
		...productGroups,
		{
			id: 'developers',
			title: 'Developers',
			links: [
				{ id: 'api', label: 'API', href: '/developers/api' },
				{ id: 'sdk', label: 'SDKs', href: '/developers/sdk' },
				{ id: 'cli', label: 'CLI', href: '/developers/cli' },
				{ id: 'examples', label: 'Examples', href: '/developers/examples' }
			]
		}
	];

	const social: FooterSocial[] = [
		{ id: 'x', label: 'X', href: 'https://x.com', external: true },
		{ id: 'github', label: 'GitHub', href: 'https://github.com', external: true },
		{ id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com', external: true },
		{ id: 'youtube', label: 'YouTube', href: 'https://youtube.com', external: true }
	];

	const bottomLinks: FooterLink[] = [
		{ id: 'privacy', label: 'Privacy', href: '/privacy' },
		{ id: 'terms', label: 'Terms', href: '/terms' },
		{ id: 'cookies', label: 'Cookies', href: '/cookies' },
		{ id: 'security', label: 'Security', href: '/security' }
	];

	const minimalLinks: FooterGroup[] = [
		{
			id: 'nav',
			title: 'Nav',
			links: [
				{ id: 'product', label: 'Product', href: '/product' },
				{ id: 'pricing', label: 'Pricing', href: '/pricing' },
				{ id: 'docs', label: 'Docs', href: '/docs' },
				{ id: 'support', label: 'Support', href: '/support' }
			]
		}
	];

	const docsGroups: FooterGroup[] = [
		{
			id: 'docs',
			title: 'Docs',
			links: [
				{ id: 'getting-started', label: 'Getting started', href: '/docs/start' },
				{ id: 'components', label: 'Components', href: '/docs/components' },
				{ id: 'tokens', label: 'Design tokens', href: '/docs/tokens' }
			]
		},
		{
			id: 'community',
			title: 'Community',
			links: [
				{ id: 'discord', label: 'Discord', href: 'https://discord.gg/example', external: true },
				{ id: 'github', label: 'GitHub', href: 'https://github.com', external: true },
				{ id: 'changelog', label: 'Changelog', href: '/changelog' }
			]
		},
		{
			id: 'legal',
			title: 'Legal',
			links: [
				{ id: 'privacy', label: 'Privacy', href: '/privacy' },
				{ id: 'terms', label: 'Terms', href: '/terms' }
			]
		}
	];
</script>

<div class="w-full space-y-2">
	<p class="px-1 text-xs text-secondary">
		Last navigate: <span class="font-medium text-primary">{last}</span>
	</p>

	{#if example === 'minimal'}
		<Footer
			variant="minimal"
			brand={props.brand ?? 'R2'}
			badge={props.badge ?? 'v2.4'}
			groups={minimalLinks}
			onnavigate={(id, href) => (last = href ? `${id} → ${href}` : id)}
		/>
	{:else if example === 'centered'}
		<Footer
			variant="centered"
			brand={props.brand ?? 'Northstar'}
			description={props.description ??
				'The design system for teams that ship polished products.'}
			groups={[
				{
					id: 'links',
					title: 'Links',
					links: [
						{ id: 'product', label: 'Product', href: '/product' },
						{ id: 'customers', label: 'Customers', href: '/customers' },
						{ id: 'pricing', label: 'Pricing', href: '/pricing' },
						{ id: 'blog', label: 'Blog', href: '/blog' },
						{ id: 'careers', label: 'Careers', href: '/careers' }
					]
				}
			]}
			{social}
			onnavigate={(id, href) => (last = href ? `${id} → ${href}` : id)}
			onsocial={(id, href) => (last = `social:${id} → ${href}`)}
		/>
	{:else if example === 'mega'}
		<Footer
			variant="mega"
			brand={props.brand ?? 'R2DigiSolutions'}
			description={props.description ??
				'Components, patterns, and primitives for modern SaaS.'}
			badge={props.badge ?? 'Design System'}
			groups={megaGroups}
			{social}
			{bottomLinks}
			contactEmail="hello@r2digi.solutions"
			contactNote="Mon–Fri · 9:00–18:00 CET"
			onnavigate={(id, href) => (last = href ? `${id} → ${href}` : id)}
			onsocial={(id, href) => (last = `social:${id} → ${href}`)}
		/>
	{:else if example === 'compact'}
		<Footer
			variant="compact"
			brand={props.brand ?? 'Acme App'}
			{bottomLinks}
			onnavigate={(id, href) => (last = href ? `${id} → ${href}` : id)}
		/>
	{:else if example === 'newsletter'}
		<Footer
			variant="default"
			brand={props.brand ?? 'R2DigiSolutions'}
			description="Product updates in your inbox — no spam."
			groups={productGroups}
			{social}
			{bottomLinks}
			onnavigate={(id, href) => (last = href ? `${id} → ${href}` : id)}
		>
			{#snippet aside()}
				<div class="max-w-sm">
					<NewsletterSignup
						bind:email
						variant="minimal"
						size="sm"
						placeholder="you@company.com"
						buttonLabel="Subscribe"
						onsubmit={(p) => (last = `subscribe:${p.email}`)}
					/>
				</div>
			{/snippet}
		</Footer>
	{:else if example === 'docs'}
		<Footer
			variant="default"
			brand={props.brand ?? 'R2 Docs'}
			description={props.description ?? 'Guides and API reference for the component library.'}
			badge="Docs"
			groups={docsGroups}
			bottomLinks={[
				{ id: 'llms', label: 'llms.txt', href: '/llms.txt' },
				{ id: 'sitemap', label: 'Sitemap', href: '/sitemap.xml' }
			]}
			social={[
				{ id: 'github', label: 'GitHub', href: 'https://github.com', external: true },
				{ id: 'discord', label: 'Discord', href: 'https://discord.gg/example', external: true }
			]}
			onnavigate={(id, href) => (last = href ? `${id} → ${href}` : id)}
		/>
	{:else}
		<Footer
			variant={props.variant ?? 'default'}
			brand={props.brand ?? 'R2DigiSolutions'}
			description={props.description ?? 'Building thoughtful product interfaces.'}
			badge={props.badge}
			groups={productGroups}
			{social}
			{bottomLinks}
			onnavigate={(id, href) => (last = href ? `${id} → ${href}` : id)}
			onsocial={(id, href) => (last = `social:${id} → ${href}`)}
		>
			{#snippet legal()}
				<span class="text-muted">Made with care in EU</span>
			{/snippet}
		</Footer>
	{/if}
</div>
