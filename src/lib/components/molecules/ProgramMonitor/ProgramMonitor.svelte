<script lang="ts">
	import type { MediaClip, MediaClipRect, MediaTrack } from '$lib/utils/mediaTracks.js';
	import {
		findClipAt,
		findTransitionAt,
		isClipActiveAt,
		resolveClipRect,
		resolvePreviewOpacity,
		transitionDipOverlay,
		transitionLayerStyle,
		type TransitionLayerStyle
	} from '$lib/utils/mediaTracks.js';
	import { formatTimecode } from '$lib/utils/mediaTime.js';
	import MarqueeRect from '$lib/components/atoms/MarqueeRect/MarqueeRect.svelte';
	import {
		attachMarqueeSelect,
		collectMarqueeItems,
		defaultMarqueeIgnore,
		resolveMarqueeSelection,
		type MarqueeRect as MarqueeBox
	} from '$lib/utils/marqueeSelect.js';
	import { onDestroy } from 'svelte';

	type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

	interface ProgramMonitorProps {
		width?: number;
		height?: number;
		background?: string;
		currentTimeMs?: number;
		playing?: boolean;
		playbackRate?: number;
		muted?: boolean;
		volume?: number;
		tracks?: MediaTrack[];
		selectedClipIds?: string[];
		/** When true, selected overlays can be dragged / resized on the frame */
		editable?: boolean;
		class?: string;
		onselectclip?: (clipId: string, e: MouseEvent) => void;
		onchangeclip?: (clip: MediaClip) => void;
		/** Batch update (multi-drag). Falls back to repeated onchangeclip. */
		onchangeclips?: (clips: MediaClip[]) => void;
		onemptyclick?: () => void;
		onselectionchange?: (clipIds: string[]) => void;
	}

	let {
		width = 1280,
		height = 720,
		background = '#0a0a0a',
		currentTimeMs = 0,
		playing = false,
		playbackRate = 1,
		muted = false,
		volume = 1,
		tracks = [],
		selectedClipIds = [],
		editable = true,
		class: className = '',
		onselectclip,
		onchangeclip,
		onchangeclips,
		onemptyclick,
		onselectionchange
	}: ProgramMonitorProps = $props();

	const frame = $derived({ width, height });
	const selectedSet = $derived(new Set(selectedClipIds));

	function isOverlayClip(clip: MediaClip): boolean {
		if (clip.kind === 'text') return true;
		if (clip.kind === 'image' && !clip.src) return true;
		if (clip.rect && clip.kind !== 'video' && clip.kind !== 'audio') return true;
		return false;
	}

	const activeVideo = $derived.by(() => {
		const clip =
			findClipAt(tracks, currentTimeMs, 'video') ?? findClipAt(tracks, currentTimeMs, 'image');
		if (!clip || clip.kind === 'text' || isOverlayClip(clip)) return null;
		return clip;
	});

	const activeAudio = $derived(findClipAt(tracks, currentTimeMs, 'audio'));

	const transition = $derived(findTransitionAt(tracks, currentTimeMs));

	function isProgramMedia(clip: MediaClip | null | undefined): clip is MediaClip {
		return !!clip && clip.kind !== 'text' && clip.kind !== 'audio' && !isOverlayClip(clip);
	}

	/** Outgoing full-frame layer during a transition (kept even past the cut). */
	const programOutgoing = $derived.by(() => {
		if (transition) {
			if (isProgramMedia(transition.from)) return transition.from;
			// From is an overlay — don't also treat the incoming program clip as "outgoing"
			if (activeVideo && activeVideo.id !== transition.to?.id) return activeVideo;
			return null;
		}
		return activeVideo;
	});

	const programIncoming = $derived.by(() => {
		if (!transition?.to || !isProgramMedia(transition.to)) return null;
		return transition.to;
	});

	const overlays = $derived.by(() => {
		const list: MediaClip[] = [];
		const seen = new Set<string>();
		for (const t of tracks) {
			if (t.muted && !t.solo) continue;
			for (const c of t.clips) {
				if (!isOverlayClip(c)) continue;
				const active = isClipActiveAt(c, currentTimeMs);
				const inTransition =
					!!transition &&
					(c.id === transition.from.id || (!!transition.to && c.id === transition.to.id));
				if (!active && !inTransition) continue;
				if (seen.has(c.id)) continue;
				seen.add(c.id);
				list.push(c);
			}
		}
		return list;
	});

	const dip = $derived(
		transition ? transitionDipOverlay(transition.type, transition.progress) : null
	);

	let stageEl = $state<HTMLDivElement | null>(null);
	let videoEl = $state<HTMLVideoElement | null>(null);
	let incomingVideoEl = $state<HTMLVideoElement | null>(null);
	let audioEl = $state<HTMLAudioElement | null>(null);
	let marquee = $state<MarqueeBox | null>(null);
	let disposeMarquee: (() => void) | null = null;

	const SCRUB_DRIFT = 0.04;
	const PLAY_DRIFT = 0.45;

	let lastVideoClipId: string | null = null;
	let lastIncomingClipId: string | null = null;
	let lastAudioClipId: string | null = null;
	let wasPlayingVideo = false;
	let wasPlayingIncoming = false;
	let wasPlayingAudio = false;

	type DragMode = 'move' | 'resize';
	let drag = $state<{
		clipId: string;
		mode: DragMode;
		edge?: ResizeEdge;
		startX: number;
		startY: number;
		origins: Record<string, MediaClipRect>;
	} | null>(null);

	$effect(() => {
		disposeMarquee?.();
		disposeMarquee = null;
		const el = stageEl;
		if (!el || !editable || playing || !onselectionchange) return;
		disposeMarquee = attachMarqueeSelect(el, {
			getItems: () => collectMarqueeItems(el),
			onRect: (r) => (marquee = r),
			shouldIgnore: (target) =>
				defaultMarqueeIgnore(target) ||
				(target instanceof Element && Boolean(target.closest('[data-marquee-id]'))),
			onSelect: ({ ids, modifier }) => {
				onselectionchange(resolveMarqueeSelection(ids, selectedClipIds, modifier));
			}
		});
	});

	onDestroy(() => {
		disposeMarquee?.();
	});

	const canvaHandles: { edge: ResizeEdge; class: string }[] = [
		{ edge: 'n', class: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-n-resize' },
		{ edge: 's', class: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-s-resize' },
		{ edge: 'e', class: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-e-resize' },
		{ edge: 'w', class: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-w-resize' },
		{ edge: 'nw', class: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize' },
		{ edge: 'ne', class: 'right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize' },
		{ edge: 'sw', class: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize' },
		{ edge: 'se', class: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize' }
	];

	function sourceTime(clip: MediaClip): number {
		const trim = clip.trimInMs ?? 0;
		if (currentTimeMs < clip.startMs) return trim / 1000;
		return Math.max(0, currentTimeMs - clip.startMs + trim) / 1000;
	}

	function clipOpacity(clip: MediaClip): number {
		const t = currentTimeMs;
		const inAnim = clip.animationIn;
		const outAnim = clip.animationOut;
		let opacity = resolvePreviewOpacity(clip);

		const fadeTypes = new Set([
			'fade',
			'pop',
			'bounce',
			'blur',
			'glow',
			'drop',
			'swing',
			'spin',
			'flip-x',
			'flip-y'
		]);
		if (inAnim && fadeTypes.has(inAnim.type) && inAnim.durationMs > 0) {
			const local = t - clip.startMs;
			if (local < inAnim.durationMs) {
				const p = local / inAnim.durationMs;
				const eased = inAnim.type === 'bounce' ? bounceEase(p) : p;
				opacity = Math.min(opacity, eased);
			}
		}
		if (outAnim && fadeTypes.has(outAnim.type) && outAnim.durationMs > 0) {
			const remaining = clip.endMs - t;
			if (remaining < outAnim.durationMs) {
				const p = remaining / outAnim.durationMs;
				opacity = Math.min(opacity, p);
			}
		}
		return Math.max(0, Math.min(1, opacity));
	}

	function bounceEase(p: number) {
		return Math.min(1, 1 - Math.abs(Math.sin((1 - p) * Math.PI * 1.2)) * (1 - p));
	}

	function clipFilter(clip: MediaClip): string | undefined {
		const t = currentTimeMs;
		const parts: string[] = [];

		function apply(type: string, durationMs: number, entering: boolean) {
			const local = entering ? t - clip.startMs : clip.endMs - t;
			if (local < 0 || local >= durationMs) return;
			const p = entering ? 1 - local / durationMs : 1 - local / durationMs;
			if (type === 'blur') parts.push(`blur(${p * 10}px)`);
			if (type === 'glow') parts.push(`brightness(${1 + p * 0.8})`);
		}

		if (clip.animationIn?.durationMs) apply(clip.animationIn.type, clip.animationIn.durationMs, true);
		if (clip.animationOut?.durationMs) apply(clip.animationOut.type, clip.animationOut.durationMs, false);
		return parts.length ? parts.join(' ') : undefined;
	}

	function clipTransform(clip: MediaClip): string {
		const t = currentTimeMs;
		const inAnim = clip.animationIn;
		const outAnim = clip.animationOut;
		const parts: string[] = [];

		function applyIn(type: string, durationMs: number) {
			const local = t - clip.startMs;
			if (local < 0 || local >= durationMs) return;
			const p = 1 - local / durationMs; // 1 → 0 as it settles
			const reveal = 1 - p; // 0 → 1
			if (type === 'slide' || type === 'slide-up') parts.push(`translateY(${p * 48}px)`);
			else if (type === 'slide-down') parts.push(`translateY(${-p * 48}px)`);
			else if (type === 'slide-left') parts.push(`translateX(${p * 64}px)`);
			else if (type === 'slide-right') parts.push(`translateX(${-p * 64}px)`);
			else if (type === 'scale' || type === 'pop' || type === 'grow')
				parts.push(`scale(${0.55 + 0.45 * reveal})`);
			else if (type === 'shrink') parts.push(`scale(${1.35 - 0.35 * reveal})`);
			else if (type === 'rotate' || type === 'spin')
				parts.push(`rotate(${p * -28}deg) scale(${0.85 + 0.15 * reveal})`);
			else if (type === 'bounce') parts.push(`translateY(${Math.sin(p * Math.PI) * 22}px)`);
			else if (type === 'drop') parts.push(`translateY(${-p * 80}px)`);
			else if (type === 'swing') parts.push(`rotate(${Math.sin(p * Math.PI) * -18}deg)`);
			else if (type === 'flip-x') parts.push(`perspective(700px) rotateY(${p * 90}deg)`);
			else if (type === 'flip-y') parts.push(`perspective(700px) rotateX(${p * 90}deg)`);
			else if (type === 'skew') parts.push(`skewX(${p * 18}deg)`);
			else if (type === 'expand-h') parts.push(`scaleX(${0.15 + 0.85 * reveal})`);
			else if (type === 'expand-v') parts.push(`scaleY(${0.15 + 0.85 * reveal})`);
		}

		function applyOut(type: string, durationMs: number) {
			const remaining = clip.endMs - t;
			if (remaining < 0 || remaining >= durationMs) return;
			const p = 1 - remaining / durationMs; // 0 → 1 as it exits
			if (type === 'slide' || type === 'slide-up') parts.push(`translateY(${-p * 48}px)`);
			else if (type === 'slide-down') parts.push(`translateY(${p * 48}px)`);
			else if (type === 'slide-left') parts.push(`translateX(${-p * 64}px)`);
			else if (type === 'slide-right') parts.push(`translateX(${p * 64}px)`);
			else if (type === 'scale' || type === 'pop' || type === 'shrink')
				parts.push(`scale(${1 - 0.45 * p})`);
			else if (type === 'grow') parts.push(`scale(${1 + 0.35 * p})`);
			else if (type === 'rotate' || type === 'spin')
				parts.push(`rotate(${p * 28}deg) scale(${1 - 0.15 * p})`);
			else if (type === 'bounce') parts.push(`translateY(${-Math.sin(p * Math.PI) * 22}px)`);
			else if (type === 'drop') parts.push(`translateY(${p * 80}px)`);
			else if (type === 'swing') parts.push(`rotate(${Math.sin(p * Math.PI) * 18}deg)`);
			else if (type === 'flip-x') parts.push(`perspective(700px) rotateY(${p * -90}deg)`);
			else if (type === 'flip-y') parts.push(`perspective(700px) rotateX(${p * -90}deg)`);
			else if (type === 'skew') parts.push(`skewX(${-p * 18}deg)`);
			else if (type === 'expand-h') parts.push(`scaleX(${1 - 0.85 * p})`);
			else if (type === 'expand-v') parts.push(`scaleY(${1 - 0.85 * p})`);
		}

		if (inAnim?.durationMs) applyIn(inAnim.type, inAnim.durationMs);
		if (outAnim?.durationMs) applyOut(outAnim.type, outAnim.durationMs);

		return parts.length ? parts.join(' ') : 'none';
	}

	function ensureSrc(el: HTMLMediaElement, src: string) {
		if (el.dataset.mediaSrc === src) return;
		el.dataset.mediaSrc = src;
		el.src = src;
		el.load();
	}

	function syncMedia(
		el: HTMLMediaElement | null,
		clip: MediaClip | null,
		shouldPlay: boolean,
		opts: {
			lastClipId: string | null;
			wasPlaying: boolean;
			applyAudio: boolean;
		}
	): { clipId: string | null; wasPlaying: boolean } {
		if (!el || !clip?.src) {
			if (el && !el.paused) el.pause();
			return { clipId: null, wasPlaying: false };
		}

		ensureSrc(el, clip.src);
		el.playbackRate = playbackRate;

		if (opts.applyAudio) {
			const clipVol = clip.volume ?? 1;
			const nextVol = muted ? 0 : Math.max(0, Math.min(1, clipVol * volume));
			el.muted = muted || nextVol === 0;
			el.volume = nextVol;
		} else {
			el.muted = true;
		}

		const target = sourceTime(clip);
		const clipChanged = clip.id !== opts.lastClipId;
		const playStarted = shouldPlay && !opts.wasPlaying;
		const drift = Math.abs(el.currentTime - target);
		const threshold = shouldPlay ? PLAY_DRIFT * Math.max(1, playbackRate) : SCRUB_DRIFT;

		if (clipChanged || playStarted || drift > threshold) {
			try {
				el.currentTime = target;
			} catch {
				/* ignore seek before loaded */
			}
		}

		if (shouldPlay) {
			if (el.paused) void el.play().catch(() => {});
		} else if (!el.paused) {
			el.pause();
		}

		return { clipId: clip.id, wasPlaying: shouldPlay };
	}

	$effect(() => {
		const videoClip = programOutgoing?.kind === 'video' ? programOutgoing : null;
		const next = syncMedia(videoEl, videoClip, playing, {
			lastClipId: lastVideoClipId,
			wasPlaying: wasPlayingVideo,
			applyAudio: false
		});
		lastVideoClipId = next.clipId;
		wasPlayingVideo = next.wasPlaying;
	});

	$effect(() => {
		const videoClip = programIncoming?.kind === 'video' ? programIncoming : null;
		const next = syncMedia(incomingVideoEl, videoClip, playing, {
			lastClipId: lastIncomingClipId,
			wasPlaying: wasPlayingIncoming,
			applyAudio: false
		});
		lastIncomingClipId = next.clipId;
		wasPlayingIncoming = next.wasPlaying;
	});

	$effect(() => {
		const next = syncMedia(audioEl, activeAudio, playing, {
			lastClipId: lastAudioClipId,
			wasPlaying: wasPlayingAudio,
			applyAudio: true
		});
		lastAudioClipId = next.clipId;
		wasPlayingAudio = next.wasPlaying;
	});

	function overlayVisual(clip: MediaClip): TransitionLayerStyle {
		const baseOp = clipOpacity(clip);
		const baseTf = clipTransform(clip);
		const baseFilter = clipFilter(clip);
		if (
			!transition ||
			(clip.id !== transition.from.id && clip.id !== transition.to?.id)
		) {
			return {
				opacity: baseOp,
				transform: baseTf === 'none' ? 'none' : baseTf,
				filter: baseFilter
			};
		}
		const role = clip.id === transition.from.id ? 'from' : 'to';
		const layer = transitionLayerStyle(role, transition.type, transition.progress);
		const parts = [baseTf !== 'none' ? baseTf : '', layer.transform !== 'none' ? layer.transform : '']
			.filter(Boolean)
			.join(' ');
		const filters = [baseFilter, layer.filter].filter(Boolean).join(' ');
		return {
			opacity: baseOp * layer.opacity,
			transform: parts || 'none',
			filter: filters || undefined,
			transformOrigin: layer.transformOrigin,
			maskImage: layer.maskImage,
			wipe: layer.wipe,
			clipPath: layer.clipPath
		};
	}

	function programLayerStyle(role: 'from' | 'to', clip: MediaClip): TransitionLayerStyle {
		if (transition && (clip.id === transition.from.id || clip.id === transition.to?.id)) {
			const r = clip.id === transition.from.id ? 'from' : 'to';
			return transitionLayerStyle(r, transition.type, transition.progress);
		}
		if (role === 'from') {
			return {
				opacity: clipOpacity(clip),
				transform: clipTransform(clip),
				filter: clipFilter(clip)
			};
		}
		return { opacity: 1, transform: 'none' };
	}

	function layerInlineStyle(s: TransitionLayerStyle): string {
		const parts = [
			`opacity:${s.opacity}`,
			`transform:${s.transform || 'none'}`,
			`transform-origin:${s.transformOrigin ?? 'center'}`
		];
		if (s.filter) parts.push(`filter:${s.filter}`);
		if (s.clipPath) parts.push(`clip-path:${s.clipPath}`, `-webkit-clip-path:${s.clipPath}`);
		if (s.maskImage) {
			parts.push(
				`mask-image:${s.maskImage}`,
				`-webkit-mask-image:${s.maskImage}`,
				'mask-size:100% 100%',
				'-webkit-mask-size:100% 100%',
				'mask-repeat:no-repeat',
				'-webkit-mask-repeat:no-repeat'
			);
		}
		return parts.join(';');
	}

	function wipeBoxStyle(box: { left: string; top: string; width: string; height: string }): string {
		return `left:${box.left};top:${box.top};width:${box.width};height:${box.height};`;
	}

	function beginInteract(clip: MediaClip, mode: DragMode, e: PointerEvent, edge?: ResizeEdge) {
		if (!editable || playing) return;
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		onselectclip?.(clip.id, e as unknown as MouseEvent);
		const moveIds =
			mode === 'move' && selectedSet.has(clip.id) && selectedClipIds.length > 1
				? selectedClipIds
				: [clip.id];
		const origins: Record<string, MediaClipRect> = {};
		for (const id of moveIds) {
			const c = overlays.find((o) => o.id === id) ?? (id === clip.id ? clip : null);
			if (c) origins[id] = { ...resolveClipRect(c, frame) };
		}
		if (!origins[clip.id]) origins[clip.id] = { ...resolveClipRect(clip, frame) };
		drag = {
			clipId: clip.id,
			mode,
			edge,
			startX: e.clientX,
			startY: e.clientY,
			origins
		};
	}

	function applyResize(o: MediaClipRect, edge: ResizeEdge, dx: number, dy: number): MediaClipRect {
		const minW = 40;
		const minH = 24;
		let { x, y, w, h } = o;

		if (edge.includes('e')) w = Math.max(minW, o.w + dx);
		if (edge.includes('s')) h = Math.max(minH, o.h + dy);
		if (edge.includes('w')) {
			const nextW = Math.max(minW, o.w - dx);
			x = o.x + (o.w - nextW);
			w = nextW;
		}
		if (edge.includes('n')) {
			const nextH = Math.max(minH, o.h - dy);
			y = o.y + (o.h - nextH);
			h = nextH;
		}

		x = Math.min(Math.max(0, x), width - w);
		y = Math.min(Math.max(0, y), height - h);
		w = Math.min(w, width - x);
		h = Math.min(h, height - y);

		return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
	}

	function onPointerMove(e: PointerEvent) {
		if (!drag || !stageEl) return;
		const r = stageEl.getBoundingClientRect();
		const sx = r.width > 0 ? width / r.width : 1;
		const sy = r.height > 0 ? height / r.height : 1;
		const dx = (e.clientX - drag.startX) * sx;
		const dy = (e.clientY - drag.startY) * sy;

		if (drag.mode === 'move') {
			const updates: MediaClip[] = [];
			for (const [id, o] of Object.entries(drag.origins)) {
				const next = {
					x: Math.round(Math.min(Math.max(0, o.x + dx), width - o.w)),
					y: Math.round(Math.min(Math.max(0, o.y + dy), height - o.h)),
					w: o.w,
					h: o.h
				};
				const clip = overlays.find((c) => c.id === id);
				if (clip) updates.push({ ...clip, rect: next });
			}
			if (updates.length) {
				if (onchangeclips) onchangeclips(updates);
				else updates.forEach((c) => onchangeclip?.(c));
			}
			return;
		}

		const o = drag.origins[drag.clipId];
		if (!o) return;
		const next = applyResize(o, drag.edge ?? 'se', dx, dy);
		const clip = overlays.find((c) => c.id === drag!.clipId);
		if (clip) onchangeclip?.({ ...clip, rect: next });
	}

	function endInteract() {
		drag = null;
	}

	function styleForRect(rect: MediaClipRect): string {
		return `left:${(rect.x / width) * 100}%;top:${(rect.y / height) * 100}%;width:${(rect.w / width) * 100}%;height:${(rect.h / height) * 100}%;`;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={stageEl}
	class={[
		'relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-border',
		className
	]}
	style:background
	style:aspect-ratio={`${width} / ${height}`}
	onpointermove={onPointerMove}
	onpointerup={endInteract}
	onpointercancel={endInteract}
	onclick={(e) => {
		if (e.target === e.currentTarget) onemptyclick?.();
	}}
>
	<!-- Program / full-frame media (+ transition pair) -->
	<div class="absolute inset-0 overflow-hidden">
		{#if programOutgoing?.src && (programOutgoing.kind === 'video' || programOutgoing.kind === 'image')}
			{@const fromStyle = programLayerStyle('from', programOutgoing)}
			{#if fromStyle.wipe}
				<div class="absolute overflow-hidden" style={wipeBoxStyle(fromStyle.wipe.box)}>
					<div
						class="absolute flex items-center justify-center"
						style={`${wipeBoxStyle(fromStyle.wipe.content)}${layerInlineStyle(fromStyle)}`}
					>
						{#if programOutgoing.kind === 'video'}
							<video
								bind:this={videoEl}
								class="h-full w-full object-contain"
								muted
								playsinline
								preload="auto"
							></video>
						{:else}
							<img
								src={programOutgoing.src}
								alt={programOutgoing.name}
								class="h-full w-full object-contain"
							/>
						{/if}
					</div>
				</div>
			{:else}
				<div class="absolute inset-0 flex items-center justify-center" style={layerInlineStyle(fromStyle)}>
					{#if programOutgoing.kind === 'video'}
						<video
							bind:this={videoEl}
							class="h-full w-full object-contain"
							muted
							playsinline
							preload="auto"
						></video>
					{:else}
						<img
							src={programOutgoing.src}
							alt={programOutgoing.name}
							class="h-full w-full object-contain"
						/>
					{/if}
				</div>
			{/if}
		{/if}

		{#if programIncoming?.src}
			{@const toStyle = programLayerStyle('to', programIncoming)}
			{#if toStyle.wipe}
				<div class="absolute overflow-hidden" style={wipeBoxStyle(toStyle.wipe.box)}>
					<div
						class="absolute flex items-center justify-center"
						style={`${wipeBoxStyle(toStyle.wipe.content)}${layerInlineStyle(toStyle)}`}
					>
						{#if programIncoming.kind === 'video'}
							<video
								bind:this={incomingVideoEl}
								class="h-full w-full object-contain"
								muted
								playsinline
								preload="auto"
							></video>
						{:else}
							<img
								src={programIncoming.src}
								alt={programIncoming.name}
								class="h-full w-full object-contain"
							/>
						{/if}
					</div>
				</div>
			{:else}
				<div class="absolute inset-0 flex items-center justify-center" style={layerInlineStyle(toStyle)}>
					{#if programIncoming.kind === 'video'}
						<video
							bind:this={incomingVideoEl}
							class="h-full w-full object-contain"
							muted
							playsinline
							preload="auto"
						></video>
					{:else}
						<img
							src={programIncoming.src}
							alt={programIncoming.name}
							class="h-full w-full object-contain"
						/>
					{/if}
				</div>
			{/if}
		{/if}

		{#if dip}
			<div
				class="pointer-events-none absolute inset-0"
				style:background={dip.color}
				style:opacity={dip.opacity}
			></div>
		{/if}

		{#if !programOutgoing?.src && overlays.length === 0 && !programIncoming}
			<div class="flex h-full items-center justify-center">
				<span class="text-sm text-muted">No clip at playhead</span>
			</div>
		{/if}
	</div>

	{#each overlays as clip (clip.id)}
		{@const rect = resolveClipRect(clip, frame)}
		{@const selected = selectedSet.has(clip.id)}
		{@const showChrome = selected && editable && !playing}
		{@const visual = overlayVisual(clip)}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class={[
				'group/overlay absolute box-border overflow-hidden',
				editable && !playing ? 'cursor-move' : 'pointer-events-none',
				showChrome && 'outline outline-2 outline-[#3b82f6]'
			]}
			style={styleForRect(rect)}
			data-marquee-id={clip.id}
			onpointerdown={(e) => {
				const t = e.target as HTMLElement;
				if (t?.closest('[data-resize-handle]')) return;
				beginInteract(clip, 'move', e);
			}}
			onclick={(e) => {
				e.stopPropagation();
				onselectclip?.(clip.id, e);
			}}
		>
			{#if visual.wipe}
				<div class="absolute overflow-hidden" style={wipeBoxStyle(visual.wipe.box)}>
					<div
						class="absolute flex items-center justify-center"
						style={`${wipeBoxStyle(visual.wipe.content)}${layerInlineStyle(visual)};background:${clip.kind === 'image' && !clip.src ? (clip.color ?? '#000') : 'transparent'}`}
					>
						{#if clip.kind === 'text'}
							<span
								class="max-h-full max-w-full overflow-hidden whitespace-pre-line px-2 py-1 text-center leading-tight"
								style:color={clip.textColor ?? '#ffffff'}
								style:font-size={`${Math.max(10, (clip.fontSize ?? 24) * (rect.h / 120))}px`}
								style:font-weight={clip.fontWeight ?? 600}
								style:font-family={clip.fontFamily}
								style:text-align={clip.textAlign ?? 'center'}
								style:text-shadow="0 1px 3px rgba(0,0,0,0.55)"
							>
								{clip.text ?? clip.name}
							</span>
						{:else if clip.src}
							<img src={clip.src} alt={clip.name} class="h-full w-full object-cover" />
						{/if}
					</div>
				</div>
			{:else}
				<div
					class="flex h-full w-full items-center justify-center overflow-hidden"
					style={`${layerInlineStyle(visual)};background:${clip.kind === 'image' && !clip.src ? (clip.color ?? '#000') : 'transparent'}`}
				>
					{#if clip.kind === 'text'}
						<span
							class="max-h-full max-w-full overflow-hidden whitespace-pre-line px-2 py-1 text-center leading-tight"
							style:color={clip.textColor ?? '#ffffff'}
							style:font-size={`${Math.max(10, (clip.fontSize ?? 24) * (rect.h / 120))}px`}
							style:font-weight={clip.fontWeight ?? 600}
							style:font-family={clip.fontFamily}
							style:text-align={clip.textAlign ?? 'center'}
							style:text-shadow="0 1px 3px rgba(0,0,0,0.55)"
						>
							{clip.text ?? clip.name}
						</span>
					{:else if clip.src}
						<img src={clip.src} alt={clip.name} class="h-full w-full object-cover" />
					{/if}
				</div>
			{/if}

			{#if showChrome}
				{#each canvaHandles as h (h.edge)}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						data-resize-handle
						role="separator"
						aria-label={`Resize ${h.edge}`}
						class={[
							'absolute z-20 h-3 w-3 touch-none rounded-full border-2 border-[#3b82f6] bg-white shadow-sm',
							h.class
						]}
						onpointerdown={(e) => beginInteract(clip, 'resize', e, h.edge)}
					></div>
				{/each}
			{/if}
		</div>
	{/each}

	<audio bind:this={audioEl} class="hidden" preload="auto"></audio>

	<MarqueeRect rect={marquee} />

	<div
		class="pointer-events-none absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white"
	>
		{formatTimecode(currentTimeMs)}
		{#if transition}
			<span class="ml-2 text-fuchsia-300">· {transition.type}</span>
		{/if}
	</div>
</div>
