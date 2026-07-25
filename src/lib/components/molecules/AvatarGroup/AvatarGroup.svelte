<script lang="ts">
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';

	export interface AvatarGroupItem {
		id: string;
		name?: string;
		src?: string;
		alt?: string;
	}

	export type AvatarGroupRing = 'surface' | 'elevated' | 'inverse' | 'transparent';

	interface AvatarGroupProps {
		items?: AvatarGroupItem[];
		max?: number;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		/** Separator ring color against parent background */
		ring?: AvatarGroupRing;
		class?: string;
	}

	let {
		items = [],
		max = 4,
		size = 'md',
		ring = 'surface',
		class: className = ''
	}: AvatarGroupProps = $props();

	const visible = $derived(items.slice(0, max));
	const overflow = $derived(Math.max(0, items.length - max));

	const overlap = $derived(
		{ xs: '-ml-2', sm: '-ml-2.5', md: '-ml-3', lg: '-ml-3.5', xl: '-ml-4', '2xl': '-ml-5' }[size]
	);

	const overflowSize = $derived(
		{
			xs: 'h-6 w-6 text-[10px]',
			sm: 'h-8 w-8 text-xs',
			md: 'h-10 w-10 text-xs',
			lg: 'h-12 w-12 text-sm',
			xl: 'h-16 w-16 text-base',
			'2xl': 'h-20 w-20 text-lg'
		}[size]
	);

	const ringShadow: Record<AvatarGroupRing, string> = {
		surface: 'shadow-[0_0_0_2px_var(--surface)]',
		elevated: 'shadow-[0_0_0_2px_var(--surface-elevated)]',
		inverse: 'shadow-[0_0_0_2px_rgb(9_9_11)]',
		transparent: 'shadow-none'
	};
</script>

<div class={['inline-flex shrink-0 items-center', className]} role="list">
	{#each visible as item, i (item.id)}
		<div
			class={['relative aspect-square shrink-0 rounded-full', i > 0 && overlap]}
			style="z-index: {visible.length - i}"
			role="listitem"
		>
			<!-- Single separator: box-shadow matches parent surface (avoids double CSS rings) -->
			<div class={['aspect-square rounded-full', ringShadow[ring]]}>
				<Avatar name={item.name} src={item.src} alt={item.alt} {size} ringed={false} />
			</div>
		</div>
	{/each}
	{#if overflow > 0}
		<div
			class={['relative aspect-square shrink-0 rounded-full', overlap]}
			style="z-index: 0"
			role="listitem"
			aria-label={`${overflow} more`}
		>
			<div
				class={[
					'flex aspect-square items-center justify-center rounded-full bg-surface-overlay font-medium text-secondary',
					ringShadow[ring],
					overflowSize
				]}
			>
				+{overflow}
			</div>
		</div>
	{/if}
</div>
