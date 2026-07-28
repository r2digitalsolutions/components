<script lang="ts">
	import type { MediaClip, MediaClipRect, MediaTrack } from '$lib/utils/mediaTracks.js';
	import {
		findClipAt,
		isClipActiveAt,
		resolveClipRect,
		resolvePreviewOpacity
	} from '$lib/utils/mediaTracks.js';
	import { formatTimecode } from '$lib/utils/mediaTime.js';

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
		onemptyclick?: () => void;
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
		onemptyclick
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

	const overlays = $derived.by(() => {
		const list: MediaClip[] = [];
		for (const t of tracks) {
			if (t.muted && !t.solo) continue;
			for (const c of t.clips) {
				if (!isClipActiveAt(c, currentTimeMs)) continue;
				if (isOverlayClip(c)) list.push(c);
			}
		}
		return list;
	});

	let stageEl = $state<HTMLDivElement | null>(null);
	let videoEl = $state<HTMLVideoElement | null>(null);
	let audioEl = $state<HTMLAudioElement | null>(null);

	const SCRUB_DRIFT = 0.04;
	const PLAY_DRIFT = 0.45;

	let lastVideoClipId: string | null = null;
	let lastAudioClipId: string | null = null;
	let wasPlayingVideo = false;
	let wasPlayingAudio = false;

	type DragMode = 'move' | 'resize';
	let drag = $state<{
		clipId: string;
		mode: DragMode;
		edge?: ResizeEdge;
		startX: number;
		startY: number;
		origin: MediaClipRect;
	} | null>(null);

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
		return Math.max(0, currentTimeMs - clip.startMs + trim) / 1000;
	}

	function clipOpacity(clip: MediaClip): number {
		const t = currentTimeMs;
		const inAnim = clip.animationIn;
		const outAnim = clip.animationOut;
		let opacity = resolvePreviewOpacity(clip);
		if (inAnim?.type === 'fade' && inAnim.durationMs > 0) {
			const local = t - clip.startMs;
			if (local < inAnim.durationMs) opacity = Math.min(opacity, local / inAnim.durationMs);
		}
		if (outAnim?.type === 'fade' && outAnim.durationMs > 0) {
			const remaining = clip.endMs - t;
			if (remaining < outAnim.durationMs) {
				opacity = Math.min(opacity, remaining / outAnim.durationMs);
			}
		}
		return Math.max(0, Math.min(1, opacity));
	}

	function clipTransform(clip: MediaClip): string {
		const t = currentTimeMs;
		const inAnim = clip.animationIn;
		const outAnim = clip.animationOut;
		const parts: string[] = [];

		if (inAnim?.type === 'slide' && inAnim.durationMs > 0) {
			const local = t - clip.startMs;
			if (local < inAnim.durationMs) {
				const p = 1 - local / inAnim.durationMs;
				parts.push(`translateY(${p * 24}px)`);
			}
		} else if (inAnim?.type === 'scale' && inAnim.durationMs > 0) {
			const local = t - clip.startMs;
			if (local < inAnim.durationMs) {
				const p = local / inAnim.durationMs;
				parts.push(`scale(${0.85 + 0.15 * p})`);
			}
		}

		if (outAnim?.type === 'slide' && outAnim.durationMs > 0) {
			const remaining = clip.endMs - t;
			if (remaining < outAnim.durationMs) {
				const p = 1 - remaining / outAnim.durationMs;
				parts.push(`translateY(${-p * 24}px)`);
			}
		} else if (outAnim?.type === 'scale' && outAnim.durationMs > 0) {
			const remaining = clip.endMs - t;
			if (remaining < outAnim.durationMs) {
				const p = remaining / outAnim.durationMs;
				parts.push(`scale(${0.85 + 0.15 * p})`);
			}
		}

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
		const videoClip = activeVideo?.kind === 'video' ? activeVideo : null;
		const next = syncMedia(videoEl, videoClip, playing, {
			lastClipId: lastVideoClipId,
			wasPlaying: wasPlayingVideo,
			applyAudio: false
		});
		lastVideoClipId = next.clipId;
		wasPlayingVideo = next.wasPlaying;
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

	function beginInteract(clip: MediaClip, mode: DragMode, e: PointerEvent, edge?: ResizeEdge) {
		if (!editable || playing) return;
		e.preventDefault();
		e.stopPropagation();
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		onselectclip?.(clip.id, e as unknown as MouseEvent);
		drag = {
			clipId: clip.id,
			mode,
			edge,
			startX: e.clientX,
			startY: e.clientY,
			origin: { ...resolveClipRect(clip, frame) }
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
		const o = drag.origin;
		let next: MediaClipRect;
		if (drag.mode === 'move') {
			next = {
				x: Math.round(Math.min(Math.max(0, o.x + dx), width - o.w)),
				y: Math.round(Math.min(Math.max(0, o.y + dy), height - o.h)),
				w: o.w,
				h: o.h
			};
		} else {
			next = applyResize(o, drag.edge ?? 'se', dx, dy);
		}
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
	{#if activeVideo?.src && activeVideo.kind === 'video'}
		<video
			bind:this={videoEl}
			class="h-full w-full object-contain"
			style:opacity={clipOpacity(activeVideo)}
			style:transform={clipTransform(activeVideo)}
			muted
			playsinline
			preload="auto"
		></video>
	{:else if activeVideo?.src && activeVideo.kind === 'image'}
		<img
			src={activeVideo.src}
			alt={activeVideo.name}
			class="h-full w-full object-contain"
			style:opacity={clipOpacity(activeVideo)}
			style:transform={clipTransform(activeVideo)}
		/>
	{:else if overlays.length === 0}
		<span class="text-sm text-muted">No clip at playhead</span>
	{/if}

	{#each overlays as clip (clip.id)}
		{@const rect = resolveClipRect(clip, frame)}
		{@const selected = selectedSet.has(clip.id)}
		{@const showChrome = selected && editable && !playing}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class={[
				'group/overlay absolute box-border flex items-center justify-center overflow-visible',
				editable && !playing ? 'cursor-move' : 'pointer-events-none',
				showChrome && 'outline outline-2 outline-[#3b82f6]'
			]}
			style={styleForRect(rect)}
			style:opacity={clipOpacity(clip)}
			style:transform={clipTransform(clip)}
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
			<div
				class="flex h-full w-full items-center justify-center overflow-hidden"
				style:background={clip.kind === 'image' && !clip.src ? (clip.color ?? '#000') : undefined}
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

	<div
		class="pointer-events-none absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white"
	>
		{formatTimecode(currentTimeMs)}
	</div>
</div>
