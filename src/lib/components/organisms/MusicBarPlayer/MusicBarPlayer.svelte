<script lang="ts">
	import type { PlaylistTrack } from '$lib/components/molecules/Playlist/Playlist.svelte';
	import VolumeControl from '$lib/components/molecules/VolumeControl/VolumeControl.svelte';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import SkipBack from '@lucide/svelte/icons/skip-back';
	import SkipForward from '@lucide/svelte/icons/skip-forward';
	import Repeat from '@lucide/svelte/icons/repeat';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import ListMusic from '@lucide/svelte/icons/list-music';
	import Heart from '@lucide/svelte/icons/heart';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import X from '@lucide/svelte/icons/x';

	interface MusicBarPlayerProps {
		tracks?: PlaylistTrack[];
		index?: number;
		autoplay?: boolean;
		/** fixed to viewport bottom (Spotify-like) */
		fixed?: boolean;
		/** Visible; bind to hide/show from parent */
		open?: boolean;
		shuffle?: boolean;
		repeat?: boolean;
		class?: string;
		onchange?: (track: PlaylistTrack, index: number) => void;
		onlike?: (track: PlaylistTrack, index: number) => void;
		onclose?: () => void;
	}

	let {
		tracks = [],
		index = $bindable(0),
		autoplay = false,
		fixed = true,
		open = $bindable(true),
		shuffle = $bindable(false),
		repeat = $bindable(false),
		class: className = '',
		onchange,
		onlike,
		onclose
	}: MusicBarPlayerProps = $props();

	let audio = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);
	let current = $state(0);
	let duration = $state(0);
	let volume = $state(0.85);
	let muted = $state(false);
	let seeking = $state(false);
	let wasPlayingBeforeSeek = $state(false);
	let seekValue = $state(0);
	let expanded = $state(false);
	let queueOpen = $state(false);
	let liked = $state(false);

	const track = $derived(tracks[index] ?? null);
	const artwork = $derived(
		track?.artwork ||
			'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop'
	);
	const displayTime = $derived(seeking ? seekValue : current);
	const progress = $derived(duration > 0 ? displayTime / duration : 0);
	const canPrevious = $derived(tracks.length > 1 || displayTime > 3);
	const canNext = $derived(tracks.length > 1);

	function format(t: number) {
		if (!Number.isFinite(t) || t < 0) return '0:00';
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	function select(i: number, play = true) {
		if (i < 0 || i >= tracks.length) return;
		index = i;
		current = 0;
		seekValue = 0;
		liked = Boolean(tracks[i]?.liked);
		onchange?.(tracks[i], i);
		if (play) requestAnimationFrame(() => void audio?.play());
	}

	function toggle() {
		if (!audio) return;
		if (audio.paused) void audio.play();
		else audio.pause();
	}

	function previous() {
		if (audio && audio.currentTime > 3) {
			audio.currentTime = 0;
			current = 0;
			return;
		}
		if (!tracks.length) return;
		if (shuffle) {
			select(Math.floor(Math.random() * tracks.length));
			return;
		}
		select((index - 1 + tracks.length) % tracks.length);
	}

	function next() {
		if (!tracks.length) return;
		if (shuffle) {
			select(Math.floor(Math.random() * tracks.length));
			return;
		}
		select((index + 1) % tracks.length);
	}

	function onSeekPointerDown() {
		if (!audio) return;
		seeking = true;
		wasPlayingBeforeSeek = !audio.paused;
		seekValue = audio.currentTime;
		if (wasPlayingBeforeSeek) audio.pause();
	}

	function onSeekInput(e: Event) {
		seekValue = Number((e.currentTarget as HTMLInputElement).value);
	}

	function onSeekPointerUp() {
		if (!audio) {
			seeking = false;
			return;
		}
		audio.currentTime = seekValue;
		current = seekValue;
		seeking = false;
		if (wasPlayingBeforeSeek) void audio.play();
		wasPlayingBeforeSeek = false;
	}

	function onEnded() {
		playing = false;
		if (repeat) {
			if (audio) {
				audio.currentTime = 0;
				void audio.play();
			}
			return;
		}
		if (canNext) next();
	}

	function toggleLike() {
		liked = !liked;
		if (track) onlike?.({ ...track, liked }, index);
	}

	function close() {
		open = false;
		audio?.pause();
		onclose?.();
	}

	$effect(() => {
		if (!audio) return;
		audio.volume = muted ? 0 : volume;
		audio.muted = muted;
	});

	$effect(() => {
		liked = Boolean(track?.liked);
	});
</script>

{#if open && track}
	<audio
		bind:this={audio}
		src={track.src}
		{autoplay}
		preload="metadata"
		onplay={() => (playing = true)}
		onpause={() => (playing = false)}
		onended={onEnded}
		ontimeupdate={() => {
			if (!seeking) current = audio?.currentTime ?? 0;
		}}
		onloadedmetadata={() => (duration = audio?.duration ?? 0)}
	></audio>

	<div
		class={[
			'z-40 border-t border-border bg-surface-elevated/95 text-primary shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)]',
			fixed ? 'fixed inset-x-0 bottom-0' : 'relative w-full',
			className
		]}
		role="region"
		aria-label="Now playing"
	>
		<!-- Progress (full width, Spotify-like) -->
		<div class="group relative h-1 w-full bg-border/80 hover:h-1.5">
			<div
				class={[
					'h-full bg-brand-500 group-hover:bg-brand-400',
					!seeking && 'transition-[width] duration-100'
				]}
				style:width="{progress * 100}%"
			></div>
			<input
				type="range"
				min="0"
				max={duration || 0}
				step="0.1"
				value={displayTime}
				onpointerdown={onSeekPointerDown}
				onpointerup={onSeekPointerUp}
				onpointercancel={onSeekPointerUp}
				onchange={onSeekPointerUp}
				oninput={onSeekInput}
				class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
				aria-label="Seek"
			/>
		</div>

		<!-- Mobile expanded sheet -->
		{#if expanded}
			<div class="border-b border-border px-4 pb-4 pt-3 md:hidden">
				<div class="mb-3 flex items-center justify-between">
					<button
						type="button"
						class="rounded-lg p-1.5 text-muted hover:bg-surface-overlay hover:text-primary"
						onclick={() => (expanded = false)}
						aria-label="Collapse"
					>
						<ChevronDown class="h-5 w-5" strokeWidth={2} />
					</button>
					<p class="text-[11px] font-semibold uppercase tracking-wider text-muted">Now playing</p>
					<button
						type="button"
						class="rounded-lg p-1.5 text-muted hover:bg-surface-overlay hover:text-primary"
						onclick={close}
						aria-label="Close player"
					>
						<X class="h-4 w-4" strokeWidth={2} />
					</button>
				</div>
				<div class="flex flex-col items-center gap-4">
					<img
						src={artwork}
						alt=""
						class="h-48 w-48 rounded-2xl object-cover shadow-lg ring-1 ring-border"
					/>
					<div class="w-full text-center">
						<p class="truncate text-lg font-semibold">{track.title}</p>
						<p class="truncate text-sm text-muted">{track.artist ?? 'Unknown artist'}</p>
					</div>
					<div class="flex w-full justify-between font-mono text-[11px] tabular-nums text-muted">
						<span>{format(displayTime)}</span>
						<span>{format(duration)}</span>
					</div>
					<div class="flex items-center gap-4">
						<button
							type="button"
							class={[
								'rounded-full p-2',
								shuffle ? 'text-brand-500' : 'text-muted hover:text-primary'
							]}
							onclick={() => (shuffle = !shuffle)}
							aria-pressed={shuffle}
							aria-label="Shuffle"
						>
							<Shuffle class="h-4 w-4" strokeWidth={2} />
						</button>
						<button
							type="button"
							class="rounded-full p-2 text-primary hover:bg-surface-overlay disabled:opacity-30"
							onclick={previous}
							disabled={!canPrevious}
							aria-label="Previous"
						>
							<SkipBack class="h-6 w-6" strokeWidth={2} />
						</button>
						<button
							type="button"
							class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-md transition hover:bg-brand-600"
							onclick={toggle}
							aria-label={playing ? 'Pause' : 'Play'}
						>
							{#if playing && !seeking}
								<Pause class="h-6 w-6" fill="currentColor" strokeWidth={0} />
							{:else}
								<Play class="h-6 w-6 translate-x-px" fill="currentColor" strokeWidth={0} />
							{/if}
						</button>
						<button
							type="button"
							class="rounded-full p-2 text-primary hover:bg-surface-overlay disabled:opacity-30"
							onclick={next}
							disabled={!canNext}
							aria-label="Next"
						>
							<SkipForward class="h-6 w-6" strokeWidth={2} />
						</button>
						<button
							type="button"
							class={[
								'rounded-full p-2',
								repeat ? 'text-brand-500' : 'text-muted hover:text-primary'
							]}
							onclick={() => (repeat = !repeat)}
							aria-pressed={repeat}
							aria-label="Repeat"
						>
							<Repeat class="h-4 w-4" strokeWidth={2} />
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Queue drawer (desktop / mobile) -->
		{#if queueOpen}
			<div
				class="max-h-56 overflow-y-auto border-b border-border bg-surface-overlay/50 px-2 py-2 md:absolute md:bottom-full md:right-4 md:mb-2 md:max-h-72 md:w-80 md:rounded-xl md:border md:bg-surface-elevated md:shadow-xl"
			>
				<p class="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
					Queue
				</p>
				{#each tracks as t, i (t.id)}
					<button
						type="button"
						class={[
							'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition',
							i === index ? 'bg-brand-500/10' : 'hover:bg-surface-overlay'
						]}
						onclick={() => {
							select(i);
							queueOpen = false;
						}}
					>
						<img
							src={t.artwork || artwork}
							alt=""
							class="h-9 w-9 rounded object-cover"
						/>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium text-primary">{t.title}</p>
							<p class="truncate text-[11px] text-muted">{t.artist}</p>
						</div>
						{#if t.durationLabel}
							<span class="font-mono text-[10px] text-muted">{t.durationLabel}</span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}

		<!-- Bar -->
		<div
			class="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1fr)]"
		>
			<!-- Track info -->
			<div class="flex min-w-0 items-center gap-2.5">
				<button
					type="button"
					class="flex min-w-0 flex-1 items-center gap-2.5 text-left md:pointer-events-none"
					onclick={() => {
						if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
							expanded = !expanded;
						}
					}}
				>
					<img
						src={artwork}
						alt=""
						class="h-11 w-11 shrink-0 rounded-md object-cover shadow-sm ring-1 ring-border sm:h-12 sm:w-12 sm:rounded-lg"
					/>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-semibold">{track.title}</p>
						<p class="truncate text-xs text-muted">{track.artist ?? 'Unknown artist'}</p>
					</div>
					<span class="text-muted md:hidden" aria-hidden="true">
						{#if expanded}
							<ChevronDown class="h-4 w-4" strokeWidth={2} />
						{:else}
							<ChevronUp class="h-4 w-4" strokeWidth={2} />
						{/if}
					</span>
				</button>
				<button
					type="button"
					class={[
						'hidden shrink-0 rounded-full p-1.5 transition sm:inline-flex',
						liked ? 'text-brand-500' : 'text-muted hover:text-primary'
					]}
					onclick={toggleLike}
					aria-label={liked ? 'Unlike' : 'Like'}
					aria-pressed={liked}
				>
					<Heart class="h-4 w-4" strokeWidth={2} fill={liked ? 'currentColor' : 'none'} />
				</button>
			</div>

			<!-- Center controls (desktop) -->
			<div class="hidden flex-col items-center gap-1 md:flex">
				<div class="flex items-center gap-3">
					<button
						type="button"
						class={[
							'rounded-full p-1.5 transition',
							shuffle ? 'text-brand-500' : 'text-muted hover:text-primary'
						]}
						onclick={() => (shuffle = !shuffle)}
						aria-pressed={shuffle}
						aria-label="Shuffle"
					>
						<Shuffle class="h-3.5 w-3.5" strokeWidth={2} />
					</button>
					<button
						type="button"
						class="rounded-full p-1.5 text-primary transition hover:bg-surface-overlay disabled:opacity-30"
						onclick={previous}
						disabled={!canPrevious}
						aria-label="Previous"
					>
						<SkipBack class="h-4 w-4" strokeWidth={2} />
					</button>
					<button
						type="button"
						class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-surface-elevated shadow-sm transition hover:scale-105 dark:bg-white dark:text-zinc-900"
						onclick={toggle}
						aria-label={playing ? 'Pause' : 'Play'}
					>
						{#if playing && !seeking}
							<Pause class="h-4 w-4" fill="currentColor" strokeWidth={0} />
						{:else}
							<Play class="h-4 w-4 translate-x-px" fill="currentColor" strokeWidth={0} />
						{/if}
					</button>
					<button
						type="button"
						class="rounded-full p-1.5 text-primary transition hover:bg-surface-overlay disabled:opacity-30"
						onclick={next}
						disabled={!canNext}
						aria-label="Next"
					>
						<SkipForward class="h-4 w-4" strokeWidth={2} />
					</button>
					<button
						type="button"
						class={[
							'rounded-full p-1.5 transition',
							repeat ? 'text-brand-500' : 'text-muted hover:text-primary'
						]}
						onclick={() => (repeat = !repeat)}
						aria-pressed={repeat}
						aria-label="Repeat"
					>
						<Repeat class="h-3.5 w-3.5" strokeWidth={2} />
					</button>
				</div>
				<div class="flex w-full max-w-md items-center gap-2 px-2">
					<span class="w-8 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted">
						{format(displayTime)}
					</span>
					<div class="group relative h-1 flex-1 rounded-full bg-border">
						<div
							class={[
								'h-full rounded-full bg-brand-500 group-hover:bg-brand-400',
								!seeking && 'transition-[width] duration-100'
							]}
							style:width="{progress * 100}%"
						></div>
						<input
							type="range"
							min="0"
							max={duration || 0}
							step="0.1"
							value={displayTime}
							onpointerdown={onSeekPointerDown}
							onpointerup={onSeekPointerUp}
							onpointercancel={onSeekPointerUp}
							onchange={onSeekPointerUp}
							oninput={onSeekInput}
							class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
							aria-label="Seek"
						/>
					</div>
					<span class="w-8 shrink-0 font-mono text-[10px] tabular-nums text-muted">
						{format(duration)}
					</span>
				</div>
			</div>

			<!-- Right: mobile play + desktop extras -->
			<div class="flex items-center justify-end gap-1 sm:gap-2">
				<button
					type="button"
					class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-surface-elevated md:hidden dark:bg-white dark:text-zinc-900"
					onclick={(e) => {
						e.stopPropagation();
						toggle();
					}}
					aria-label={playing ? 'Pause' : 'Play'}
				>
					{#if playing && !seeking}
						<Pause class="h-4 w-4" fill="currentColor" strokeWidth={0} />
					{:else}
						<Play class="h-4 w-4 translate-x-px" fill="currentColor" strokeWidth={0} />
					{/if}
				</button>

				<button
					type="button"
					class={[
						'hidden rounded-lg p-2 transition sm:inline-flex',
						queueOpen ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-muted hover:bg-surface-overlay hover:text-primary'
					]}
					onclick={() => (queueOpen = !queueOpen)}
					aria-pressed={queueOpen}
					aria-label="Queue"
				>
					<ListMusic class="h-4 w-4" strokeWidth={2} />
				</button>

				<div class="hidden lg:block">
					<VolumeControl variant="compact" bind:value={volume} bind:muted />
				</div>

				<button
					type="button"
					class="hidden rounded-lg p-2 text-muted transition hover:bg-surface-overlay hover:text-primary sm:inline-flex"
					onclick={close}
					aria-label="Close player"
				>
					<X class="h-4 w-4" strokeWidth={2} />
				</button>
			</div>
		</div>
	</div>
{/if}
