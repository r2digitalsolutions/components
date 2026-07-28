import {
	createMediaTrack,
	uid,
	type MediaAsset,
	type MediaTrack
} from './mediaTracks.js';

export interface MixerChannelState {
	trackId: string;
	volume: number;
	pan: number;
	muted: boolean;
	solo: boolean;
}

export interface AudioProject {
	version: 1;
	sampleRate: number;
	bpm?: number;
	durationMs: number;
	tracks: MediaTrack[];
	assets: MediaAsset[];
	mixer: MixerChannelState[];
}

export function emptyAudioProject(
	partial?: Partial<Omit<AudioProject, 'version'>>
): AudioProject {
	const tracks =
		partial?.tracks ??
		[
			createMediaTrack({ name: 'Track 1', kind: 'audio', color: '#3b82f6' }),
			createMediaTrack({ name: 'Track 2', kind: 'audio', color: '#10b981' })
		];
	return {
		version: 1,
		sampleRate: partial?.sampleRate ?? 44100,
		bpm: partial?.bpm ?? 120,
		durationMs: partial?.durationMs ?? 60_000,
		tracks,
		assets: partial?.assets ?? [],
		mixer:
			partial?.mixer ??
			tracks.map((t) => ({
				trackId: t.id,
				volume: 0.8,
				pan: 0,
				muted: false,
				solo: false
			}))
	};
}

export function createDemoAudioProject(): AudioProject {
	const project = emptyAudioProject({ durationMs: 45_000 });
	const [t1, t2] = project.tracks;
	return {
		...project,
		tracks: [
			{
				...t1,
				clips: [
					{
						id: uid('clip'),
						trackId: t1.id,
						name: 'Drums',
						kind: 'audio',
						startMs: 0,
						endMs: 16000,
						color: t1.color
					},
					{
						id: uid('clip'),
						trackId: t1.id,
						name: 'Drums 2',
						kind: 'audio',
						startMs: 16000,
						endMs: 32000,
						color: t1.color
					}
				]
			},
			{
				...t2,
				clips: [
					{
						id: uid('clip'),
						trackId: t2.id,
						name: 'Bass',
						kind: 'audio',
						startMs: 2000,
						endMs: 30000,
						color: t2.color
					}
				]
			}
		]
	};
}
