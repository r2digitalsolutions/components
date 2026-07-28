import {
	createMediaTrack,
	uid,
	type MediaAsset,
	type MediaTrack
} from './mediaTracks.js';

export interface VideoSequence {
	version: 1;
	width: number;
	height: number;
	fps: number;
	durationMs: number;
	background: string;
	tracks: MediaTrack[];
	assets: MediaAsset[];
}

export function emptyVideoSequence(
	partial?: Partial<Omit<VideoSequence, 'version'>>
): VideoSequence {
	return {
		version: 1,
		width: partial?.width ?? 1280,
		height: partial?.height ?? 720,
		fps: partial?.fps ?? 30,
		durationMs: partial?.durationMs ?? 30_000,
		background: partial?.background ?? '#0a0a0a',
		tracks: partial?.tracks ?? [
			createMediaTrack({ name: 'V1', kind: 'video' }),
			createMediaTrack({ name: 'A1', kind: 'audio' })
		],
		assets: partial?.assets ?? []
	};
}

export function createDemoVideoSequence(): VideoSequence {
	const seq = emptyVideoSequence({ durationMs: 20_000 });
	const vTrack = seq.tracks[0];
	const aTrack = seq.tracks[1];
	return {
		...seq,
		tracks: [
			{
				...vTrack,
				clips: [
					{
						id: uid('clip'),
						trackId: vTrack.id,
						name: 'Title card',
						kind: 'image',
						startMs: 0,
						endMs: 4000,
						color: '#3b82f6'
					},
					{
						id: uid('clip'),
						trackId: vTrack.id,
						name: 'B-roll',
						kind: 'video',
						startMs: 4000,
						endMs: 12000,
						color: '#8b5cf6'
					}
				]
			},
			{
				...aTrack,
				clips: [
					{
						id: uid('clip'),
						trackId: aTrack.id,
						name: 'Voiceover',
						kind: 'audio',
						startMs: 1000,
						endMs: 14000,
						color: '#10b981'
					}
				]
			}
		]
	};
}
