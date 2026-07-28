import {
	createMediaAsset,
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
	const titleAsset = createMediaAsset({
		id: uid('asset'),
		kind: 'text',
		name: 'Title card'
	});
	const brollAsset = createMediaAsset({
		id: uid('asset'),
		kind: 'image',
		name: 'B-roll',
		src: 'https://picsum.photos/seed/video-broll/1280/720',
		width: 1280,
		height: 720,
		durationMs: 8000
	});
	const voAsset = createMediaAsset({
		id: uid('asset'),
		kind: 'audio',
		name: 'Voiceover',
		src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
		durationMs: 13000
	});

	return {
		...seq,
		assets: [titleAsset, brollAsset, voAsset],
		tracks: [
			{
				...vTrack,
				clips: [
					{
						id: uid('clip'),
						trackId: vTrack.id,
						assetId: titleAsset.id,
						name: 'Title card',
						kind: 'text',
						text: 'Title card',
						startMs: 0,
						endMs: 4000,
						color: '#3b82f6',
						rect: { x: 192, y: 252, w: 896, h: 160 },
						animationIn: { type: 'fade', durationMs: 400 },
						animationOut: { type: 'fade', durationMs: 400 }
					},
					{
						id: uid('clip'),
						trackId: vTrack.id,
						assetId: brollAsset.id,
						name: 'B-roll',
						kind: 'image',
						src: brollAsset.src,
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
						assetId: voAsset.id,
						name: 'Voiceover',
						kind: 'audio',
						src: voAsset.src,
						startMs: 1000,
						endMs: 14000,
						color: '#10b981'
					}
				]
			}
		]
	};
}
