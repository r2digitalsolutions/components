<script lang="ts">
	import LandingHero from './LandingHero.svelte';
	import type {
		LandingHeroVariant,
		LandingHeroTone,
		LandingHeroCtaMode,
		LandingHeroSize
	} from './LandingHero.svelte';

	interface Props {
		variant?: LandingHeroVariant;
		tone?: LandingHeroTone;
		ctaMode?: LandingHeroCtaMode;
		size?: LandingHeroSize;
		showProof?: boolean;
		showStats?: boolean;
		showLogos?: boolean;
		showAnnouncement?: boolean;
		showVideoCta?: boolean;
	}

	let {
		variant = 'split',
		tone = 'surface',
		ctaMode = 'buttons',
		size = 'lg',
		showProof = true,
		showStats = true,
		showLogos = true,
		showAnnouncement = true,
		showVideoCta = false
	}: Props = $props();

	let email = $state('');
</script>

<div class="p-4 sm:p-6">
	<LandingHero
		{variant}
		{tone}
		{ctaMode}
		{size}
		bind:email
		brand="R2 Digi"
		title="Build product UI that feels finished"
		description="A Svelte component system with atoms, molecules, organisms, and page templates — so your team ships coherent interfaces instead of one-off screens."
		primaryLabel="Start building"
		secondaryLabel="Browse library"
		image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=80"
		imageAlt="Product interface on a laptop"
		videoUrl={showVideoCta ? 'https://example.com' : undefined}
		announcement={showAnnouncement
			? { badge: 'New', label: 'MobileShell and BlogPost just landed', href: '#' }
			: undefined}
		proof={showProof
			? {
					avatars: [
						{ id: '1', name: 'Maya', src: 'https://i.pravatar.cc/80?img=20' },
						{ id: '2', name: 'Jordan', src: 'https://i.pravatar.cc/80?img=33' },
						{ id: '3', name: 'Sam', src: 'https://i.pravatar.cc/80?img=12' },
						{ id: '4', name: 'Alex', src: 'https://i.pravatar.cc/80?img=48' },
						{ id: '5', name: 'Riley', src: 'https://i.pravatar.cc/80?img=5' }
					],
					rating: 4.9,
					label: 'Loved by 2,400+ product builders'
				}
			: undefined}
		stats={showStats
			? [
					{ id: 'c', value: '180+', label: 'Components' },
					{ id: 't', value: '4', label: 'Layers' },
					{ id: 'a', value: '99', label: 'A11y checks' }
				]
			: []}
		logos={showLogos
			? [
					{ id: '1', name: 'Northwind' },
					{ id: '2', name: 'Brightline' },
					{ id: '3', name: 'Cascade' },
					{ id: '4', name: 'Harbor' },
					{ id: '5', name: 'PixelForge' }
				]
			: []}
		onemail={(value) => {
			email = value;
		}}
	/>
</div>
