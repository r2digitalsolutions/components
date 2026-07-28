/** Shared track/clip types and helpers for Video / Audio editors. */

export type MediaAssetKind = 'image' | 'video' | 'audio' | 'text';

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
		color: partial.color
	};
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
