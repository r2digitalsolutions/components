<script lang="ts">
	import EditorShell from '$lib/components/organisms/EditorShell/EditorShell.svelte';
	import MediaAssetBrowser from '$lib/components/molecules/MediaAssetBrowser/MediaAssetBrowser.svelte';
	import TransportControls from '$lib/components/molecules/TransportControls/TransportControls.svelte';
	import MediaTimeline from '$lib/components/molecules/MediaTimeline/MediaTimeline.svelte';
	import MixerChannel from '$lib/components/molecules/MixerChannel/MixerChannel.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import {
		createMediaClip,
		updateClipInTracks,
		removeClipFromTracks,
		type MediaAsset,
		type MediaClip,
		type MediaTrack
	} from '$lib/utils/mediaTracks.js';
	import {
		emptyAudioProject,
		type AudioProject,
		type MixerChannelState
	} from '$lib/utils/audioProject.js';
	import { clampMs } from '$lib/utils/mediaTime.js';
	import Download from '@lucide/svelte/icons/download';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import PanelRight from '@lucide/svelte/icons/panel-right';

	interface AudioEditorProps {
		value?: AudioProject;
		class?: string;
		onchange?: (project: AudioProject) => void;
		onexport?: (payload: { format: 'json'; document: AudioProject }) => void;
	}

	let {
		value = $bindable(emptyAudioProject()),
		class: className = '',
		onchange,
		onexport
	}: AudioEditorProps = $props();

	let selectedClipId = $state<string | null>(null);
	let currentTimeMs = $state(0);
	let playing = $state(false);
	let playbackRate = $state(1);
	let muted = $state(false);
	let volume = $state(1);
	const SKIP_MS = 5000;
	let zoom = $state(1);
	let showSidebar = $state(true);
	let showInspector = $state(true);
	let raf = 0;
	let lastTs = 0;

	function emit(next: AudioProject) {
		value = next;
		onchange?.(next);
	}

	function setTracks(tracks: MediaTrack[]) {
		emit({ ...value, tracks });
	}

	function addAssetAsClip(asset: MediaAsset) {
		if (asset.kind !== 'audio' && asset.kind !== 'video') return;
		const track = value.tracks[0];
		if (!track) return;
		const startMs = currentTimeMs;
		const dur = asset.durationMs ?? 8000;
		const clip = createMediaClip({
			trackId: track.id,
			assetId: asset.id,
			name: asset.name,
			kind: 'audio',
			src: asset.src,
			startMs,
			endMs: startMs + dur,
			color: track.color
		});
		const assets = value.assets.some((a) => a.id === asset.id)
			? value.assets
			: [...value.assets, asset];
		emit({
			...value,
			assets,
			tracks: value.tracks.map((t) =>
				t.id === track.id ? { ...t, clips: [...t.clips, clip] } : t
			)
		});
		selectedClipId = clip.id;
	}

	function patchClip(clip: MediaClip) {
		setTracks(updateClipInTracks(value.tracks, clip.id, () => clip));
	}

	function patchTrack(track: MediaTrack) {
		const mixer = value.mixer.map((m) =>
			m.trackId === track.id
				? { ...m, muted: !!track.muted, solo: !!track.solo }
				: m
		);
		emit({
			...value,
			tracks: value.tracks.map((t) => (t.id === track.id ? track : t)),
			mixer
		});
	}

	function patchMixer(channel: MixerChannelState) {
		emit({
			...value,
			mixer: value.mixer.map((m) => (m.trackId === channel.trackId ? channel : m)),
			tracks: value.tracks.map((t) =>
				t.id === channel.trackId
					? { ...t, muted: channel.muted, solo: channel.solo }
					: t
			)
		});
	}

	function seekBy(deltaMs: number) {
		currentTimeMs = clampMs(currentTimeMs + deltaMs, 0, value.durationMs);
	}

	function tick(ts: number) {
		if (!playing) return;
		if (lastTs) {
			const delta = (ts - lastTs) * playbackRate;
			currentTimeMs = clampMs(currentTimeMs + delta, 0, value.durationMs);
			if (currentTimeMs >= value.durationMs) {
				playing = false;
				currentTimeMs = value.durationMs;
			}
		}
		lastTs = ts;
		raf = requestAnimationFrame(tick);
	}

	$effect(() => {
		if (playing) {
			lastTs = 0;
			raf = requestAnimationFrame(tick);
			return () => cancelAnimationFrame(raf);
		}
		cancelAnimationFrame(raf);
	});

	function handleKeydown(e: KeyboardEvent) {
		const tag = (e.target as HTMLElement)?.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA') return;
		if (e.code === 'Space') {
			e.preventDefault();
			playing = !playing;
			return;
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			selectedClipId = null;
			return;
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			seekBy(e.shiftKey ? -SKIP_MS : -1000);
			return;
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			seekBy(e.shiftKey ? SKIP_MS : 1000);
			return;
		}
		if (e.key === 'Home') {
			e.preventDefault();
			currentTimeMs = 0;
			return;
		}
		if (e.key === 'End') {
			e.preventDefault();
			currentTimeMs = value.durationMs;
			return;
		}
		if (e.key === 'm' || e.key === 'M') {
			e.preventDefault();
			muted = !muted;
			return;
		}
		if ((e.key === 'Delete' || e.key === 'Backspace') && selectedClipId) {
			e.preventDefault();
			setTracks(removeClipFromTracks(value.tracks, selectedClipId));
			selectedClipId = null;
		}
	}

	function exportJson() {
		onexport?.({ format: 'json', document: value });
		const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'audio-project.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	const trackName = (trackId: string) =>
		value.tracks.find((t) => t.id === trackId)?.name ?? 'Track';
	const trackColor = (trackId: string) =>
		value.tracks.find((t) => t.id === trackId)?.color ?? '#3b82f6';
</script>

<svelte:window onkeydown={handleKeydown} />

<div class={['flex h-full min-h-[560px] flex-col', className]}>
	<div class="flex items-center gap-2 border-b border-border bg-surface-elevated px-3 py-2">
		<span class="text-sm font-semibold text-primary">Audio Editor</span>
		<span class="text-xs text-muted">{value.bpm ?? 120} BPM · {value.sampleRate / 1000}kHz</span>
		<div class="ml-auto flex items-center gap-1">
			<IconButton label="Toggle sidebar" size="sm" onclick={() => (showSidebar = !showSidebar)}>
				<PanelLeft class="h-4 w-4" />
			</IconButton>
			<IconButton
				label="Toggle mixer"
				size="sm"
				onclick={() => (showInspector = !showInspector)}
			>
				<PanelRight class="h-4 w-4" />
			</IconButton>
			<Button size="sm" variant="secondary" onclick={exportJson}>
				<span class="inline-flex items-center gap-1.5">
					<Download class="h-3.5 w-3.5" />
					Export JSON
				</span>
			</Button>
		</div>
	</div>

	<div class="min-h-0 flex-1">
		<EditorShell
			sidebarTitle="Library"
			inspectorTitle="Mixer"
			workspaceTitle="Arrange"
			showBottom={false}
			{showSidebar}
			{showInspector}
			wrapSidebar={true}
			wrapInspector={false}
			wrapWorkspace={false}
			sidebarSize={260}
			inspectorSize={320}
			sizeUnit="px"
			fullHeight
		>
			{#snippet sidebar()}
				<MediaAssetBrowser
					assets={value.assets}
					accept="audio/*"
					helperText="Audio files"
					onassetschange={(assets) => emit({ ...value, assets })}
					onselect={(id) => {
						const asset = value.assets.find((a) => a.id === id);
						if (asset) addAssetAsClip(asset);
					}}
					onadd={(asset) => emit({ ...value, assets: [...value.assets, asset] })}
				/>
			{/snippet}

			{#snippet workspace()}
				<div class="flex h-full flex-col gap-2 bg-surface p-2">
					<TransportControls
						{playing}
						{currentTimeMs}
						durationMs={value.durationMs}
						bind:playbackRate
						bind:muted
						bind:volume
						skipMs={SKIP_MS}
						onplay={() => (playing = true)}
						onpause={() => (playing = false)}
						onstop={() => {
							playing = false;
							currentTimeMs = 0;
						}}
						onseekstart={() => {
							currentTimeMs = 0;
						}}
						onseekend={() => {
							currentTimeMs = value.durationMs;
						}}
						onseekback={() => seekBy(-SKIP_MS)}
						onseekforward={() => seekBy(SKIP_MS)}
					/>
					<div class="min-h-0 flex-1">
						<MediaTimeline
							tracks={value.tracks}
							durationMs={value.durationMs}
							bind:currentTimeMs
							bind:zoom
							{selectedClipId}
							headerVariant="audio"
							onselectclip={(id) => (selectedClipId = id)}
							onemptyclick={() => (selectedClipId = null)}
							onchangeclip={patchClip}
							onchangetrack={patchTrack}
							onseek={(ms) => (currentTimeMs = ms)}
							class="h-full"
						/>
					</div>
				</div>
			{/snippet}

			{#snippet inspector()}
				<div class="flex h-full gap-2 overflow-x-auto p-3">
					{#each value.mixer as channel (channel.trackId)}
						<MixerChannel
							{channel}
							name={trackName(channel.trackId)}
							color={trackColor(channel.trackId)}
							onchange={patchMixer}
						/>
					{/each}
				</div>
			{/snippet}
		</EditorShell>
	</div>
</div>
