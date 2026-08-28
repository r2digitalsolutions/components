<script lang="ts">
	import NavRail, { type NavRailItem } from './NavRail.svelte';
	import BrandMark from '$lib/components/atoms/BrandMark/BrandMark.svelte';

	const items: NavRailItem[] = [
		{ id: 'home', label: 'Dashboard', href: '#' },
		{ id: 'atom', label: 'Atom', href: '#' },
		{ id: 'crm', label: 'CRM', href: '#' }
	];

	const footerItems: NavRailItem[] = [{ id: 'settings', label: 'Ajustes', href: '#' }];

	let value = $state('atom');
</script>

<div class="rounded-xl border-border bg-surface h-[28rem] overflow-hidden border">
	<div class="flex h-full">
		<NavRail {items} {footerItems} bind:value>
			{#snippet brand()}
				<BrandMark mark="R2" size="sm" />
			{/snippet}
		</NavRail>
		<div class="p-6 text-sm text-secondary flex flex-1 items-center justify-center">
			Selected: <span class="ml-1 font-medium text-primary">{value}</span>
		</div>
	</div>
</div>
