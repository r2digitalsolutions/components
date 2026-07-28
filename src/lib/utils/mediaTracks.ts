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
 * Merge 2+ clips on the same track into one spanning earliest start → latest end.
 * Requires same kind; returns null if merge is not possible.
 */
export function mergeClipsInTracks(
	tracks: MediaTrack[],
	clipIds: string[]
): MediaTrack[] | null {
	if (clipIds.length < 2) return null;
	const idSet = new Set(clipIds);
	const found: MediaClip[] = [];
	let trackId: string | null = null;
	for (const t of tracks) {
		for (const c of t.clips) {
			if (!idSet.has(c.id)) continue;
			if (trackId && c.trackId !== trackId) return null;
			trackId = c.trackId;
			found.push(c);
		}
	}
	if (found.length < 2 || !trackId) return null;
	const kind = found[0].kind;
	if (found.some((c) => c.kind !== kind)) return null;
	const sorted = [...found].sort((a, b) => a.startMs - b.startMs);
	const first = sorted[0];
	const last = sorted[sorted.length - 1];
	const merged = createMediaClip({
		...first,
		id: uid('clip'),
		name: first.name,
		startMs: first.startMs,
		endMs: last.endMs,
		text: first.text,
		src: first.src,
		assetId: first.assetId
	});
	return tracks.map((t) => {
		if (t.id !== trackId) return t;
		const rest = t.clips.filter((c) => !idSet.has(c.id));
		return { ...t, clips: [...rest, merged].sort((a, b) => a.startMs - b.startMs) };
	});
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

export type MediaClipResettableField = keyof typeof MEDIA_CLIP_DEFAULTS | 'rect';

export function isMediaClipFieldModified(
	clip: MediaClip,
	field: MediaClipResettableField
): boolean {
	if (field === 'rect') return clip.rect != null;
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
	if (field === 'rect') {
		if (!frame) {
			const { rect: _r, ...rest } = clip;
			return rest;
		}
		const preset =
			clip.kind === 'text' ? 'center' : clip.kind === 'image' && !clip.src ? 'full' : 'full';
		return { ...clip, rect: defaultOverlayRect(frame, preset) };
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
