<script lang="ts">
	import Surface from '$lib/components/atoms/Surface/Surface.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import AvatarLabel from '$lib/components/molecules/AvatarLabel/AvatarLabel.svelte';

	interface QuoteProps {
		quote: string;
		author?: string;
		role?: string;
		avatar?: string;
		class?: string;
	}

	const { quote, author, role, avatar, class: className = '' }: QuoteProps = $props();
</script>

<Surface variant="soft" padding="lg" radius="2xl" class={className} bordered>
	<blockquote class="space-y-4">
		<svg class="h-6 w-6 text-brand-500/70" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M7.2 11.2C5.4 11.2 4 12.6 4 14.4S5.4 17.6 7.2 17.6 10.4 16.2 10.4 14.4c0-4.4-2.4-7.2-6.4-9.2l1.2 2c2 1.2 2.8 2.8 2.8 4zm10 0c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2 3.2-1.4 3.2-3.2c0-4.4-2.4-7.2-6.4-9.2l1.2 2c2 1.2 2.8 2.8 2.8 4z" />
		</svg>
		<Text size="md" tone="primary" as="p" class="font-medium">“{quote}”</Text>
		{#if author}
			<AvatarLabel name={author} description={role} {avatar} size="sm" />
		{/if}
	</blockquote>
</Surface>
