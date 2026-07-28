/** Shared track/clip types and helpers for Video / Audio editors. */

export type MediaAssetKind = 'image' | 'video' | 'audio' | 'text';

/** Spatial rect on the program frame (document px). */
export interface MediaClipRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export type MediaClipAlign =
	| 'left'
	| 'center-h'
	| 'right'
	| 'top'
	| 'center-v'
	| 'bottom'
	| 'center'
	| 'full';

export interface MediaAsset {
	id: string;
	kind: MediaAssetKind;
	name: string;
	/** Object URL or remote URL */
	src?: string;
	durationMs?: number;
	width?: number;
	height?: number;
}

export interface MediaClip {
	id: string;
	trackId: string;
	assetId?: string;
	name: string;
	kind: MediaAssetKind;
	src?: string;
	/** Timeline start */
	startMs: number;
	/** Timeline end */
	endMs: number;
	/** Source trim in */
	trimInMs?: number;
	/** Source trim out (absolute in source) */
	trimOutMs?: number;
	color?: string;
	/** Overlay / title text */
	text?: string;
	/** Timeline clip block opacity (0–1). Does not affect program preview. */
	opacity?: number;
	/** Program monitor / render opacity (0–1). */
	previewOpacity?: number;
	volume?: number;
	fontSize?: number;
	fontWeight?: number | string;
	fontFamily?: string;
	textAlign?: 'left' | 'center' | 'right';
	textColor?: string;
	/** Position on program monitor (document px). Overlays / positioned media. */
	rect?: MediaClipRect;
	animationIn?: { type: string; durationMs: number };
	animationOut?: { type: string; durationMs: number };
	transitionOut?: { type: string; durationMs: number };
}

export type MediaTrackKind = 'video' | 'audio' | 'image';

export interface MediaTrack {
	id: string;
	name: string;
	kind: MediaTrackKind;
	muted?: boolean;
	solo?: boolean;
	locked?: boolean;
	armed?: boolean;
	color?: string;
	clips: MediaClip[];
}

export function uid(prefix = 'id'): string {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createMediaClip(
	partial: Omit<MediaClip, 'id'> & { id?: string }
): MediaClip {
	return {
		id: partial.id ?? uid('clip'),
		trackId: partial.trackId,
		assetId: partial.assetId,
		name: partial.name,
		kind: partial.kind,
		src: partial.src,
		startMs: partial.startMs,
		endMs: Math.max(partial.startMs + 1, partial.endMs),
		trimInMs: partial.trimInMs,
		trimOutMs: partial.trimOutMs,
		color: partial.color,
		text: partial.text,
		opacity: partial.opacity,
		previewOpacity: partial.previewOpacity,
		volume: partial.volume,
		fontSize: partial.fontSize,
		fontWeight: partial.fontWeight,
		fontFamily: partial.fontFamily,
		textAlign: partial.textAlign,
		textColor: partial.textColor,
		rect: partial.rect,
		animationIn: partial.animationIn,
		animationOut: partial.animationOut,
		transitionOut: partial.transitionOut
	};
}

/** Default overlay rect for text / plates on a program frame. */
export function defaultOverlayRect(
	frame: { width: number; height: number },
	preset:
		| 'center'
		| 'lower-third'
		| 'top'
		| 'watermark'
		| 'full'
		| 'badge'
		| 'ticker'
		| 'side' = 'center'
): MediaClipRect {
	const { width: W, height: H } = frame;
	switch (preset) {
		case 'full':
			return { x: 0, y: 0, w: W, h: H };
		case 'lower-third':
			return { x: Math.round(W * 0.06), y: Math.round(H * 0.72), w: Math.round(W * 0.55), h: Math.round(H * 0.16) };
		case 'top':
			return { x: Math.round(W * 0.1), y: Math.round(H * 0.08), w: Math.round(W * 0.8), h: Math.round(H * 0.18) };
		case 'watermark':
			return { x: Math.round(W * 0.78), y: Math.round(H * 0.88), w: Math.round(W * 0.18), h: Math.round(H * 0.08) };
		case 'badge':
			return { x: Math.round(W * 0.04), y: Math.round(H * 0.04), w: Math.round(W * 0.22), h: Math.round(H * 0.1) };
		case 'ticker':
			return { x: 0, y: Math.round(H * 0.88), w: W, h: Math.round(H * 0.12) };
		case 'side':
			return { x: 0, y: 0, w: Math.round(W * 0.28), h: H };
		case 'center':
		default: {
			const w = Math.round(W * 0.7);
			const h = Math.round(H * 0.22);
			return { x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), w, h };
		}
	}
}

export function clipHasSpatialRect(clip: MediaClip): boolean {
	return !!clip.rect || clip.kind === 'text' || (!!clip.color && clip.kind === 'image' && !clip.src);
}

export function resolveClipRect(
	clip: MediaClip,
	frame: { width: number; height: number }
): MediaClipRect {
	if (clip.rect) return clip.rect;
	if (clip.kind === 'text') return defaultOverlayRect(frame, 'lower-third');
	if (clip.kind === 'image' && !clip.src) return defaultOverlayRect(frame, 'full');
	return { x: 0, y: 0, w: frame.width, h: frame.height };
}

export function alignClipRect(
	clip: MediaClip,
	frame: { width: number; height: number },
	align: MediaClipAlign
): MediaClip {
	const rect = alignMediaRect(resolveClipRect(clip, frame), frame, align);
	return { ...clip, rect };
}

export function alignMediaRect(
	rect: MediaClipRect,
	bounds: { width: number; height: number },
	align: MediaClipAlign
): MediaClipRect {
	if (align === 'full') {
		return { x: 0, y: 0, w: bounds.width, h: bounds.height };
	}
	let { x, y, w, h } = rect;
	switch (align) {
		case 'left':
			x = 0;
			break;
		case 'center-h':
			x = Math.max(0, (bounds.width - w) / 2);
			break;
		case 'right':
			x = Math.max(0, bounds.width - w);
			break;
		case 'top':
			y = 0;
			break;
		case 'center-v':
			y = Math.max(0, (bounds.height - h) / 2);
			break;
		case 'bottom':
			y = Math.max(0, bounds.height - h);
			break;
		case 'center':
			x = Math.max(0, (bounds.width - w) / 2);
			y = Math.max(0, (bounds.height - h) / 2);
			break;
	}
	return { x, y, w, h };
}

export function createMediaTrack(
	partial: Omit<MediaTrack, 'id' | 'clips'> & { id?: string; clips?: MediaClip[] }
): MediaTrack {
	return {
		id: partial.id ?? uid('track'),
		name: partial.name,
		kind: partial.kind,
		muted: partial.muted ?? false,
		solo: partial.solo ?? false,
		locked: partial.locked ?? false,
		armed: partial.armed ?? false,
		color: partial.color,
		clips: partial.clips ?? []
	};
}

export function clipDurationMs(clip: MediaClip): number {
	return Math.max(0, clip.endMs - clip.startMs);
}

export function moveClip(clip: MediaClip, newStartMs: number, durationMs?: number): MediaClip {
	const dur = durationMs ?? clipDurationMs(clip);
	const startMs = Math.max(0, newStartMs);
	return { ...clip, startMs, endMs: startMs + dur };
}

export function trimClipStart(clip: MediaClip, newStartMs: number, minDur = 50): MediaClip {
	const endMs = clip.endMs;
	const startMs = Math.min(Math.max(0, newStartMs), endMs - minDur);
	const delta = startMs - clip.startMs;
	return {
		...clip,
		startMs,
		trimInMs: (clip.trimInMs ?? 0) + delta
	};
}

export function trimClipEnd(clip: MediaClip, newEndMs: number, minDur = 50): MediaClip {
	const startMs = clip.startMs;
	const endMs = Math.max(startMs + minDur, newEndMs);
	return { ...clip, endMs };
}

export function isClipActiveAt(clip: MediaClip, timeMs: number): boolean {
	return timeMs >= clip.startMs && timeMs < clip.endMs;
}

/** Active CapCut-style transition: straddles the cut of a clip with `transitionOut`. */
export interface MediaTransitionPlayback {
	from: MediaClip;
	to: MediaClip | null;
	trackId: string;
	type: string;
	/** 0 at transition start → 1 at end of transition */
	progress: number;
	durationMs: number;
	windowStartMs: number;
	windowEndMs: number;
}

function findNextClipAfter(
	tracks: MediaTrack[],
	from: MediaClip,
	sameTrackFirst: MediaTrack
): MediaClip | null {
	const sortedSame = [...sameTrackFirst.clips]
		.filter((c) => c.id !== from.id)
		.sort((a, b) => a.startMs - b.startMs);
	const onTrack =
		sortedSame.find((c) => c.startMs >= from.endMs - 80) ??
		sortedSame.find((c) => c.startMs > from.startMs) ??
		null;
	if (onTrack) return onTrack;

	// Components often live one-per-track: pick the next clip in time on any video track
	const candidates: MediaClip[] = [];
	for (const t of tracks) {
		if (t.kind === 'audio' || (t.muted && !t.solo)) continue;
		for (const c of t.clips) {
			if (c.id === from.id) continue;
			if (c.startMs >= from.endMs - 80) candidates.push(c);
		}
	}
	candidates.sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);
	return candidates[0] ?? null;
}

export function findTransitionAt(
	tracks: MediaTrack[],
	timeMs: number
): MediaTransitionPlayback | null {
	let best: MediaTransitionPlayback | null = null;

	for (const track of tracks) {
		if (track.muted && !track.solo) continue;
		for (const from of track.clips) {
			const tr = from.transitionOut;
			if (!tr?.type || !(tr.durationMs > 0)) continue;

			const dur = Math.min(tr.durationMs, Math.max(120, from.endMs - from.startMs));
			const to = findNextClipAfter(tracks, from, track);
			// CapCut-like: transition starts before the cut and can bleed slightly into the next clip
			const windowStartMs = from.endMs - dur;
			const windowEndMs = to
				? Math.min(to.endMs, from.endMs + Math.round(dur * 0.35))
				: from.endMs;
			if (timeMs < windowStartMs || timeMs >= windowEndMs) continue;

			const progress = Math.min(1, Math.max(0, (timeMs - windowStartMs) / dur));
			const candidate: MediaTransitionPlayback = {
				from,
				to,
				trackId: track.id,
				type: tr.type,
				progress,
				durationMs: dur,
				windowStartMs,
				windowEndMs
			};
			// Prefer the transition closest to its cut / highest progress still running
			if (!best || candidate.windowStartMs > best.windowStartMs) best = candidate;
		}
	}
	return best;
}

/** Geometry for overflow-based wipes (reliable vs clip-path). */
export interface TransitionWipeBox {
	box: { left: string; top: string; width: string; height: string };
	content: { left: string; top: string; width: string; height: string };
}

export interface TransitionLayerStyle {
	opacity: number;
	transform: string;
	clipPath?: string;
	filter?: string;
	transformOrigin?: string;
	/** CSS mask-image (and -webkit-mask-image) */
	maskImage?: string;
	/** Prefer this for hard directional wipes */
	wipe?: TransitionWipeBox;
}

function pct(n: number): string {
	return `${Math.round(Math.min(1, Math.max(0, n)) * 1000) / 10}%`;
}

/** Percent that may exceed 0–100 (wipe content sizing / offsets). */
function pctAny(n: number): string {
	return `${Math.round(n * 1000) / 10}%`;
}

function hardWipe(
	axis: 'x' | 'y',
	/** from which edge the outgoing shrinks / incoming grows */
	fromStart: boolean,
	role: 'from' | 'to',
	progress: number
): TransitionWipeBox {
	const p = Math.min(1, Math.max(0, progress));
	const inv = 1 - p;
	const eps = 0.002;

	if (axis === 'x') {
		if (role === 'from') {
			if (fromStart) {
				// wipe-left: keep left portion
				const w = Math.max(inv, eps);
				return {
					box: { left: '0%', top: '0%', width: pct(w), height: '100%' },
					content: { left: '0%', top: '0%', width: pctAny(1 / w), height: '100%' }
				};
			}
			// wipe-right: keep right portion
			const w = Math.max(inv, eps);
			return {
				box: { left: pct(p), top: '0%', width: pct(w), height: '100%' },
				content: { left: pctAny(-p / w), top: '0%', width: pctAny(1 / w), height: '100%' }
			};
		}
		if (fromStart) {
			// wipe-left to: reveal from right
			const w = Math.max(p, eps);
			return {
				box: { left: pct(inv), top: '0%', width: pct(w), height: '100%' },
				content: { left: pctAny(-inv / w), top: '0%', width: pctAny(1 / w), height: '100%' }
			};
		}
		// wipe-right to: reveal from left
		const w = Math.max(p, eps);
		return {
			box: { left: '0%', top: '0%', width: pct(w), height: '100%' },
			content: { left: '0%', top: '0%', width: pctAny(1 / w), height: '100%' }
		};
	}

	// y axis
	if (role === 'from') {
		if (fromStart) {
			// wipe-up: keep top portion
			const h = Math.max(inv, eps);
			return {
				box: { left: '0%', top: '0%', width: '100%', height: pct(h) },
				content: { left: '0%', top: '0%', width: '100%', height: pctAny(1 / h) }
			};
		}
		// wipe-down: keep bottom portion
		const h = Math.max(inv, eps);
		return {
			box: { left: '0%', top: pct(p), width: '100%', height: pct(h) },
			content: { left: '0%', top: pctAny(-p / h), width: '100%', height: pctAny(1 / h) }
		};
	}
	if (fromStart) {
		// wipe-up to: reveal from bottom
		const h = Math.max(p, eps);
		return {
			box: { left: '0%', top: pct(inv), width: '100%', height: pct(h) },
			content: { left: '0%', top: pctAny(-inv / h), width: '100%', height: pctAny(1 / h) }
		};
	}
	// wipe-down to: reveal from top
	const h = Math.max(p, eps);
	return {
		box: { left: '0%', top: '0%', width: '100%', height: pct(h) },
		content: { left: '0%', top: '0%', width: '100%', height: pctAny(1 / h) }
	};
}

/** CSS bits for outgoing / incoming layers during a transition. */
export function transitionLayerStyle(
	role: 'from' | 'to',
	type: string,
	progress: number
): TransitionLayerStyle {
	const p = Math.min(1, Math.max(0, progress));
	const inv = 1 - p;
	const slide = 110;

	if (type === 'crossfade' || type === 'fade-soft') {
		return {
			opacity: role === 'from' ? inv : p,
			transform: role === 'from' ? `scale(${1 - p * 0.04})` : `scale(${0.96 + p * 0.04})`
		};
	}

	if (type === 'blur') {
		return {
			opacity: role === 'from' ? inv : p,
			transform: `scale(${role === 'from' ? 1 + p * 0.12 : 1.12 - p * 0.12})`,
			filter: `blur(${(role === 'from' ? p : inv) * 12}px)`
		};
	}

	if (type === 'dip-black' || type === 'dip-white' || type === 'flash') {
		if (role === 'from') return { opacity: p < 0.55 ? 1 - p / 0.55 : 0, transform: 'none' };
		return { opacity: p > 0.45 ? (p - 0.45) / 0.55 : 0, transform: 'none' };
	}

	if (type === 'zoom' || type === 'zoom-in') {
		if (role === 'from') return { opacity: inv, transform: `scale(${1 + p * 0.55})` };
		return { opacity: p, transform: `scale(${1.55 - p * 0.55})` };
	}

	if (type === 'zoom-out') {
		if (role === 'from') return { opacity: inv, transform: `scale(${1 - p * 0.45})` };
		return { opacity: p, transform: `scale(${0.55 + p * 0.45})` };
	}

	if (type === 'wipe-left') {
		return { opacity: 1, transform: 'none', wipe: hardWipe('x', true, role, p) };
	}
	if (type === 'wipe-right') {
		return { opacity: 1, transform: 'none', wipe: hardWipe('x', false, role, p) };
	}
	if (type === 'wipe-up') {
		return { opacity: 1, transform: 'none', wipe: hardWipe('y', true, role, p) };
	}
	if (type === 'wipe-down') {
		return { opacity: 1, transform: 'none', wipe: hardWipe('y', false, role, p) };
	}

	if (type === 'wipe-diagonal') {
		const edge = Math.min(100, Math.max(0, inv * 100));
		if (role === 'from') {
			return {
				opacity: 1,
				transform: 'none',
				maskImage: `linear-gradient(135deg, #000 ${edge}%, transparent ${edge}%)`
			};
		}
		return {
			opacity: 1,
			transform: 'none',
			maskImage: `linear-gradient(135deg, transparent ${edge}%, #000 ${edge}%)`
		};
	}

	if (type === 'iris' || type === 'circle') {
		const r = role === 'from' ? inv * 70 : p * 70;
		return {
			opacity: 1,
			transform: 'none',
			maskImage: `radial-gradient(circle at 50% 50%, #000 ${r}%, transparent ${r + 0.5}%)`
		};
	}

	if (type === 'barn-doors') {
		const side = inv * 50;
		if (role === 'from') {
			return {
				opacity: 1,
				transform: 'none',
				maskImage: `linear-gradient(to right, #000 ${side}%, transparent ${side}%, transparent ${100 - side}%, #000 ${100 - side}%)`
			};
		}
		return { opacity: p, transform: 'none' };
	}

	if (type === 'push-left' || type === 'slide-left') {
		if (role === 'from') return { opacity: 1, transform: `translateX(${-p * slide}%)` };
		return { opacity: 1, transform: `translateX(${inv * slide}%)` };
	}
	if (type === 'push-right' || type === 'slide-right') {
		if (role === 'from') return { opacity: 1, transform: `translateX(${p * slide}%)` };
		return { opacity: 1, transform: `translateX(${-inv * slide}%)` };
	}
	if (type === 'push-up' || type === 'slide-up') {
		if (role === 'from') return { opacity: 1, transform: `translateY(${-p * slide}%)` };
		return { opacity: 1, transform: `translateY(${inv * slide}%)` };
	}
	if (type === 'push-down' || type === 'slide-down') {
		if (role === 'from') return { opacity: 1, transform: `translateY(${p * slide}%)` };
		return { opacity: 1, transform: `translateY(${-inv * slide}%)` };
	}

	if (type === 'rotate' || type === 'spin') {
		if (role === 'from') {
			return { opacity: inv, transform: `rotate(${p * -48}deg) scale(${1 - p * 0.25})` };
		}
		return { opacity: p, transform: `rotate(${inv * 48}deg) scale(${0.75 + p * 0.25})` };
	}

	if (type === 'flip-x') {
		if (role === 'from') {
			return {
				opacity: p < 0.5 ? 1 : 0,
				transform: `perspective(900px) rotateY(${p * 180}deg)`,
				transformOrigin: 'center'
			};
		}
		return {
			opacity: p >= 0.5 ? 1 : 0,
			transform: `perspective(900px) rotateY(${(1 - p) * -180}deg)`,
			transformOrigin: 'center'
		};
	}
	if (type === 'flip-y') {
		if (role === 'from') {
			return {
				opacity: p < 0.5 ? 1 : 0,
				transform: `perspective(900px) rotateX(${p * 180}deg)`,
				transformOrigin: 'center'
			};
		}
		return {
			opacity: p >= 0.5 ? 1 : 0,
			transform: `perspective(900px) rotateX(${(1 - p) * -180}deg)`,
			transformOrigin: 'center'
		};
	}

	if (type === 'squeeze-h') {
		if (role === 'from') {
			return {
				opacity: 1,
				transform: `scaleX(${Math.max(0.02, inv)})`,
				transformOrigin: 'center'
			};
		}
		return {
			opacity: 1,
			transform: `scaleX(${Math.max(0.02, p)})`,
			transformOrigin: 'center'
		};
	}
	if (type === 'squeeze-v') {
		if (role === 'from') {
			return {
				opacity: 1,
				transform: `scaleY(${Math.max(0.02, inv)})`,
				transformOrigin: 'center'
			};
		}
		return {
			opacity: 1,
			transform: `scaleY(${Math.max(0.02, p)})`,
			transformOrigin: 'center'
		};
	}

	return {
		opacity: role === 'from' ? inv : p,
		transform: role === 'from' ? `translateY(${-p * 20}%)` : `translateY(${inv * 20}%)`
	};
}

export function transitionDipOverlay(
	type: string,
	progress: number
): { color: string; opacity: number } | null {
	const p = Math.min(1, Math.max(0, progress));
	if (type === 'dip-black') {
		return { color: '#000', opacity: p < 0.5 ? p * 2 : (1 - p) * 2 };
	}
	if (type === 'dip-white' || type === 'flash') {
		const peak = type === 'flash' ? 0.95 : 1;
		return { color: '#fff', opacity: (p < 0.5 ? p * 2 : (1 - p) * 2) * peak };
	}
	return null;
}

export function findClipAt(
	tracks: MediaTrack[],
	timeMs: number,
	kind?: MediaTrackKind
): MediaClip | null {
	const list = kind ? tracks.filter((t) => t.kind === kind) : tracks;
	for (const track of [...list].reverse()) {
		if (track.muted && !track.solo) continue;
		for (const clip of track.clips) {
			if (isClipActiveAt(clip, timeMs)) return clip;
		}
	}
	return null;
}

export function findClipById(tracks: MediaTrack[], clipId: string): MediaClip | null {
	for (const t of tracks) {
		const c = t.clips.find((x) => x.id === clipId);
		if (c) return c;
	}
	return null;
}

export function updateClipInTracks(
	tracks: MediaTrack[],
	clipId: string,
	updater: (c: MediaClip) => MediaClip
): MediaTrack[] {
	return tracks.map((t) => ({
		...t,
		clips: t.clips.map((c) => (c.id === clipId ? updater(c) : c))
	}));
}

export function removeClipFromTracks(tracks: MediaTrack[], clipId: string): MediaTrack[] {
	return tracks.map((t) => ({
		...t,
		clips: t.clips.filter((c) => c.id !== clipId)
	}));
}

export function removeClipsFromTracks(tracks: MediaTrack[], clipIds: string[]): MediaTrack[] {
	const set = new Set(clipIds);
	return tracks.map((t) => ({
		...t,
		clips: t.clips.filter((c) => !set.has(c.id))
	}));
}

/** Split a clip at timeMs; returns updated tracks (no-op if playhead not inside clip). */
export function splitClipAt(
	tracks: MediaTrack[],
	clipId: string,
	timeMs: number,
	minDur = 50
): MediaTrack[] {
	return tracks.map((t) => ({
		...t,
		clips: t.clips.flatMap((c) => {
			if (c.id !== clipId) return [c];
			if (timeMs <= c.startMs + minDur || timeMs >= c.endMs - minDur) return [c];
			const leftDur = timeMs - c.startMs;
			const left: MediaClip = {
				...c,
				endMs: timeMs,
				trimOutMs: c.trimOutMs
			};
			const right: MediaClip = {
				...c,
				id: uid('clip'),
				startMs: timeMs,
				trimInMs: (c.trimInMs ?? 0) + leftDur
			};
			return [left, right];
		})
	}));
}

/** Split every selected clip that contains timeMs. */
export function splitClipsAt(
	tracks: MediaTrack[],
	clipIds: string[],
	timeMs: number,
	minDur = 50
): MediaTrack[] {
	let next = tracks;
	for (const id of clipIds) {
		next = splitClipAt(next, id, timeMs, minDur);
	}
	return next;
}

export function duplicateClipInTracks(tracks: MediaTrack[], clipId: string): MediaTrack[] {
	return tracks.map((t) => {
		const idx = t.clips.findIndex((c) => c.id === clipId);
		if (idx < 0) return t;
		const src = t.clips[idx];
		const copy = createMediaClip({
			...src,
			id: uid('clip'),
			name: `${src.name} copy`,
			startMs: src.endMs,
			endMs: src.endMs + clipDurationMs(src)
		});
		const clips = [...t.clips];
		clips.splice(idx + 1, 0, copy);
		return { ...t, clips };
	});
}

/**
 * Merge 2+ clips of the same kind into one spanning earliest start → latest end.
 * Clips may live on different tracks; the result is placed on the earliest clip's track.
 * Returns null if merge is not possible.
 */
export function canMergeMediaClips(tracks: MediaTrack[], clipIds: string[]): boolean {
	if (clipIds.length < 2) return false;
	const idSet = new Set(clipIds);
	const found: MediaClip[] = [];
	for (const t of tracks) {
		for (const c of t.clips) {
			if (idSet.has(c.id)) found.push(c);
		}
	}
	if (found.length < 2) return false;
	const kind = found[0].kind;
	return found.every((c) => c.kind === kind);
}

export function mergeClipsInTracks(
	tracks: MediaTrack[],
	clipIds: string[]
): MediaTrack[] | null {
	if (!canMergeMediaClips(tracks, clipIds)) return null;
	const idSet = new Set(clipIds);
	const found: { clip: MediaClip; trackId: string }[] = [];
	for (const t of tracks) {
		for (const c of t.clips) {
			if (idSet.has(c.id)) found.push({ clip: c, trackId: t.id });
		}
	}
	const sorted = [...found].sort((a, b) => a.clip.startMs - b.clip.startMs);
	const targetTrackId = sorted[0].trackId;
	const first = sorted[0].clip;
	const last = sorted[sorted.length - 1].clip;
	const merged = createMediaClip({
		...first,
		id: uid('clip'),
		trackId: targetTrackId,
		name: first.name,
		startMs: first.startMs,
		endMs: Math.max(last.endMs, first.endMs),
		text: first.text,
		src: first.src,
		assetId: first.assetId
	});
	return tracks.map((t) => {
		const rest = t.clips.filter((c) => !idSet.has(c.id));
		if (t.id !== targetTrackId) return { ...t, clips: rest };
		return { ...t, clips: [...rest, merged].sort((a, b) => a.startMs - b.startMs) };
	});
}

/** Shift one or more clips in time by the same delta (clamped so none go before 0). */
export function moveClipsByDelta(
	tracks: MediaTrack[],
	clipIds: string[],
	deltaMs: number
): MediaTrack[] {
	if (!clipIds.length || deltaMs === 0) return tracks;
	const set = new Set(clipIds);
	let minStart = Infinity;
	for (const t of tracks) {
		for (const c of t.clips) {
			if (set.has(c.id)) minStart = Math.min(minStart, c.startMs);
		}
	}
	if (!Number.isFinite(minStart)) return tracks;
	const d = minStart + deltaMs < 0 ? -minStart : deltaMs;
	if (d === 0) return tracks;
	return tracks.map((t) => ({
		...t,
		clips: t.clips.map((c) => (set.has(c.id) ? moveClip(c, c.startMs + d) : c))
	}));
}

export function nextTrackName(tracks: MediaTrack[], kind: MediaTrackKind): string {
	const prefix = kind === 'audio' ? 'A' : 'V';
	const n = tracks.filter((t) => t.kind === kind || (kind === 'video' && t.kind === 'image')).length + 1;
	return `${prefix}${n}`;
}

/** Reorder tracks by id list (ids not listed keep relative order at the end). */
export function reorderTracks(tracks: MediaTrack[], orderedIds: string[]): MediaTrack[] {
	const map = new Map(tracks.map((t) => [t.id, t]));
	const next: MediaTrack[] = [];
	for (const id of orderedIds) {
		const t = map.get(id);
		if (t) {
			next.push(t);
			map.delete(id);
		}
	}
	for (const t of map.values()) next.push(t);
	return next;
}

/** Move a track from one index to another. */
export function moveTrack(tracks: MediaTrack[], fromIndex: number, toIndex: number): MediaTrack[] {
	if (fromIndex < 0 || fromIndex >= tracks.length) return tracks;
	if (toIndex < 0 || toIndex >= tracks.length) return tracks;
	if (fromIndex === toIndex) return tracks;
	const next = [...tracks];
	const [item] = next.splice(fromIndex, 1);
	next.splice(toIndex, 0, item);
	return next;
}

export function removeTrack(tracks: MediaTrack[], trackId: string): MediaTrack[] {
	return tracks.filter((t) => t.id !== trackId);
}

export function removeTracks(tracks: MediaTrack[], trackIds: string[]): MediaTrack[] {
	const set = new Set(trackIds);
	return tracks.filter((t) => !set.has(t.id));
}

/** Defaults for inspector reset (Unreal-style). */
export const MEDIA_CLIP_DEFAULTS = {
	opacity: 1,
	previewOpacity: 1,
	volume: 1,
	fontSize: 18,
	fontWeight: 600 as number | string,
	textAlign: 'center' as const,
	textColor: '#ffffff',
	color: '#3b82f6',
	trimInMs: 0,
	trimOutMs: undefined as number | undefined
};

export type MediaClipRectAxis = 'x' | 'y' | 'w' | 'h';
export type MediaClipResettableField =
	| keyof typeof MEDIA_CLIP_DEFAULTS
	| 'rect'
	| `rect.${MediaClipRectAxis}`;

/** Default rect used by inspector reset (must stay in sync with `resetMediaClipField`). */
export function defaultMediaClipRect(
	clip: MediaClip,
	frame: { width: number; height: number }
): MediaClipRect {
	const preset =
		clip.kind === 'text' ? 'center' : clip.kind === 'image' && !clip.src ? 'full' : 'full';
	return defaultOverlayRect(frame, preset);
}

function rectsEqual(a: MediaClipRect, b: MediaClipRect): boolean {
	return (
		Math.round(a.x) === Math.round(b.x) &&
		Math.round(a.y) === Math.round(b.y) &&
		Math.round(a.w) === Math.round(b.w) &&
		Math.round(a.h) === Math.round(b.h)
	);
}

function parseRectAxis(field: MediaClipResettableField): MediaClipRectAxis | null {
	if (field === 'rect.x' || field === 'rect.y' || field === 'rect.w' || field === 'rect.h') {
		return field.slice(5) as MediaClipRectAxis;
	}
	return null;
}

export function isMediaClipFieldModified(
	clip: MediaClip,
	field: MediaClipResettableField,
	frame?: { width: number; height: number }
): boolean {
	const axis = parseRectAxis(field);
	if (field === 'rect' || axis) {
		if (!frame) return clip.rect != null;
		const current = resolveClipRect(clip, frame);
		const def = defaultMediaClipRect(clip, frame);
		if (axis) return Math.round(current[axis]) !== Math.round(def[axis]);
		return !rectsEqual(current, def);
	}
	const def = MEDIA_CLIP_DEFAULTS[field];
	const cur = clip[field];
	if (cur === undefined || cur === null) return false;
	if (field === 'fontWeight') return Number(cur) !== Number(def);
	return cur !== def;
}

export function resetMediaClipField(
	clip: MediaClip,
	field: MediaClipResettableField,
	frame?: { width: number; height: number }
): MediaClip {
	const axis = parseRectAxis(field);
	if (field === 'rect' || axis) {
		if (!frame) {
			const { rect: _r, ...rest } = clip;
			return rest;
		}
		const def = defaultMediaClipRect(clip, frame);
		if (!axis) return { ...clip, rect: def };
		const current = resolveClipRect(clip, frame);
		return {
			...clip,
			rect: {
				...current,
				[axis]: axis === 'w' || axis === 'h' ? Math.max(1, def[axis]) : def[axis]
			}
		};
	}
	if (field === 'trimOutMs') {
		const { trimOutMs: _t, ...rest } = clip;
		return rest;
	}
	return { ...clip, [field]: MEDIA_CLIP_DEFAULTS[field] };
}

/** Effective program-monitor opacity (ignores timeline clip opacity). */
export function resolvePreviewOpacity(clip: MediaClip): number {
	return clip.previewOpacity ?? 1;
}

/** Effective timeline block opacity. */
export function resolveClipOpacity(clip: MediaClip): number {
	return clip.opacity ?? 1;
}

export function createMediaAsset(
	partial: Omit<MediaAsset, 'id'> & { id?: string }
): MediaAsset {
	return {
		id: partial.id ?? uid('asset'),
		kind: partial.kind,
		name: partial.name,
		src: partial.src,
		durationMs: partial.durationMs,
		width: partial.width,
		height: partial.height
	};
}

export function kindFromFile(file: File): MediaAssetKind {
	if (file.type.startsWith('image/')) return 'image';
	if (file.type.startsWith('video/')) return 'video';
	if (file.type.startsWith('audio/')) return 'audio';
	return 'text';
}

/** Probe width/height/duration from a local media URL. */
export function probeMediaSrc(
	src: string,
	kind: MediaAssetKind
): Promise<Pick<MediaAsset, 'width' | 'height' | 'durationMs'>> {
	return new Promise((resolve) => {
		if (kind === 'image') {
			const img = new Image();
			img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
			img.onerror = () => resolve({});
			img.src = src;
			return;
		}
		if (kind !== 'video' && kind !== 'audio') {
			resolve({});
			return;
		}
		const el = document.createElement(kind === 'audio' ? 'audio' : 'video');
		el.preload = 'metadata';
		el.onloadedmetadata = () => {
			const durationMs = Number.isFinite(el.duration)
				? Math.round(el.duration * 1000)
				: undefined;
			const width =
				kind === 'video' && 'videoWidth' in el
					? (el as HTMLVideoElement).videoWidth || undefined
					: undefined;
			const height =
				kind === 'video' && 'videoHeight' in el
					? (el as HTMLVideoElement).videoHeight || undefined
					: undefined;
			resolve({ durationMs, width, height });
		};
		el.onerror = () => resolve({});
		el.src = src;
	});
}
