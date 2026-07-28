<script lang="ts">
	import WidgetFrame from '$lib/components/molecules/WidgetFrame/WidgetFrame.svelte';
	import MediaKindIcon from '$lib/components/atoms/MediaKindIcon/MediaKindIcon.svelte';
	import type { CanvasLayer } from '$lib/utils/canvasDocument.js';
	import type { WidgetRect } from '$lib/components/molecules/WidgetCanvas/widgetCanvasContext.js';

	interface MediaLayerItemProps {
		layer: CanvasLayer;
		selected?: boolean;
		/** Let clicks pass through (layer sits above the selection). */
		passthrough?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		onchange?: (rect: WidgetRect) => void;
	}

	let {
		layer,
		selected = false,
		passthrough = false,
		class: className = '',
		onclick,
		onchange
	}: MediaLayerItemProps = $props();

	let rect = $state<WidgetRect>({ ...layer.rect });

	$effect(() => {
		rect = { ...layer.rect };
	});

	const fitClass = $derived(
		layer.objectFit === 'contain'
			? 'object-contain'
			: layer.objectFit === 'fill'
				? 'object-fill'
				: 'object-cover'
	);

	const transform = $derived.by(() => {
		const parts: string[] = [];
		if (layer.rotation) parts.push(`rotate(${layer.rotation}deg)`);
		if (layer.flipX) parts.push('scaleX(-1)');
		if (layer.flipY) parts.push('scaleY(-1)');
		return parts.length ? parts.join(' ') : undefined;
	});

	const filter = $derived.by(() => {
		const parts: string[] = [];
		if (layer.blur) parts.push(`blur(${layer.blur}px)`);
		return parts.length ? parts.join(' ') : undefined;
	});

	const boxShadow = $derived(
		layer.shadowBlur
			? `0 ${Math.round(layer.shadowBlur / 3)}px ${layer.shadowBlur}px ${layer.shadowColor ?? 'rgba(0,0,0,0.35)'}`
			: undefined
	);
</script>

{#if layer.visible}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class={['contents', className]}
		data-layer-item
		data-layer-frame={layer.id}
		onclick={(e) => {
			if (passthrough) return;
			e.stopPropagation();
			onclick?.(e);
		}}
		style:opacity={layer.opacity}
	>
		<WidgetFrame
			freeform
			showChrome={false}
			flush
			handleStyle="canva"
			handlesVisible={selected}
			raiseOnSelect={false}
			stackIndex={layer.zIndex}
			draggable={!layer.locked}
			resizable={!layer.locked}
			bind:rect
			minW={layer.kind === 'line' || layer.kind === 'arrow' || layer.kind === 'path' ? 16 : 40}
			minH={layer.kind === 'line' ? 4 : layer.kind === 'arrow' || layer.kind === 'path' ? 16 : 24}
			class={['bg-transparent', passthrough && 'pointer-events-none']}
			onchange={(r) => {
				rect = r;
				onchange?.(r);
			}}
		>
			<div
				class="h-full w-full"
				style:transform
				style:filter
				style:box-shadow={boxShadow}
				style:border-radius={layer.borderRadius ? `${layer.borderRadius}px` : undefined}
				style:overflow={layer.kind === 'image' || layer.kind === 'video' || layer.kind === 'sticky'
					? 'hidden'
					: undefined}
			>
				{#if layer.kind === 'image' && layer.src}
					<img
						src={layer.src}
						alt={layer.name}
						class={['h-full w-full', fitClass]}
						draggable="false"
					/>
				{:else if layer.kind === 'video' && layer.src}
					<video src={layer.src} class={['h-full w-full', fitClass]} muted playsinline></video>
				{:else if layer.kind === 'text' || layer.kind === 'sticky'}
					<div
						class="flex h-full w-full px-2 py-1"
						style:background={layer.kind === 'sticky'
							? (layer.fill ?? '#fef08a')
							: layer.textBackground}
						style:color={layer.color ?? (layer.kind === 'sticky' ? '#713f12' : '#0f172a')}
						style:font-size="{(layer.fontSize ?? (layer.kind === 'sticky' ? 20 : 32))}px"
						style:font-weight={layer.fontWeight ?? 600}
						style:font-family={layer.fontFamily}
						style:font-style={layer.fontStyle ?? 'normal'}
						style:text-decoration={layer.textDecoration ?? 'none'}
						style:letter-spacing={layer.letterSpacing != null
							? `${layer.letterSpacing}px`
							: undefined}
						style:line-height={layer.lineHeight ?? 1.25}
						style:justify-content={layer.textAlign === 'center'
							? 'center'
							: layer.textAlign === 'right'
								? 'flex-end'
								: 'flex-start'}
						style:text-align={layer.textAlign ?? 'left'}
						style:align-items={layer.kind === 'sticky' ? 'flex-start' : 'center'}
						style:border-radius="{layer.borderRadius ?? (layer.kind === 'sticky' ? 4 : 0)}px"
					>
						{layer.text ?? (layer.kind === 'sticky' ? 'Note' : 'Text')}
					</div>
				{:else if layer.kind === 'rect' || layer.kind === 'roundRect'}
					<div
						class="h-full w-full"
						style:background={layer.fill ?? '#3b82f6'}
						style:border-radius="{layer.borderRadius ?? (layer.kind === 'roundRect' ? 24 : 0)}px"
						style:border={layer.stroke
							? `${layer.strokeWidth ?? 2}px solid ${layer.stroke}`
							: undefined}
					></div>
				{:else if layer.kind === 'ellipse'}
					<div
						class="h-full w-full rounded-full"
						style:background={layer.fill ?? '#22c55e'}
						style:border={layer.stroke
							? `${layer.strokeWidth ?? 2}px solid ${layer.stroke}`
							: undefined}
					></div>
				{:else if layer.kind === 'triangle'}
					<svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
						<polygon
							points="50,4 96,96 4,96"
							fill={layer.fill ?? '#f59e0b'}
							stroke={layer.stroke}
							stroke-width={layer.strokeWidth ?? 0}
						/>
					</svg>
				{:else if layer.kind === 'star'}
					<svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
						<polygon
							points="50,5 61,38 96,38 68,59 79,92 50,72 21,92 32,59 4,38 39,38"
							fill={layer.fill ?? '#ef4444'}
							stroke={layer.stroke}
							stroke-width={layer.strokeWidth ?? 0}
						/>
					</svg>
				{:else if layer.kind === 'hexagon'}
					<svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
						<polygon
							points="25,5 75,5 95,50 75,95 25,95 5,50"
							fill={layer.fill ?? '#06b6d4'}
							stroke={layer.stroke}
							stroke-width={layer.strokeWidth ?? 0}
						/>
					</svg>
				{:else if layer.kind === 'pentagon'}
					<svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
						<polygon
							points="50,5 95,38 78,95 22,95 5,38"
							fill={layer.fill ?? '#a855f7'}
							stroke={layer.stroke}
							stroke-width={layer.strokeWidth ?? 0}
						/>
					</svg>
				{:else if layer.kind === 'diamond'}
					<svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
						<polygon
							points="50,4 96,50 50,96 4,50"
							fill={layer.fill ?? '#f43f5e'}
							stroke={layer.stroke}
							stroke-width={layer.strokeWidth ?? 0}
						/>
					</svg>
				{:else if layer.kind === 'heart'}
					<svg class="h-full w-full" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
						<path
							fill={layer.fill ?? '#ec4899'}
							d="M12 21s-6.7-4.35-9.33-7.6C.5 10.8 1.1 7.1 3.9 5.5 6.1 4.25 8.55 5 12 8.1c3.45-3.1 5.9-3.85 8.1-2.6 2.8 1.6 3.4 5.3 1.23 7.9C18.7 16.65 12 21 12 21z"
						/>
					</svg>
				{:else if layer.kind === 'line'}
					{@const vertical = layer.rect.h > layer.rect.w}
					{@const sw = Math.max(2, layer.strokeWidth ?? 4)}
					<div
						class={[
							'absolute rounded-full',
							vertical
								? 'left-1/2 top-0 h-full -translate-x-1/2'
								: 'left-0 top-1/2 w-full -translate-y-1/2'
						]}
						style:background={layer.fill ?? '#94a3b8'}
						style:width={vertical ? `${sw}px` : undefined}
						style:height={vertical ? undefined : `${sw}px`}
					></div>
				{:else if layer.kind === 'arrow'}
					{@const vertical = layer.rect.h > layer.rect.w}
					{@const sw = Math.max(2, layer.strokeWidth ?? 4)}
					{@const bw = layer.rect.w}
					{@const bh = layer.rect.h}
					{@const len = vertical ? bh : bw}
					{@const thick = vertical ? bw : bh}
					{@const head = Math.min(Math.max(14, thick * 0.9), len * 0.35, 40)}
					<svg class="h-full w-full overflow-visible" viewBox={`0 0 ${bw} ${bh}`} aria-hidden="true">
						{#if vertical}
							{@const cx = bw / 2}
							<line
								x1={cx}
								y1={sw}
								x2={cx}
								y2={bh - head}
								stroke={layer.fill ?? '#0f172a'}
								stroke-width={sw}
								stroke-linecap="round"
							/>
							<polygon
								points={`${cx},${bh - sw} ${cx - head * 0.45},${bh - head} ${cx + head * 0.45},${bh - head}`}
								fill={layer.fill ?? '#0f172a'}
							/>
						{:else}
							{@const cy = bh / 2}
							<line
								x1={sw}
								y1={cy}
								x2={bw - head}
								y2={cy}
								stroke={layer.fill ?? '#0f172a'}
								stroke-width={sw}
								stroke-linecap="round"
							/>
							<polygon
								points={`${bw - sw},${cy} ${bw - head},${cy - head * 0.45} ${bw - head},${cy + head * 0.45}`}
								fill={layer.fill ?? '#0f172a'}
							/>
						{/if}
					</svg>
				{:else if layer.kind === 'path' && layer.points?.length}
					{@const bw = Math.max(1, layer.rect.w)}
					{@const bh = Math.max(1, layer.rect.h)}
					{@const d = layer.points
						.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * bw} ${p.y * bh}`)
						.join(' ')}
					<svg class="h-full w-full overflow-visible" viewBox={`0 0 ${bw} ${bh}`} aria-hidden="true">
						<path
							d={layer.closed ? `${d} Z` : d}
							fill={layer.closed ? (layer.fill ?? '#0f172a') : 'none'}
							fill-opacity={layer.closed ? 0.15 : 1}
							stroke={layer.stroke ?? layer.fill ?? '#0f172a'}
							stroke-width={Math.max(2, layer.strokeWidth ?? 3)}
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<div
						class="flex h-full w-full items-center justify-center gap-2 bg-surface-overlay/80 text-secondary"
					>
						<MediaKindIcon kind={layer.kind === 'audio' ? 'audio' : 'image'} />
						<span class="text-xs">{layer.name}</span>
					</div>
				{/if}
			</div>
		</WidgetFrame>
	</div>
{/if}
