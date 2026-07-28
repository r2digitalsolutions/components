<script lang="ts">
	import EditorShell from '$lib/components/organisms/EditorShell/EditorShell.svelte';
	import MediaAssetBrowser from '$lib/components/molecules/MediaAssetBrowser/MediaAssetBrowser.svelte';
	import VideoComponentsPanel from '$lib/components/molecules/VideoComponentsPanel/VideoComponentsPanel.svelte';
	import VideoAnimationsPanel from '$lib/components/molecules/VideoAnimationsPanel/VideoAnimationsPanel.svelte';
	import VideoTransitionsPanel from '$lib/components/molecules/VideoTransitionsPanel/VideoTransitionsPanel.svelte';
	import ProgramMonitor from '$lib/components/molecules/ProgramMonitor/ProgramMonitor.svelte';
	import TransportControls from '$lib/components/molecules/TransportControls/TransportControls.svelte';
	import MediaTimeline from '$lib/components/molecules/MediaTimeline/MediaTimeline.svelte';
	import ContextMenu from '$lib/components/molecules/ContextMenu/ContextMenu.svelte';
	import type { ContextMenuItem } from '$lib/components/molecules/ContextMenu/ContextMenu.svelte';
	import BulkActionBar from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import type { BulkAction } from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import FileUploader from '$lib/components/organisms/FileUploader/FileUploader.svelte';
	import PropertyGroup from '$lib/components/molecules/PropertyGroup/PropertyGroup.svelte';
	import PropertyField from '$lib/components/molecules/PropertyField/PropertyField.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import NumberInput from '$lib/components/molecules/NumberInput/NumberInput.svelte';
	import ColorPicker from '$lib/components/molecules/ColorPicker/ColorPicker.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import {
		createMediaClip,
		createMediaTrack,
		updateClipInTracks,
		removeClipsFromTracks,
		splitClipsAt,
		mergeClipsInTracks,
		duplicateClipInTracks,
		findClipById,
		nextTrackName,
		reorderTracks,
		removeTrack,
		defaultOverlayRect,
		alignClipRect,
		resolveClipRect,
		isMediaClipFieldModified,
		resetMediaClipField,
		kindFromFile,
		probeMediaSrc,
		createMediaAsset,
		type MediaAsset,
		type MediaAssetKind,
		type MediaClip,
		type MediaClipAlign,
		type MediaClipResettableField,
		type MediaTrack,
		type MediaTrackKind
	} from '$lib/utils/mediaTracks.js';
	import { emptyVideoSequence, type VideoSequence } from '$lib/utils/videoSequence.js';
	import { clampMs } from '$lib/utils/mediaTime.js';
	import type { VideoComponentDef } from '$lib/components/molecules/VideoComponentsPanel/VideoComponentsPanel.svelte';
	import type { VideoAnimationDef } from '$lib/components/molecules/VideoAnimationsPanel/VideoAnimationsPanel.svelte';
	import type { VideoTransitionDef } from '$lib/components/molecules/VideoTransitionsPanel/VideoTransitionsPanel.svelte';
	import Tooltip from '$lib/components/atoms/Tooltip/Tooltip.svelte';
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';
	import Download from '@lucide/svelte/icons/download';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import PanelRight from '@lucide/svelte/icons/panel-right';
	import Scissors from '@lucide/svelte/icons/scissors';
	import Copy from '@lucide/svelte/icons/copy';
	import Combine from '@lucide/svelte/icons/combine';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import AlignStartVertical from '@lucide/svelte/icons/align-start-vertical';
	import AlignCenterVertical from '@lucide/svelte/icons/align-center-vertical';
	import AlignEndVertical from '@lucide/svelte/icons/align-end-vertical';
	import AlignStartHorizontal from '@lucide/svelte/icons/align-start-horizontal';
	import AlignCenterHorizontal from '@lucide/svelte/icons/align-center-horizontal';
	import AlignEndHorizontal from '@lucide/svelte/icons/align-end-horizontal';
	import AlignCenter from '@lucide/svelte/icons/align-center';
	import Maximize2 from '@lucide/svelte/icons/maximize-2';
	import type { Component } from 'svelte';

	type IconComp = Component<{ class?: string }>;

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

	let selectedClipIds = $state<string[]>([]);
	let currentTimeMs = $state(0);
	let playing = $state(false);
	let playbackRate = $state(1);
	let muted = $state(false);
	let volume = $state(1);
	let zoom = $state(1);
	let showSidebar = $state(true);
	let showInspector = $state(true);
	let sidebarTab = $state<'components' | 'animations' | 'transitions' | 'assets'>('assets');
	let ctxOpen = $state(false);
	let ctxAnchor = $state<{ x: number; y: number } | null>(null);
	let ctxTrackId = $state<string | null>(null);
	let raf = 0;
	let lastTs = 0;
	const SKIP_MS = 5000;

	const primaryClipId = $derived(selectedClipIds[selectedClipIds.length - 1] ?? null);
	const selectedClip = $derived(primaryClipId ? findClipById(value.tracks, primaryClipId) : null);
	const canMerge = $derived(selectedClipIds.length >= 2);
	const canSplit = $derived(
		!!selectedClip && (selectedClip.kind === 'video' || selectedClip.kind === 'audio')
	);
	const canBulkSplit = $derived(
		selectedClipIds.some((id) => {
			const c = findClipById(value.tracks, id);
			return !!c && (c.kind === 'video' || c.kind === 'audio');
		})
	);

	const bulkActions = $derived.by((): BulkAction[] => [
		{
			id: 'split',
			label: 'Split at playhead',
			icon: Scissors,
			variant: 'ghost',
			disabled: !canBulkSplit
		},
		{ id: 'merge', label: 'Merge', icon: Combine, variant: 'ghost', disabled: !canMerge },
		{ id: 'duplicate', label: 'Duplicate', icon: Copy, variant: 'ghost' },
		{
			id: 'delete',
			label: 'Delete',
			icon: Trash2,
			variant: 'destructive',
			confirm: true,
			confirmLabel: `Delete ${selectedClipIds.length}`
		}
	]);

	function handleBulk(id: string) {
		if (id === 'split') splitSelected();
		else if (id === 'merge') mergeSelected();
		else if (id === 'duplicate') duplicateSelected();
		else if (id === 'delete') deleteSelected();
	}

	const ctxItems = $derived.by((): ContextMenuItem[] => {
		const hasSel = selectedClipIds.length > 0;
		const canDeleteTrack = !!ctxTrackId && value.tracks.length > 1;
		return [
			{
				id: 'split',
				label: 'Split at playhead',
				shortcut: 'S',
				disabled: !canSplit,
				category: 'Edit'
			},
			{
				id: 'merge',
				label: 'Merge selected',
				disabled: !canMerge,
				category: 'Edit'
			},
			{
				id: 'duplicate',
				label: 'Duplicate',
				shortcut: '⌘D',
				disabled: !hasSel,
				category: 'Edit'
			},
			{ id: 'sep-1', label: '', separator: true },
			{
				id: 'add-clip',
				label: 'Add empty clip',
				category: 'Insert',
				disabled: !ctxTrackId && !hasSel
			},
			{ id: 'add-video-track', label: 'Add video track', category: 'Tracks' },
			{ id: 'add-audio-track', label: 'Add audio track', category: 'Tracks' },
			{
				id: 'delete-track',
				label: 'Delete track',
				destructive: true,
				disabled: !canDeleteTrack,
				category: 'Tracks'
			},
			{ id: 'sep-2', label: '', separator: true },
			{
				id: 'delete',
				label: selectedClipIds.length > 1 ? `Delete ${selectedClipIds.length} clips` : 'Delete',
				destructive: true,
				shortcut: '⌫',
				disabled: !hasSel,
				category: 'Edit'
			}
		];
	});

	const alignDock: { id: MediaClipAlign; label: string; icon: IconComp }[] = [
		{ id: 'left', label: 'Align left', icon: AlignStartVertical },
		{ id: 'center-h', label: 'Align center', icon: AlignCenterVertical },
		{ id: 'right', label: 'Align right', icon: AlignEndVertical },
		{ id: 'top', label: 'Align top', icon: AlignStartHorizontal },
		{ id: 'center-v', label: 'Align middle', icon: AlignCenterHorizontal },
		{ id: 'bottom', label: 'Align bottom', icon: AlignEndHorizontal },
		{ id: 'center', label: 'Center on frame', icon: AlignCenter },
		{ id: 'full', label: 'Fill frame', icon: Maximize2 }
	];

	const selectedRect = $derived(
		selectedClip
			? resolveClipRect(selectedClip, { width: value.width, height: value.height })
			: null
	);
	const showTransform = $derived(
		!!selectedClip &&
			selectedClip.kind !== 'audio' &&
			(selectedClip.kind === 'text' ||
				!!selectedClip.rect ||
				(selectedClip.kind === 'image' && !selectedClip.src))
	);

	function emit(next: VideoSequence) {
		value = next;
		onchange?.(next);
	}

	function setTracks(tracks: MediaTrack[]) {
		emit({ ...value, tracks });
	}

	function patchSequence(partial: Partial<VideoSequence>) {
		emit({ ...value, ...partial });
	}

	function selectClip(id: string, e?: MouseEvent) {
		const multi = e && (e.metaKey || e.ctrlKey || e.shiftKey);
		if (multi) {
			if (selectedClipIds.includes(id)) {
				selectedClipIds = selectedClipIds.filter((x) => x !== id);
			} else {
				selectedClipIds = [...selectedClipIds, id];
			}
		} else {
			selectedClipIds = [id];
		}
	}

	function openClipMenu(clipId: string, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!selectedClipIds.includes(clipId)) {
			selectedClipIds = [clipId];
		}
		ctxTrackId = findClipById(value.tracks, clipId)?.trackId ?? null;
		// Update anchor in place so an already-open menu retargets without flicker
		ctxAnchor = { x: e.clientX, y: e.clientY };
		ctxOpen = true;
	}

	function openTrackMenu(trackId: string, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		ctxTrackId = trackId;
		ctxAnchor = { x: e.clientX, y: e.clientY };
		ctxOpen = true;
	}

	function addAssetAsClip(asset: MediaAsset) {
		const trackKind: MediaTrackKind = asset.kind === 'audio' ? 'audio' : 'video';
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
			color: track.color ?? (trackKind === 'audio' ? '#10b981' : '#3b82f6'),
			text: asset.kind === 'text' ? asset.name : undefined
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
		selectedClipIds = [clip.id];
	}

	function addComponent(def: VideoComponentDef) {
		const track = value.tracks.find((t) => t.kind === 'video') ?? value.tracks[0];
		if (!track) return;
		const startMs = currentTimeMs;
		const kind: MediaAssetKind =
			def.kind === 'solid' ? 'image' : def.kind === 'image' ? 'image' : 'text';
		const frame = { width: value.width, height: value.height };
		const rect = defaultOverlayRect(frame, def.rectPreset ?? (kind === 'text' ? 'center' : 'full'));
		const clip = createMediaClip({
			trackId: track.id,
			name: def.label,
			kind,
			text: def.kind === 'text' ? def.text : undefined,
			src: def.src,
			startMs,
			endMs: startMs + def.durationMs,
			color: def.color ?? '#6366f1',
			textColor: def.textColor,
			fontSize: def.fontSize,
			fontWeight: def.fontWeight,
			fontFamily: def.fontFamily,
			textAlign: def.textAlign,
			opacity: 1,
			previewOpacity: def.previewOpacity ?? def.opacity,
			rect
		});
		setTracks(
			value.tracks.map((t) =>
				t.id === track.id ? { ...t, clips: [...t.clips, clip] } : t
			)
		);
		selectedClipIds = [clip.id];
	}

	function addEmptyClip(trackId?: string | null) {
		const track =
			(trackId && value.tracks.find((t) => t.id === trackId)) ||
			(selectedClip && value.tracks.find((t) => t.id === selectedClip.trackId)) ||
			value.tracks.find((t) => t.kind === 'video') ||
			value.tracks[0];
		if (!track) return;
		const startMs = currentTimeMs;
		const kind: MediaAssetKind = track.kind === 'audio' ? 'audio' : 'video';
		const clip = createMediaClip({
			trackId: track.id,
			name: 'New clip',
			kind,
			startMs,
			endMs: startMs + 3000,
			color: track.color ?? (kind === 'audio' ? '#10b981' : '#3b82f6')
		});
		setTracks(
			value.tracks.map((t) =>
				t.id === track.id ? { ...t, clips: [...t.clips, clip] } : t
			)
		);
		selectedClipIds = [clip.id];
	}

	function addTrack(kind: MediaTrackKind) {
		const name = nextTrackName(value.tracks, kind);
		const track = createMediaTrack({
			name,
			kind,
			color: kind === 'audio' ? '#10b981' : '#3b82f6'
		});
		setTracks([...value.tracks, track]);
	}

	function deleteTrack(trackId: string) {
		if (value.tracks.length <= 1) return;
		const track = value.tracks.find((t) => t.id === trackId);
		if (!track) return;
		const removedClipIds = new Set(track.clips.map((c) => c.id));
		setTracks(removeTrack(value.tracks, trackId));
		selectedClipIds = selectedClipIds.filter((id) => !removedClipIds.has(id));
		if (ctxTrackId === trackId) ctxTrackId = null;
	}

	function reorderTrackIds(orderedIds: string[]) {
		setTracks(reorderTracks(value.tracks, orderedIds));
	}

	function applyAlign(align: MediaClipAlign) {
		if (!selectedClipIds.length) return;
		const frame = { width: value.width, height: value.height };
		let tracks = value.tracks;
		for (const id of selectedClipIds) {
			tracks = updateClipInTracks(tracks, id, (c) => {
				if (c.kind === 'audio' || c.kind === 'video') {
					// Allow transform on overlays / text / solids; skip pure A/V full-frame
					if (!c.rect && c.kind === 'video') return c;
					if (!c.rect && c.kind === 'audio') return c;
				}
				return alignClipRect(c, frame, align);
			});
		}
		setTracks(tracks);
	}

	function patchSelectedRect(partial: Partial<{ x: number; y: number; w: number; h: number }>) {
		if (!selectedClip || !selectedRect) return;
		patchClip({
			...selectedClip,
			rect: {
				x: partial.x ?? selectedRect.x,
				y: partial.y ?? selectedRect.y,
				w: Math.max(1, partial.w ?? selectedRect.w),
				h: Math.max(1, partial.h ?? selectedRect.h)
			}
		});
	}

	function clipFieldModified(field: MediaClipResettableField): boolean {
		return !!selectedClip && isMediaClipFieldModified(selectedClip, field);
	}

	function resetClipField(field: MediaClipResettableField) {
		if (!selectedClip) return;
		patchClip(
			resetMediaClipField(selectedClip, field, {
				width: value.width,
				height: value.height
			})
		);
	}

	function acceptForClipKind(kind: MediaAssetKind): string {
		if (kind === 'audio') return 'audio/*';
		if (kind === 'image') return 'image/*';
		if (kind === 'video') return 'video/*';
		return 'image/*,video/*,audio/*';
	}

	async function replaceSelectedMedia(files: File[]) {
		const file = files[0];
		if (!file || !selectedClip) return;
		const kind = kindFromFile(file);
		if (kind === 'text') return;
		// Keep clip kind aligned with the track role when possible
		const nextKind: MediaAssetKind =
			selectedClip.kind === 'audio'
				? 'audio'
				: kind === 'audio'
					? selectedClip.kind
					: kind;
		if (selectedClip.kind === 'audio' && kind !== 'audio') return;
		if (selectedClip.kind !== 'audio' && kind === 'audio') return;

		const src = URL.createObjectURL(file);
		const meta = await probeMediaSrc(src, nextKind);
		const asset = createMediaAsset({
			kind: nextKind,
			name: file.name,
			src,
			...meta
		});
		const dur = meta.durationMs;
		const startMs = selectedClip.startMs;
		const endMs =
			dur != null
				? startMs + dur
				: selectedClip.endMs > startMs
					? selectedClip.endMs
					: startMs + 5000;

		emit({
			...value,
			assets: value.assets.some((a) => a.id === asset.id)
				? value.assets
				: [...value.assets, asset],
			tracks: updateClipInTracks(value.tracks, selectedClip.id, (c) => ({
				...c,
				assetId: asset.id,
				name: file.name,
				kind: nextKind,
				src,
				endMs
			}))
		});
	}

	function clearSelectedMedia() {
		if (!selectedClip) return;
		patchClip({
			...selectedClip,
			src: undefined,
			assetId: undefined
		});
	}

	function applyAnimation(def: VideoAnimationDef) {
		if (!selectedClipIds.length) return;
		let tracks = value.tracks;
		for (const id of selectedClipIds) {
			tracks = updateClipInTracks(tracks, id, (c) =>
				def.slot === 'in'
					? { ...c, animationIn: { type: def.type, durationMs: def.durationMs } }
					: { ...c, animationOut: { type: def.type, durationMs: def.durationMs } }
			);
		}
		setTracks(tracks);
	}

	function applyTransition(def: VideoTransitionDef) {
		if (!selectedClipIds.length) return;
		let tracks = value.tracks;
		for (const id of selectedClipIds) {
			tracks = updateClipInTracks(tracks, id, (c) => ({
				...c,
				transitionOut: { type: def.type, durationMs: def.durationMs }
			}));
		}
		setTracks(tracks);
	}

	function patchClip(clip: MediaClip) {
		setTracks(updateClipInTracks(value.tracks, clip.id, () => clip));
	}

	function patchTrack(track: MediaTrack) {
		setTracks(value.tracks.map((t) => (t.id === track.id ? track : t)));
	}

	function splitSelected() {
		if (!selectedClipIds.length) return;
		setTracks(splitClipsAt(value.tracks, selectedClipIds, currentTimeMs));
	}

	function mergeSelected() {
		const idsBefore = new Set(value.tracks.flatMap((t) => t.clips.map((c) => c.id)));
		const next = mergeClipsInTracks(value.tracks, selectedClipIds);
		if (!next) return;
		setTracks(next);
		const created = next.flatMap((t) => t.clips).find((c) => !idsBefore.has(c.id));
		selectedClipIds = created ? [created.id] : [];
	}

	function duplicateSelected() {
		let tracks = value.tracks;
		const created: string[] = [];
		for (const id of selectedClipIds) {
			const before = new Set(tracks.flatMap((t) => t.clips.map((c) => c.id)));
			tracks = duplicateClipInTracks(tracks, id);
			const neu = tracks.flatMap((t) => t.clips).find((c) => !before.has(c.id));
			if (neu) created.push(neu.id);
		}
		setTracks(tracks);
		if (created.length) selectedClipIds = created;
	}

	function deleteSelected() {
		if (!selectedClipIds.length) return;
		setTracks(removeClipsFromTracks(value.tracks, selectedClipIds));
		selectedClipIds = [];
	}

	function handleCtx(id: string) {
		if (id === 'split') splitSelected();
		else if (id === 'merge') mergeSelected();
		else if (id === 'duplicate') duplicateSelected();
		else if (id === 'delete') deleteSelected();
		else if (id === 'add-clip') addEmptyClip(ctxTrackId);
		else if (id === 'add-video-track') addTrack('video');
		else if (id === 'add-audio-track') addTrack('audio');
		else if (id === 'delete-track' && ctxTrackId) deleteTrack(ctxTrackId);
		ctxOpen = false;
	}

	function secValue(ms: number) {
		const s = Math.round(ms / 100) / 10; // 1 decimal second
		return Number.isInteger(s) ? String(s) : s.toFixed(1);
	}

	function msToSec(ms: number) {
		return Math.round(ms / 100) / 10;
	}

	function secToMs(s: number) {
		return Math.max(0, s) * 1000;
	}

	function clearSelection() {
		selectedClipIds = [];
	}

	function seekBy(deltaMs: number) {
		currentTimeMs = clampMs(currentTimeMs + deltaMs, 0, value.durationMs);
	}

	function seekTo(ms: number) {
		currentTimeMs = clampMs(ms, 0, value.durationMs);
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
			clearSelection();
			return;
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			seekBy(e.shiftKey ? -SKIP_MS : -(1000 / Math.max(1, value.fps)));
			return;
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			seekBy(e.shiftKey ? SKIP_MS : 1000 / Math.max(1, value.fps));
			return;
		}
		if (e.key === 'Home') {
			e.preventDefault();
			seekTo(0);
			return;
		}
		if (e.key === 'End') {
			e.preventDefault();
			seekTo(value.durationMs);
			return;
		}
		if (e.key === 'm' || e.key === 'M') {
			e.preventDefault();
			muted = !muted;
			return;
		}
		if ((e.key === 's' || e.key === 'S') && canSplit) {
			e.preventDefault();
			splitSelected();
			return;
		}
		if ((e.key === 'd' || e.key === 'D') && (e.metaKey || e.ctrlKey) && selectedClipIds.length) {
			e.preventDefault();
			duplicateSelected();
			return;
		}
		if ((e.key === 'Delete' || e.key === 'Backspace') && selectedClipIds.length) {
			e.preventDefault();
			deleteSelected();
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

	const tabBtn = (active: boolean) =>
		[
			'flex-1 rounded-md px-1.5 py-1.5 text-[10px] font-medium transition-colors',
			active ? 'bg-brand-500 text-white' : 'text-secondary hover:bg-surface-overlay'
		].join(' ');
</script>

<svelte:window onkeydown={handleKeydown} />

	<div class={['relative flex h-full min-h-0 flex-col', className]}>
	<div class="flex shrink-0 items-center gap-2 border-b border-border bg-surface-elevated px-3 py-2">
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

	<div class="min-h-0 flex-1 overflow-hidden">
		<EditorShell
			sidebarTitle="Library"
			inspectorTitle={selectedClip
				? selectedClipIds.length > 1
					? `${selectedClipIds.length} clips`
					: 'Clip'
				: 'Sequence'}
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
			inspectorSize={280}
			bottomSize={300}
			sidebarMin={180}
			sidebarMax={420}
			inspectorMin={200}
			inspectorMax={420}
			bottomMin={180}
			bottomMax={560}
			sizeUnit="px"
			fullHeight
			class="h-full"
		>
			{#snippet sidebar()}
				<div class="flex h-full min-h-0 flex-col">
					<div class="flex shrink-0 gap-1 border-b border-border p-2">
						<button
							type="button"
							class={tabBtn(sidebarTab === 'components')}
							onclick={() => (sidebarTab = 'components')}
						>
							Comp
						</button>
						<button
							type="button"
							class={tabBtn(sidebarTab === 'animations')}
							onclick={() => (sidebarTab = 'animations')}
						>
							Anim
						</button>
						<button
							type="button"
							class={tabBtn(sidebarTab === 'transitions')}
							onclick={() => (sidebarTab = 'transitions')}
						>
							Trans
						</button>
						<button
							type="button"
							class={tabBtn(sidebarTab === 'assets')}
							onclick={() => (sidebarTab = 'assets')}
						>
							Assets
						</button>
					</div>
					<div class="min-h-0 flex-1 overflow-auto">
						{#if sidebarTab === 'components'}
							<VideoComponentsPanel onadd={addComponent} />
						{:else if sidebarTab === 'animations'}
							<VideoAnimationsPanel
								disabled={!selectedClip}
								onapply={applyAnimation}
							/>
						{:else if sidebarTab === 'transitions'}
							<VideoTransitionsPanel
								disabled={!selectedClip}
								onapply={applyTransition}
							/>
						{:else}
							<MediaAssetBrowser
								assets={value.assets}
								accept="image/*,video/*,audio/*"
								helperText="Image, video or audio"
								uploadLayout="vertical"
								onassetschange={(assets) => emit({ ...value, assets })}
								onselect={(id) => {
									const asset = value.assets.find((a) => a.id === id);
									if (asset) addAssetAsClip(asset);
								}}
								onadd={(asset) => {
									emit({ ...value, assets: [...value.assets, asset] });
								}}
							/>
						{/if}
					</div>
				</div>
			{/snippet}

			{#snippet workspace()}
				<div class="flex h-full min-h-0 flex-col bg-surface p-3">
					<div class="min-h-0 flex-1">
						<ProgramMonitor
							width={value.width}
							height={value.height}
							background={value.background}
							{currentTimeMs}
							{playing}
							{playbackRate}
							{muted}
							{volume}
							tracks={value.tracks}
							{selectedClipIds}
							editable={!playing}
							onselectclip={selectClip}
							onchangeclip={patchClip}
							onemptyclick={clearSelection}
							class="mx-auto max-h-full"
						/>
					</div>
				</div>
			{/snippet}

			{#snippet inspector()}
				{#if !selectedClip}
					<PropertyGroup title="Sequence">
						<PropertyField label="Width">
							<NumberInput
								size="sm"
								min={1}
								value={value.width}
								onchange={(v) => patchSequence({ width: v || value.width })}
							/>
						</PropertyField>
						<PropertyField label="Height">
							<NumberInput
								size="sm"
								min={1}
								value={value.height}
								onchange={(v) => patchSequence({ height: v || value.height })}
							/>
						</PropertyField>
						<PropertyField label="FPS">
							<NumberInput
								size="sm"
								min={1}
								value={value.fps}
								onchange={(v) => patchSequence({ fps: v || value.fps })}
							/>
						</PropertyField>
						<PropertyField label="Duration (s)">
							<NumberInput
								size="sm"
								step={0.1}
								min={0.1}
								value={msToSec(value.durationMs)}
								onchange={(v) =>
									patchSequence({ durationMs: secToMs(v) || value.durationMs })}
							/>
						</PropertyField>
						<PropertyField label="Background">
							<ColorPicker
								value={value.background}
								showSwatches={false}
								onchange={(v) => patchSequence({ background: v })}
							/>
						</PropertyField>
					</PropertyGroup>
					<p class="px-3 py-4 text-center text-xs text-muted">Select a clip to edit</p>
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
						<PropertyField label="Kind">
							<span class="text-xs capitalize text-secondary">{selectedClip.kind}</span>
						</PropertyField>
						<PropertyField label="Start (s)">
							<NumberInput
								size="sm"
								step={0.1}
								min={0}
								value={msToSec(selectedClip.startMs)}
								onchange={(v) => {
									const startMs = secToMs(v);
									const dur = selectedClip.endMs - selectedClip.startMs;
									patchClip({ ...selectedClip, startMs, endMs: startMs + dur });
								}}
							/>
						</PropertyField>
						<PropertyField label="End (s)">
							<NumberInput
								size="sm"
								step={0.1}
								min={0}
								value={msToSec(selectedClip.endMs)}
								onchange={(v) => patchClip({ ...selectedClip, endMs: secToMs(v) })}
							/>
						</PropertyField>
						<PropertyField label="Duration (s)">
							<NumberInput
								size="sm"
								step={0.1}
								min={0.1}
								value={msToSec(selectedClip.endMs - selectedClip.startMs)}
								onchange={(v) =>
									patchClip({
										...selectedClip,
										endMs: selectedClip.startMs + Math.max(50, secToMs(v))
									})}
							/>
						</PropertyField>
						<PropertyField
							label="Clip opacity"
							modified={clipFieldModified('opacity')}
							onreset={() => resetClipField('opacity')}
						>
							<Slider
								size="sm"
								min={0}
								max={1}
								step={0.01}
								value={selectedClip.opacity ?? 1}
								showValue
								valuePosition="header"
								oninput={(v) => patchClip({ ...selectedClip, opacity: v })}
							/>
						</PropertyField>
						{#if selectedClip.kind !== 'audio'}
							<PropertyField
								label="Preview opacity"
								modified={clipFieldModified('previewOpacity')}
								onreset={() => resetClipField('previewOpacity')}
							>
								<Slider
									size="sm"
									min={0}
									max={1}
									step={0.01}
									value={selectedClip.previewOpacity ?? 1}
									showValue
									valuePosition="header"
									oninput={(v) => patchClip({ ...selectedClip, previewOpacity: v })}
								/>
							</PropertyField>
						{/if}
						<PropertyField
							label="Color"
							modified={clipFieldModified('color')}
							onreset={() => resetClipField('color')}
						>
							<ColorPicker
								value={selectedClip.color ?? '#3b82f6'}
								showSwatches={false}
								onchange={(v) => patchClip({ ...selectedClip, color: v })}
							/>
						</PropertyField>
					</PropertyGroup>

					{#if showTransform && selectedRect}
						<PropertyGroup title="Transform">
							<div class="mx-1 mb-1.5 flex w-full min-w-0 flex-col gap-1.5">
								<div
									class="flex w-full flex-nowrap items-center justify-between gap-0 overflow-x-auto rounded-xl border border-border bg-surface-elevated p-0.5 shadow-sm"
									role="toolbar"
									aria-label="Position"
								>
									{#each alignDock as action (action.id)}
										{@const Icon = action.icon}
										<Tooltip content={action.label} side="top" class="shrink-0">
											<IconButton
												label={action.label}
												size="xs"
												variant="ghost"
												onclick={() => applyAlign(action.id)}
											>
												<Icon class="h-3.5 w-3.5" />
											</IconButton>
										</Tooltip>
									{/each}
								</div>
							</div>
							<div class="grid grid-cols-2 gap-2">
								<PropertyField
									label="X"
									modified={clipFieldModified('rect')}
									onreset={() => resetClipField('rect')}
								>
									<NumberInput
										size="sm"
										value={Math.round(selectedRect.x)}
										onchange={(v) => patchSelectedRect({ x: v })}
									/>
								</PropertyField>
								<PropertyField label="Y">
									<NumberInput
										size="sm"
										value={Math.round(selectedRect.y)}
										onchange={(v) => patchSelectedRect({ y: v })}
									/>
								</PropertyField>
								<PropertyField label="W">
									<NumberInput
										size="sm"
										min={1}
										value={Math.round(selectedRect.w)}
										onchange={(v) => patchSelectedRect({ w: v })}
									/>
								</PropertyField>
								<PropertyField label="H">
									<NumberInput
										size="sm"
										min={1}
										value={Math.round(selectedRect.h)}
										onchange={(v) => patchSelectedRect({ h: v })}
									/>
								</PropertyField>
							</div>
						</PropertyGroup>
					{/if}

					{#if selectedClip.kind === 'text'}
						<PropertyGroup title="Text">
							<PropertyField label="Content">
								<Input
									size="sm"
									value={selectedClip.text ?? ''}
									oninput={(e) =>
										patchClip({
											...selectedClip,
											text: (e.currentTarget as HTMLInputElement).value
										})}
								/>
							</PropertyField>
							<PropertyField
								label="Color"
								modified={clipFieldModified('textColor')}
								onreset={() => resetClipField('textColor')}
							>
								<ColorPicker
									value={selectedClip.textColor ?? '#ffffff'}
									showSwatches={false}
									onchange={(v) => patchClip({ ...selectedClip, textColor: v })}
								/>
							</PropertyField>
							<PropertyField
								label="Size"
								modified={clipFieldModified('fontSize')}
								onreset={() => resetClipField('fontSize')}
							>
								<Slider
									size="sm"
									min={8}
									max={120}
									step={1}
									value={selectedClip.fontSize ?? 18}
									showValue
									valuePosition="header"
									oninput={(v) => patchClip({ ...selectedClip, fontSize: v })}
								/>
							</PropertyField>
							<PropertyField
								label="Weight"
								modified={clipFieldModified('fontWeight')}
								onreset={() => resetClipField('fontWeight')}
							>
								<Slider
									size="sm"
									min={100}
									max={900}
									step={100}
									value={Number(selectedClip.fontWeight ?? 600)}
									showValue
									valuePosition="header"
									oninput={(v) => patchClip({ ...selectedClip, fontWeight: v })}
								/>
							</PropertyField>
							<PropertyField
								label="Align"
								modified={clipFieldModified('textAlign')}
								onreset={() => resetClipField('textAlign')}
							>
								<Input
									size="sm"
									value={selectedClip.textAlign ?? 'center'}
									oninput={(e) =>
										patchClip({
											...selectedClip,
											textAlign: (e.currentTarget as HTMLInputElement).value as
												| 'left'
												| 'center'
												| 'right'
										})}
								/>
							</PropertyField>
						</PropertyGroup>
					{/if}

					{#if selectedClip.kind === 'video' || selectedClip.kind === 'image'}
						<PropertyGroup title={selectedClip.kind === 'video' ? 'Video' : 'Image'}>
							<div class="px-1 pb-1">
								{#key selectedClip.id}
									<FileUploader
										label="Source"
										variant="single"
										layout="vertical"
										accept={acceptForClipKind(selectedClip.kind)}
										helperText={selectedClip.kind === 'video' ? 'MP4, WebM…' : 'PNG, JPG, WebP…'}
										src={selectedClip.src ?? ''}
										srcName={selectedClip.name}
										maxSizeMb={200}
										showFileList={false}
										onchange={(files) => void replaceSelectedMedia(files)}
										onclear={clearSelectedMedia}
									/>
								{/key}
							</div>
							{#if selectedClip.kind === 'video'}
								<PropertyField
									label="Volume"
									modified={clipFieldModified('volume')}
									onreset={() => resetClipField('volume')}
								>
									<Slider
										size="sm"
										min={0}
										max={1}
										step={0.01}
										value={selectedClip.volume ?? 1}
										showValue
										valuePosition="header"
										oninput={(v) => patchClip({ ...selectedClip, volume: v })}
									/>
								</PropertyField>
							{/if}
							<PropertyField
								label="Trim in (s)"
								modified={clipFieldModified('trimInMs')}
								onreset={() => resetClipField('trimInMs')}
							>
								<NumberInput
									size="sm"
									step={0.1}
									min={0}
									value={msToSec(selectedClip.trimInMs ?? 0)}
									onchange={(v) => patchClip({ ...selectedClip, trimInMs: secToMs(v) })}
								/>
							</PropertyField>
							<PropertyField
								label="Trim out (s)"
								modified={clipFieldModified('trimOutMs')}
								onreset={() => resetClipField('trimOutMs')}
							>
								<NumberInput
									size="sm"
									step={0.1}
									min={0}
									value={msToSec(selectedClip.trimOutMs ?? 0)}
									onchange={(v) =>
										patchClip({
											...selectedClip,
											trimOutMs: secToMs(v) || undefined
										})}
								/>
							</PropertyField>
						</PropertyGroup>
					{/if}

					{#if selectedClip.kind === 'audio'}
						<PropertyGroup title="Audio">
							<div class="px-1 pb-1">
								{#key selectedClip.id}
									<FileUploader
										label="Source"
										variant="single"
										layout="vertical"
										accept={acceptForClipKind('audio')}
										helperText="MP3, WAV, OGG…"
										src={selectedClip.src ?? ''}
										srcName={selectedClip.name}
										maxSizeMb={200}
										showFileList={false}
										onchange={(files) => void replaceSelectedMedia(files)}
										onclear={clearSelectedMedia}
									/>
								{/key}
							</div>
							<PropertyField
								label="Volume"
								modified={clipFieldModified('volume')}
								onreset={() => resetClipField('volume')}
							>
								<Slider
									size="sm"
									min={0}
									max={1}
									step={0.01}
									value={selectedClip.volume ?? 1}
									showValue
									valuePosition="header"
									oninput={(v) => patchClip({ ...selectedClip, volume: v })}
								/>
							</PropertyField>
							<PropertyField
								label="Trim in (s)"
								modified={clipFieldModified('trimInMs')}
								onreset={() => resetClipField('trimInMs')}
							>
								<NumberInput
									size="sm"
									step={0.1}
									min={0}
									value={msToSec(selectedClip.trimInMs ?? 0)}
									onchange={(v) => patchClip({ ...selectedClip, trimInMs: secToMs(v) })}
								/>
							</PropertyField>
							<PropertyField
								label="Trim out (s)"
								modified={clipFieldModified('trimOutMs')}
								onreset={() => resetClipField('trimOutMs')}
							>
								<NumberInput
									size="sm"
									step={0.1}
									min={0}
									value={msToSec(selectedClip.trimOutMs ?? 0)}
									onchange={(v) =>
										patchClip({
											...selectedClip,
											trimOutMs: secToMs(v) || undefined
										})}
								/>
							</PropertyField>
						</PropertyGroup>
					{/if}

					{#if selectedClip.animationIn || selectedClip.animationOut || selectedClip.transitionOut}
						<PropertyGroup title="Effects">
							{#if selectedClip.animationIn}
								<PropertyField label="Anim in">
									<span class="text-xs text-secondary">
										{selectedClip.animationIn.type} · {secValue(selectedClip.animationIn.durationMs)}s
									</span>
								</PropertyField>
							{/if}
							{#if selectedClip.animationOut}
								<PropertyField label="Anim out">
									<span class="text-xs text-secondary">
										{selectedClip.animationOut.type} · {secValue(selectedClip.animationOut.durationMs)}s
									</span>
								</PropertyField>
							{/if}
							{#if selectedClip.transitionOut}
								<PropertyField label="Transition">
									<span class="text-xs text-secondary">
										{selectedClip.transitionOut.type} · {secValue(selectedClip.transitionOut.durationMs)}s
									</span>
								</PropertyField>
							{/if}
						</PropertyGroup>
					{/if}

					{#if canSplit || canMerge}
						<div class="mt-3 flex flex-col gap-2 px-3 pb-3">
							{#if canSplit}
								<Button size="sm" variant="secondary" onclick={splitSelected}>
									<span class="inline-flex items-center gap-1.5">
										<Scissors class="h-3.5 w-3.5" />
										Split at playhead
									</span>
								</Button>
							{/if}
							{#if canMerge}
								<Button size="sm" variant="secondary" onclick={mergeSelected}>Merge selected</Button>
							{/if}
						</div>
					{/if}
				{/if}
			{/snippet}

			{#snippet bottom()}
				<div class="flex h-full min-h-0 flex-col gap-1 p-1">
					<div class="shrink-0 rounded-md border border-border bg-surface-elevated px-2 py-1">
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
								seekTo(0);
							}}
							onseekstart={() => seekTo(0)}
							onseekend={() => seekTo(value.durationMs)}
							onseekback={() => seekBy(-SKIP_MS)}
							onseekforward={() => seekBy(SKIP_MS)}
						/>
					</div>
					<div class="min-h-0 flex-1">
						<MediaTimeline
							tracks={value.tracks}
							durationMs={value.durationMs}
							bind:currentTimeMs
							bind:zoom
							{selectedClipIds}
							showTrackActions
							reorderTracks
							allowRemoveTracks
							onselectclip={selectClip}
							oncontextmenuclip={openClipMenu}
							oncontextmenutrack={openTrackMenu}
							onchangeclip={patchClip}
							onchangetrack={patchTrack}
							onaddtrack={addTrack}
							onremovetrack={deleteTrack}
							onreordertracks={reorderTrackIds}
							onemptyclick={() => clearSelection()}
							headerVariant="video"
							onseek={(ms) => (currentTimeMs = ms)}
							class="h-full min-h-0"
						/>
					</div>
				</div>
			{/snippet}
		</EditorShell>
	</div>

	{#if selectedClipIds.length > 1}
		<div class="pointer-events-none absolute inset-x-0 bottom-4 z-40 flex justify-center px-4">
			<div class="pointer-events-auto">
				<BulkActionBar
					count={selectedClipIds.length}
					itemLabel="clip"
					itemLabelPlural="clips"
					placement="dock"
					compact
					showSelectAll={false}
					maxPrimary={4}
					actions={bulkActions}
					onaction={handleBulk}
					onclear={clearSelection}
				/>
			</div>
		</div>
	{/if}
</div>

<ContextMenu
	items={ctxItems}
	bind:open={ctxOpen}
	bind:anchor={ctxAnchor}
	onselect={handleCtx}
/>
