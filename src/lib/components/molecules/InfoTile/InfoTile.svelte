<script lang="ts">
	import type { Snippet } from 'svelte';
	import Surface from '$lib/components/atoms/Surface/Surface.svelte';
	import IconBox from '$lib/components/atoms/IconBox/IconBox.svelte';
	import type { IconBoxTone } from '$lib/components/atoms/IconBox/IconBox.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface InfoTileProps {
		title: string;
		description?: string;
		tone?: IconBoxTone;
		class?: string;
		icon?: Snippet;
		onclick?: () => void;
	}

	const {
		title,
		description,
		tone = 'brand',
		class: className = '',
		icon,
		onclick
	}: InfoTileProps = $props();
</script>

{#if onclick}
	<button
		type="button"
		class={['w-full text-left transition hover:-translate-y-0.5', className]}
		{onclick}
	>
		<Surface variant="elevated" padding="md" radius="2xl" class="h-full">
			<div class="flex gap-3">
				<IconBox {tone}>
					{#if icon}
						{@render icon()}
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
						</svg>
					{/if}
				</IconBox>
				<div class="min-w-0 space-y-1">
					<Heading level={3} size="sm">{title}</Heading>
					{#if description}
						<Text size="xs" tone="muted">{description}</Text>
					{/if}
				</div>
			</div>
		</Surface>
	</button>
{:else}
	<Surface variant="elevated" padding="md" radius="2xl" class={className}>
		<div class="flex gap-3">
			<IconBox {tone}>
				{#if icon}
					{@render icon()}
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
					</svg>
				{/if}
			</IconBox>
			<div class="min-w-0 space-y-1">
				<Heading level={3} size="sm">{title}</Heading>
				{#if description}
					<Text size="xs" tone="muted">{description}</Text>
				{/if}
			</div>
		</div>
	</Surface>
{/if}
