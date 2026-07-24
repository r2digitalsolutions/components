<script lang="ts">
	import NavigationMenu, { type NavMenuItem } from './NavigationMenu.svelte';

	const items: NavMenuItem[] = [
		{ id: 'home', label: 'Home', href: '/' },
		{
			id: 'products',
			label: 'Products',
			description: 'Explore our product catalog',
			children: [
				{ id: 'analytics', label: 'Analytics', description: 'Real-time insights and reporting for your data.' },
				{ id: 'automation', label: 'Automation', description: 'Automate repetitive tasks and workflows.' },
				{ id: 'security', label: 'Security', description: 'Enterprise-grade security and compliance.' },
				{ id: 'integrations', label: 'Integrations', description: 'Connect with 100+ tools and services.' }
			]
		},
		{
			id: 'docs',
			label: 'Docs',
			children: [
				{ id: 'getting-started', label: 'Getting Started', description: 'Set up your project in minutes.' },
				{ id: 'api-reference', label: 'API Reference', description: 'Full API documentation and examples.' },
				{ id: 'guides', label: 'Guides', description: 'Step-by-step tutorials and best practices.' }
			]
		},
		{ id: 'blog', label: 'Blog', href: '/blog' },
		{ id: 'pricing', label: 'Pricing', href: '/pricing' }
	];

	let lastSelected = $state('');
</script>

<div class="rounded-xl border border-border bg-surface-elevated px-4 py-3 space-y-3">
	<NavigationMenu {items} onselect={(id) => (lastSelected = id)} />
	{#if lastSelected}
		<p class="text-xs text-muted pt-2 border-t border-border">
			Seleccionado: <span class="text-primary font-medium">{lastSelected}</span>
		</p>
	{/if}
</div>
