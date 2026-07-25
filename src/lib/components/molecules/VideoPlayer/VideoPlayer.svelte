<script lang="ts">
	import VolumeControl from '$lib/components/molecules/VolumeControl/VolumeControl.svelte';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Maximize2 from '@lucide/svelte/icons/maximize-2';
	import Minimize2 from '@lucide/svelte/icons/minimize-2';

	interface VideoPlayerProps {
		src?: string;
		poster?: string;
		title?: string;
		/** Hover thumbnail over the seek bar (YouTube-style). Default true. */
		preview?: boolean;
		class?: string;
		onplay?: () => void;
		onpause?: () => void;
	}

	let {
		src = '',
		poster,
		title = 'Video',
		preview = true,
		class: className = '',
		onplay,
		onpause
	}: VideoPlayerProps = $props();

	let root = $state<HTMLDivElement | null>(null);
	let video = $state<HTMLVideoElement | null>(null);
	let previewVideo = $state<HTMLVideoElement | null>(null);
	let stageEl = $state<HTMLDivElement | null>(null);

	let playing = $state(false);
	let current = $state(0);
	let duration = $state(0);
	let volume = $state(1);
	let muted = $state(false);
	let seeking = $state(false);
	let wasPlayingBeforeSeek = $state(false);
	let seekValue = $state(0);
	let scrubRaf = 0;
	let previewRaf = 0;
	let previewSeeking = false;
	let pendingPreviewTime = 0;
	let lastPreviewQueued = -1;
	let loadError = $state(false);

	let hoverVisible = $state(false);
	let hoverTime = $state(0);
	let hoverPct = $state(0);
	/** Bubble center (clamped inside stage). */
	let previewLeftPx = $state(0);
	/** Caret shift so the arrow stays above the scrub thumb at edges. */
	let caretOffsetPx = $state(0);
	let leaveTimer: ReturnType<typeof setTimeout> | null = null;

	let isFullscreen = $state(false);
	let controlsVisible = $state(true);
	let hideTimer: ReturnType<typeof setTimeout> | null = null;
	let clickTimer: ReturnType<typeof setTimeout> | null = null;

	const HIDE_MS = 2600;
	const PREVIEW_HALF = 68;
	const PREVIEW_PAD = 10;
	const CARET_MAX = PREVIEW_HALF - 14;

	const progress = $derived(duration > 0 ? (seeking ? seekValue : current) / duration : 0);
	const bubblePct = $derived(seeking ? (duration > 0 ? (seekValue / duration) * 100 : 0) : hoverPct);
	const bubbleTime = $derived(seeking ? seekValue : hoverTime);
	/** Keep visible while hovering/seeking — never toggle on frame-ready (avoids flicker). */
	const showBubble = $derived(preview && duration > 0 && (hoverVisible || seeking) && !loadError);
	const showChrome = $derived(controlsVisible || !playing || seeking);

	function format(t: number) {
		if (!Number.isFinite(t) || t < 0) return '0:00';
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	function clearHideTimer() {
		if (hideTimer) {
			clearTimeout(hideTimer);
			hideTimer = null;
		}
	}

	function clearLeaveTimer() {
		if (leaveTimer) {
			clearTimeout(leaveTimer);
			leaveTimer = null;
		}
	}

	function bumpControls() {
		controlsVisible = true;
		clearHideTimer();
		if (isFullscreen && playing && !seeking) {
			hideTimer = setTimeout(() => {
				controlsVisible = false;
			}, HIDE_MS);
		}
	}

	function placePreview(pct: number, track?: HTMLElement) {
		const stage = stageEl?.getBoundingClientRect();
		if (!stage || stage.width <= 0) return;

		let ideal: number;
		if (track) {
			const trackRect = track.getBoundingClientRect();
			ideal = trackRect.left - stage.left + (pct / 100) * trackRect.width;
		} else {
			ideal = (pct / 100) * stage.width;
		}

		const min = PREVIEW_HALF + PREVIEW_PAD;
		const max = Math.max(min, stage.width - PREVIEW_HALF - PREVIEW_PAD);
		const clamped = Math.min(Math.max(ideal, min), max);
		previewLeftPx = clamped;
		caretOffsetPx = Math.min(Math.max(ideal - clamped, -CARET_MAX), CARET_MAX);
	}

	function syncPreview(time: number) {
		if (!preview || !previewVideo || !Number.isFinite(time)) return;
		const clamped = Math.min(Math.max(time, 0), Math.max((duration || 0) - 0.05, 0));
		// Skip tiny moves / spam while a seek is in flight
		if (previewSeeking && Math.abs(clamped - pendingPreviewTime) < 0.2) return;
		if (Math.abs(clamped - lastPreviewQueued) < 0.12) return;
		pendingPreviewTime = clamped;
		lastPreviewQueued = clamped;
		cancelAnimationFrame(previewRaf);
		previewRaf = requestAnimationFrame(() => {
			if (!previewVideo) return;
			if (Math.abs(previewVideo.currentTime - clamped) <= 0.08) return;
			previewSeeking = true;
			previewVideo.currentTime = clamped;
		});
	}

	function onPreviewSeeked() {
		previewSeeking = false;
		// Catch up if the pointer moved while we were seeking
		if (Math.abs(pendingPreviewTime - (previewVideo?.currentTime ?? 0)) > 0.15) {
			syncPreview(pendingPreviewTime);
		}
	}

	function timeFromPointer(e: PointerEvent, el: HTMLElement) {
		const rect = el.getBoundingClientRect();
		if (rect.width <= 0 || duration <= 0) return 0;
		const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
		hoverPct = ratio * 100;
		hoverTime = ratio * duration;
		placePreview(hoverPct, el);
		return hoverTime;
	}

	function toggle() {
		if (!video || loadError) return;
		if (video.paused) void video.play();
		else video.pause();
		bumpControls();
	}

	function onSeekPointerDown(e: PointerEvent) {
		if (!video || loadError) return;
		seeking = true;
		bumpControls();
		wasPlayingBeforeSeek = !video.paused;
		const track = (e.currentTarget as HTMLElement).closest('[data-seek-track]');
		if (track instanceof HTMLElement) {
			seekValue = timeFromPointer(e, track);
		} else {
			seekValue = video.currentTime;
			const pct = duration > 0 ? (seekValue / duration) * 100 : 0;
			placePreview(pct);
		}
		if (wasPlayingBeforeSeek) video.pause();
		syncPreview(seekValue);
	}

	function onSeekInput(e: Event) {
		const next = Number((e.currentTarget as HTMLInputElement).value);
		seekValue = next;
		if (duration > 0) hoverPct = (next / duration) * 100;
		hoverTime = next;
		const track = (e.currentTarget as HTMLElement).closest('[data-seek-track]');
		placePreview(hoverPct, track instanceof HTMLElement ? track : undefined);
		if (!video) return;
		cancelAnimationFrame(scrubRaf);
		scrubRaf = requestAnimationFrame(() => {
			if (video) video.currentTime = next;
		});
		syncPreview(next);
		bumpControls();
	}

	function onSeekPointerUp() {
		cancelAnimationFrame(scrubRaf);
		if (!video) {
			seeking = false;
			return;
		}
		video.currentTime = seekValue;
		current = seekValue;
		seeking = false;
		if (wasPlayingBeforeSeek) void video.play();
		wasPlayingBeforeSeek = false;
		bumpControls();
	}

	function onTrackPointerMove(e: PointerEvent) {
		bumpControls();
		clearLeaveTimer();
		if (!preview || duration <= 0 || loadError) return;
		const el = e.currentTarget as HTMLElement;
		const t = timeFromPointer(e, el);
		hoverVisible = true;
		if (!seeking) syncPreview(t);
	}

	function onTrackPointerLeave() {
		if (seeking) return;
		clearLeaveTimer();
		// Short delay avoids flicker when the pointer briefly leaves the hit area
		leaveTimer = setTimeout(() => {
			hoverVisible = false;
			lastPreviewQueued = -1;
		}, 100);
	}

	async function toggleFullscreen() {
		if (!root) return;
		try {
			if (document.fullscreenElement === root) {
				await document.exitFullscreen();
			} else if (!document.fullscreenElement) {
				await root.requestFullscreen();
			}
		} catch {
			/* ignore unsupported / denied */
		}
		bumpControls();
	}

	function onStageClick() {
		if (loadError) return;
		// Single click = play/pause, double = fullscreen (YouTube-like)
		if (clickTimer) {
			clearTimeout(clickTimer);
			clickTimer = null;
			void toggleFullscreen();
			return;
		}
		clickTimer = setTimeout(() => {
			clickTimer = null;
			toggle();
		}, 220);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement) return;
		if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
			e.preventDefault();
			toggle();
		} else if (e.key === 'f' || e.key === 'F') {
			e.preventDefault();
			void toggleFullscreen();
		} else if (e.key === 'm' || e.key === 'M') {
			e.preventDefault();
			muted = !muted;
			bumpControls();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			if (video) {
				video.currentTime = Math.max(0, video.currentTime - 5);
				current = video.currentTime;
			}
			bumpControls();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			if (video) {
				video.currentTime = Math.min(duration, video.currentTime + 5);
				current = video.currentTime;
			}
			bumpControls();
		}
	}

	function onFullscreenChange() {
		isFullscreen = !!root && document.fullscreenElement === root;
		bumpControls();
	}

	$effect(() => {
		if (!video) return;
		video.volume = muted ? 0 : volume;
		video.muted = muted;
	});

	$effect(() => {
		src;
		current = 0;
		duration = 0;
		seekValue = 0;
		seeking = false;
		hoverVisible = false;
		loadError = false;
		lastPreviewQueued = -1;
		previewSeeking = false;
	});

	$effect(() => {
		document.addEventListener('fullscreenchange', onFullscreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', onFullscreenChange);
			clearHideTimer();
			clearLeaveTimer();
			if (clickTimer) clearTimeout(clickTimer);
		};
	});

	$effect(() => {
		playing;
		seeking;
		isFullscreen;
		bumpControls();
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={root}
	class={[
		'group/player overflow-hidden outline-none',
		isFullscreen
			? 'flex h-full w-full flex-col bg-black'
			: 'rounded-2xl border border-border bg-surface-elevated shadow-sm',
		isFullscreen && !showChrome && 'cursor-none',
		className
	]}
	tabindex="0"
	onkeydown={onKeydown}
	onpointermove={() => {
		if (isFullscreen) bumpControls();
	}}
	role="region"
	aria-label={title}
>
	<div
		class={[
			'relative overflow-hidden bg-zinc-950',
			isFullscreen ? 'min-h-0 flex-1' : ''
		]}
		bind:this={stageEl}
	>
		<video
			bind:this={video}
			class={[
				'w-full',
				isFullscreen ? 'h-full object-contain' : 'aspect-video object-cover'
			]}
			{src}
			{poster}
			playsinline
			preload="metadata"
			onplay={() => {
				playing = true;
				onplay?.();
				bumpControls();
			}}
			onpause={() => {
				playing = false;
				onpause?.();
				bumpControls();
			}}
			ontimeupdate={() => {
				if (!seeking) current = video?.currentTime ?? 0;
			}}
			onloadedmetadata={() => {
				duration = video?.duration ?? 0;
				loadError = false;
			}}
			onerror={() => {
				loadError = true;
				duration = 0;
			}}
			onclick={onStageClick}
		>
			<track kind="captions" />
		</video>

		{#if loadError}
			<div
				class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-zinc-950 px-4 text-center"
			>
				<p class="text-sm font-medium text-white">No se pudo cargar el vídeo</p>
				<p class="truncate text-[11px] text-white/50">{src}</p>
			</div>
		{:else if !playing && !seeking}
			<button
				type="button"
				class={[
					'absolute inset-0 z-10 flex items-center justify-center bg-black/25 transition hover:bg-black/35',
					isFullscreen && !showChrome && 'opacity-0'
				]}
				onclick={(e) => {
					e.stopPropagation();
					toggle();
				}}
				aria-label="Play {title}"
			>
				<span
					class="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-lg sm:h-16 sm:w-16"
				>
					<Play class="h-6 w-6 translate-x-px sm:h-7 sm:w-7" fill="currentColor" strokeWidth={0} />
				</span>
			</button>
		{/if}

		{#if preview}
			<div
				class={[
					'pointer-events-none absolute bottom-2 z-30 w-max -translate-x-1/2',
					showBubble && (!isFullscreen || showChrome) ? 'opacity-100' : 'opacity-0',
					isFullscreen && 'bottom-24'
				]}
				style:left="{previewLeftPx}px"
				aria-hidden="true"
			>
				<div class="flex w-[7.5rem] flex-col items-stretch sm:w-[8.5rem]">
					<div
						class="relative overflow-hidden rounded-md bg-zinc-950 shadow-[0_8px_30px_rgb(0,0,0,0.45)] ring-1 ring-white/25"
					>
						<video
							bind:this={previewVideo}
							{src}
							muted
							playsinline
							preload="auto"
							class="block aspect-video h-[4.25rem] w-full object-cover sm:h-[4.75rem]"
							onseeked={onPreviewSeeked}
						></video>
						<span
							class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-1.5 pb-1 pt-5 text-center font-mono text-[10px] font-semibold tabular-nums text-white"
						>
							{format(bubbleTime)}
						</span>
					</div>
					<!-- Caret tracks the scrub thumb, even when the bubble is edge-clamped -->
					<div class="relative h-[7px] w-full">
						<div
							class="absolute left-1/2 top-0 h-0 w-0 border-x-[6px] border-t-[7px] border-x-transparent border-t-zinc-950"
							style:transform="translateX(calc(-50% + {caretOffsetPx}px))"
							style:filter="drop-shadow(0 1px 0 rgb(255 255 255 / 0.2))"
						></div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Fullscreen overlay chrome (YouTube-like) -->
		{#if isFullscreen}
			<div
				class={[
					'pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-black/25 transition-opacity duration-300',
					showChrome ? 'opacity-100' : 'opacity-0'
				]}
			></div>

			<div
				class={[
					'absolute inset-x-0 top-0 z-20 px-4 py-3 transition-opacity duration-300',
					showChrome ? 'opacity-100' : 'pointer-events-none opacity-0'
				]}
			>
				<p class="truncate text-sm font-medium text-white drop-shadow">{title}</p>
			</div>

			<div
				class={[
					'absolute inset-x-0 bottom-0 z-20 space-y-2 px-3 pb-3 pt-8 transition-opacity duration-300 sm:px-5 sm:pb-4',
					showChrome ? 'opacity-100' : 'pointer-events-none opacity-0'
				]}
			>
				{@render seekBar('fs')}
				<div class="flex items-center justify-between gap-3">
					<div class="flex items-center gap-1">
						<button
							type="button"
							class="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:opacity-40"
							onclick={toggle}
							disabled={loadError}
							aria-label={playing ? 'Pause' : 'Play'}
						>
							{#if playing && !seeking}
								<Pause class="h-5 w-5" fill="currentColor" strokeWidth={0} />
							{:else}
								<Play class="h-5 w-5 translate-x-px" fill="currentColor" strokeWidth={0} />
							{/if}
						</button>
						<span class="font-mono text-xs tabular-nums text-white/90">
							{format(seeking ? seekValue : current)} / {format(duration)}
						</span>
					</div>

					<div class="flex items-center gap-1">
						<div
							class="[&_button]:text-white/90 [&_button:hover]:bg-white/15 [&_button:hover]:text-white [&_input]:accent-white"
						>
							<VolumeControl variant="compact" bind:value={volume} bind:muted disabled={loadError} />
						</div>
						<button
							type="button"
							class="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/15"
							onclick={() => void toggleFullscreen()}
							aria-label="Exit fullscreen"
						>
							<Minimize2 class="h-5 w-5" strokeWidth={2} />
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>

	{#if !isFullscreen}
		<div class="space-y-2 border-t border-border bg-surface-elevated px-3 py-2.5">
			<div class="flex items-center justify-between gap-2">
				<p class="truncate text-sm font-medium text-primary">{title}</p>
				<span class="font-mono text-[10px] tabular-nums text-muted">
					{format(seeking ? seekValue : current)} / {format(duration)}
				</span>
			</div>

			{@render seekBar('inline')}

			<div class="flex items-center justify-between gap-2">
				<button
					type="button"
					class="flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-surface-overlay hover:text-primary disabled:opacity-40"
					onclick={toggle}
					disabled={loadError}
					aria-label={playing ? 'Pause' : 'Play'}
				>
					{#if playing && !seeking}
						<Pause class="h-4 w-4" fill="currentColor" strokeWidth={0} />
					{:else}
						<Play class="h-4 w-4 translate-x-px" fill="currentColor" strokeWidth={0} />
					{/if}
				</button>

				<VolumeControl variant="compact" bind:value={volume} bind:muted disabled={loadError} />

				<button
					type="button"
					class="flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-surface-overlay hover:text-primary"
					onclick={() => void toggleFullscreen()}
					aria-label="Fullscreen"
				>
					<Maximize2 class="h-4 w-4" strokeWidth={2} />
				</button>
			</div>
		</div>
	{/if}
</div>

{#snippet seekBar(tone: 'inline' | 'fs')}
	<div
		class="relative py-1.5"
		data-seek-track
		onpointermove={onTrackPointerMove}
		onpointerleave={onTrackPointerLeave}
		role="presentation"
	>
		<div class="relative h-1.5">
			<div
				class={[
					'h-1.5 overflow-hidden rounded-full',
					tone === 'fs' ? 'bg-white/25' : 'bg-surface-overlay'
				]}
			>
				<div
					class={[
						'h-full rounded-full',
						tone === 'fs' ? 'bg-brand-400' : 'bg-brand-500',
						!seeking && 'transition-[width] duration-100'
					]}
					style:width="{progress * 100}%"
				></div>
			</div>
			{#if showBubble}
				<div
					class={[
						'pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow ring-2',
						tone === 'fs'
							? 'bg-brand-400 ring-white'
							: 'bg-brand-500 ring-white dark:ring-zinc-900'
					]}
					style:left="{bubblePct}%"
				></div>
			{/if}
			<input
				type="range"
				min="0"
				max={duration || 0}
				step="0.05"
				value={seeking ? seekValue : current}
				onpointerdown={onSeekPointerDown}
				onpointerup={onSeekPointerUp}
				onpointercancel={onSeekPointerUp}
				onchange={onSeekPointerUp}
				oninput={onSeekInput}
				disabled={loadError || duration <= 0}
				class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
				aria-label="Seek"
			/>
		</div>
	</div>
{/snippet}
