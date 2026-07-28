<script lang="ts">
	import EditorShell from '$lib/components/organisms/EditorShell/EditorShell.svelte';
	import MediaAssetBrowser from '$lib/components/molecules/MediaAssetBrowser/MediaAssetBrowser.svelte';
	import ProgramMonitor from '$lib/components/molecules/ProgramMonitor/ProgramMonitor.svelte';
	import TransportControls from '$lib/components/molecules/TransportControls/TransportControls.svelte';
	import MediaTimeline from '$lib/components/molecules/MediaTimeline/MediaTimeline.svelte';
	import PropertyGroup from '$lib/components/molecules/PropertyGroup/PropertyGroup.svelte';
	import PropertyField from '$lib/components/molecules/PropertyField/PropertyField.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
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
		emptyVideoSequence,
		type VideoSequence
	} from '$lib/utils/videoSequence.js';
	import { clampMs } from '$lib/utils/mediaTime.js';
	import Download from '@lucide/svelte/icons/download';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import PanelRight from '@lucide/svelte/icons/panel-right';

	interface VideoEditorProps {
		value?: VideoSequence;
		class?: string;
		onchange?: (seq: VideoSequence) => void;
		onexport?: (payload: { format: 'json'; document: VideoSequence }) => void;
	}

	let {
		value = $bindable(emptyVideoSequence()),
		class: className = '',
		onchange,
		onexport
	}: VideoEditorProps = $props();

	let selectedClipId = $state<string | null>(null);
	let currentTimeMs = $state(0);
	let playing = $state(false);
	let zoom = $state(1);
	let showSidebar = $state(true);
	let showInspector = $state(true);
	let raf = 0;
	let lastTs = 0;

	const selectedClip = $derived.by(() => {
		for (const t of value.tracks) {
			const c = t.clips.find((x) => x.id === selectedClipId);
			if (c) return c;
		}
		return null;
	});

	function emit(next: VideoSequence) {
		value = next;
		onchange?.(next);
	}

	function setTracks(tracks: MediaTrack[]) {
		emit({ ...value, tracks });
	}

	function addAssetAsClip(asset: MediaAsset) {
		const trackKind = asset.kind === 'audio' ? 'audio' : 'video';
		const track =
			value.tracks.find((t) => t.kind === trackKind) ??
			value.tracks.find((t) => t.kind === 'video') ??
			value.tracks[0];
		if (!track) return;
		const startMs = currentTimeMs;
		const dur = asset.durationMs ?? (asset.kind === 'audio' ? 8000 : 5000);
		const clip = createMediaClip({
			trackId: track.id,
			assetId: asset.id,
			name: asset.name,
			kind: asset.kind,
			src: asset.src,
			startMs,
			endMs: startMs + dur,
			color: track.color ?? (trackKind === 'audio' ? '#10b981' : '#3b82f6')
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
		setTracks(value.tracks.map((t) => (t.id === track.id ? track : t)));
	}

	function tick(ts: number) {
		if (!playing) return;
		if (lastTs) {
			const delta = ts - lastTs;
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
		a.download = 'video-sequence.json';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class={['flex h-full min-h-[560px] flex-col', className]}>
	<div class="flex items-center gap-2 border-b border-border bg-surface-elevated px-3 py-2">
		<span class="text-sm font-semibold text-primary">Video Editor</span>
		<div class="ml-auto flex items-center gap-1">
			<IconButton label="Toggle sidebar" size="sm" onclick={() => (showSidebar = !showSidebar)}>
				<PanelLeft class="h-4 w-4" />
			</IconButton>
			<IconButton
				label="Toggle inspector"
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
			sidebarTitle="Media"
			inspectorTitle="Clip"
			workspaceTitle="Program"
			bottomTitle="Timeline"
			showBottom={true}
			{showSidebar}
			{showInspector}
			wrapSidebar={true}
			wrapInspector={true}
			wrapWorkspace={false}
			wrapBottom={false}
			sidebarSize={280}
			inspectorSize={260}
			bottomSize={220}
			sizeUnit="px"
			fullHeight
		>
			{#snippet sidebar()}
				<MediaAssetBrowser
					assets={value.assets}
					accept="image/*,video/*,audio/*"
					helperText="Image, video or audio"
					onassetschange={(assets) => emit({ ...value, assets })}
					onselect={(id) => {
						const asset = value.assets.find((a) => a.id === id);
						if (asset) addAssetAsClip(asset);
					}}
					onadd={(asset) => {
						emit({ ...value, assets: [...value.assets, asset] });
					}}
				/>
			{/snippet}

			{#snippet workspace()}
				<div class="flex h-full flex-col gap-2 bg-surface p-3">
					<TransportControls
						{playing}
						{currentTimeMs}
						durationMs={value.durationMs}
						onplay={() => (playing = true)}
						onpause={() => (playing = false)}
						onstop={() => {
							playing = false;
							currentTimeMs = 0;
						}}
					/>
					<div class="min-h-0 flex-1">
						<ProgramMonitor
							width={value.width}
							height={value.height}
							background={value.background}
							{currentTimeMs}
							tracks={value.tracks}
							class="mx-auto max-h-full"
						/>
					</div>
				</div>
			{/snippet}

			{#snippet inspector()}
				{#if !selectedClip}
					<p class="px-3 py-6 text-center text-xs text-muted">Select a clip</p>
				{:else}
					<PropertyGroup title="Clip">
						<PropertyField label="Name">
							<Input
								size="sm"
								value={selectedClip.name}
								oninput={(e) =>
									patchClip({
										...selectedClip,
										name: (e.currentTarget as HTMLInputElement).value
									})}
							/>
						</PropertyField>
						<PropertyField label="Start">
							<Input
								type="number"
								size="sm"
								value={String(Math.round(selectedClip.startMs))}
								oninput={(e) => {
									const startMs = Number((e.currentTarget as HTMLInputElement).value);
									const dur = selectedClip.endMs - selectedClip.startMs;
									patchClip({ ...selectedClip, startMs, endMs: startMs + dur });
								}}
							/>
						</PropertyField>
						<PropertyField label="End">
							<Input
								type="number"
								size="sm"
								value={String(Math.round(selectedClip.endMs))}
								oninput={(e) =>
									patchClip({
										...selectedClip,
										endMs: Number((e.currentTarget as HTMLInputElement).value)
									})}
							/>
						</PropertyField>
					</PropertyGroup>
				{/if}
			{/snippet}

			{#snippet bottom()}
				<div class="h-full p-1">
					<MediaTimeline
						tracks={value.tracks}
						durationMs={value.durationMs}
						bind:currentTimeMs
						bind:zoom
						{selectedClipId}
						onselectclip={(id) => (selectedClipId = id)}
						onchangeclip={patchClip}
						onchangetrack={patchTrack}
						headerVariant="video"
						onseek={(ms) => (currentTimeMs = ms)}
						class="h-full"
					/>
				</div>
			{/snippet}
		</EditorShell>
	</div>
</div>
