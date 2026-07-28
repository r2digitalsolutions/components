<script lang="ts">
	import type { CanvasLayerKind } from '$lib/utils/canvasDocument.js';
	import type { MediaAssetKind } from '$lib/utils/mediaTracks.js';
	import ImageIcon from '@lucide/svelte/icons/image';
	import Video from '@lucide/svelte/icons/video';
	import AudioLines from '@lucide/svelte/icons/audio-lines';
	import Type from '@lucide/svelte/icons/type';
	import Square from '@lucide/svelte/icons/square';
	import Circle from '@lucide/svelte/icons/circle';
	import Minus from '@lucide/svelte/icons/minus';
	import Triangle from '@lucide/svelte/icons/triangle';
	import Star from '@lucide/svelte/icons/star';
	import MoveRight from '@lucide/svelte/icons/move-right';
	import SquareRoundCorner from '@lucide/svelte/icons/square-round-corner';
	import Hexagon from '@lucide/svelte/icons/hexagon';
	import Pentagon from '@lucide/svelte/icons/pentagon';
	import Diamond from '@lucide/svelte/icons/diamond';
	import Heart from '@lucide/svelte/icons/heart';
	import StickyNote from '@lucide/svelte/icons/sticky-note';

	export type MediaKindIconSize = 'sm' | 'md' | 'lg';

	interface MediaKindIconProps {
		kind: MediaAssetKind | CanvasLayerKind;
		size?: MediaKindIconSize;
		class?: string;
	}

	let { kind, size = 'md', class: className = '' }: MediaKindIconProps = $props();

	const sizes: Record<MediaKindIconSize, string> = {
		sm: 'h-3.5 w-3.5',
		md: 'h-4 w-4',
		lg: 'h-5 w-5'
	};

	const iconClass = $derived(`${sizes[size]} ${className}`.trim());
</script>

{#if kind === 'image'}
	<ImageIcon class={iconClass} aria-hidden="true" />
{:else if kind === 'video'}
	<Video class={iconClass} aria-hidden="true" />
{:else if kind === 'audio'}
	<AudioLines class={iconClass} aria-hidden="true" />
{:else if kind === 'rect'}
	<Square class={iconClass} aria-hidden="true" />
{:else if kind === 'roundRect'}
	<SquareRoundCorner class={iconClass} aria-hidden="true" />
{:else if kind === 'ellipse'}
	<Circle class={iconClass} aria-hidden="true" />
{:else if kind === 'triangle'}
	<Triangle class={iconClass} aria-hidden="true" />
{:else if kind === 'star'}
	<Star class={iconClass} aria-hidden="true" />
{:else if kind === 'hexagon'}
	<Hexagon class={iconClass} aria-hidden="true" />
{:else if kind === 'pentagon'}
	<Pentagon class={iconClass} aria-hidden="true" />
{:else if kind === 'diamond'}
	<Diamond class={iconClass} aria-hidden="true" />
{:else if kind === 'heart'}
	<Heart class={iconClass} aria-hidden="true" />
{:else if kind === 'line'}
	<Minus class={iconClass} aria-hidden="true" />
{:else if kind === 'arrow'}
	<MoveRight class={iconClass} aria-hidden="true" />
{:else if kind === 'path'}
	<svg class={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l5-8 4 5 3-4 4 7" />
	</svg>
{:else if kind === 'sticky'}
	<StickyNote class={iconClass} aria-hidden="true" />
{:else}
	<Type class={iconClass} aria-hidden="true" />
{/if}
