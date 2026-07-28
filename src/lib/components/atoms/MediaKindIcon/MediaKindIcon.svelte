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
	import LayoutPanelLeft from '@lucide/svelte/icons/layout-panel-left';
	import Layers from '@lucide/svelte/icons/layers';
	import Group from '@lucide/svelte/icons/group';
	import Columns2 from '@lucide/svelte/icons/columns-2';
	import Rows2 from '@lucide/svelte/icons/rows-2';
	import Scaling from '@lucide/svelte/icons/scaling';
	import Box from '@lucide/svelte/icons/box';
	import Component from '@lucide/svelte/icons/component';
	import Frame from '@lucide/svelte/icons/frame';

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
{:else if kind === 'roundRect' || kind === 'border'}
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
{:else if kind === 'canvasPanel'}
	<LayoutPanelLeft class={iconClass} aria-hidden="true" />
{:else if kind === 'overlay'}
	<Layers class={iconClass} aria-hidden="true" />
{:else if kind === 'hBox'}
	<Columns2 class={iconClass} aria-hidden="true" />
{:else if kind === 'vBox'}
	<Rows2 class={iconClass} aria-hidden="true" />
{:else if kind === 'sizeBox'}
	<Box class={iconClass} aria-hidden="true" />
{:else if kind === 'scaleBox'}
	<Scaling class={iconClass} aria-hidden="true" />
{:else if kind === 'group'}
	<Group class={iconClass} aria-hidden="true" />
{:else if kind === 'widget'}
	<Component class={iconClass} aria-hidden="true" />
{:else if kind === 'namedSlot'}
	<Frame class={iconClass} aria-hidden="true" />
{:else if kind === 'scrollBox'}
	<svg class={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<rect x="4" y="3" width="16" height="18" rx="2" />
		<path d="M16 8h2M16 12h2M16 16h2" stroke-linecap="round" />
	</svg>
{:else if kind === 'wrapBox'}
	<svg class={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<rect x="3" y="4" width="7" height="6" rx="1" />
		<rect x="12" y="4" width="9" height="6" rx="1" />
		<rect x="3" y="13" width="9" height="6" rx="1" />
		<rect x="14" y="13" width="7" height="6" rx="1" />
	</svg>
{:else if kind === 'uniformGrid'}
	<svg class={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<rect x="3" y="3" width="7" height="7" rx="1" />
		<rect x="14" y="3" width="7" height="7" rx="1" />
		<rect x="3" y="14" width="7" height="7" rx="1" />
		<rect x="14" y="14" width="7" height="7" rx="1" />
	</svg>
{:else}
	<Type class={iconClass} aria-hidden="true" />
{/if}
