<script lang="ts">
	import Playlist from '$lib/components/molecules/Playlist/Playlist.svelte';
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

	interface MusicPlayerProps {
		tracks?: PlaylistTrack[];
		title?: string;
		subtitle?: string;
		index?: number;
		autoplay?: boolean;
		/** Show queue panel */
		showQueue?: boolean;
		class?: string;
		onchange?: (track: PlaylistTrack, index: number) => void;
		onlike?: (track: PlaylistTrack, index: number) => void;
	}

	let {
		tracks = [],
		title = 'Liked Songs',
		subtitle = 'Playlist',
		index = $bindable(0),
		autoplay = false,
		showQueue = true,
		class: className = '',
		onchange,
		onlike
	}: MusicPlayerProps = $props();

	let audio = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);
	let current = $state(0);
	let duration = $state(0);
	let volume = $state(0.85);
	let muted = $state(false);
	let seeking = $state(false);
	let wasPlayingBeforeSeek = $state(false);
	let seekValue = $state(0);
	let shuffle = $state(false);
	let repeat = $state(false);
	let queueOpen = $state(true);
	let liked = $state(false);

	const track = $derived(tracks[index] ?? null);
	const artwork = $derived(
		track?.artwork ||
			'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop'
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

	$effect(() => {
		if (!audio) return;
		audio.volume = muted ? 0 : volume;
		audio.muted = muted;
	});

	$effect(() => {
		liked = Boolean(track?.liked);
	});
</script>

{#if track}
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
{/if}

<div
	class={[
		'overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-lg',
		className
	]}
>
	<div class={['grid', showQueue ? 'lg:grid-cols-[1.15fr_20rem]' : '']}>
		<!-- Now playing -->
		<section class="relative isolate min-h-[28rem] overflow-hidden">
			<!-- Blurred album backdrop -->
			<img
				src={artwork}
				alt=""
				class="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
				aria-hidden="true"
			/>
			<div class="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/75 to-zinc-950"></div>
			<div
				class="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]"
			></div>

			<div class="relative flex h-full flex-col gap-6 p-5 text-white sm:p-7">
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
							{subtitle}
						</p>
						<h2 class="mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
						<p class="mt-0.5 text-sm text-white/50">{tracks.length} tracks</p>
					</div>
					{#if showQueue}
						<button
							type="button"
							class={[
								'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur transition hover:bg-white/10 lg:hidden',
								queueOpen && 'bg-white/15'
							]}
							onclick={() => (queueOpen = !queueOpen)}
							aria-label="Toggle queue"
							aria-pressed={queueOpen}
						>
							<ListMusic class="h-4 w-4" strokeWidth={2} />
						</button>
					{/if}
				</div>

				{#if track}
					<div class="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:items-end sm:justify-start sm:gap-8">
						<div class="relative shrink-0">
							<img
								src={artwork}
								alt=""
								class="h-52 w-52 rounded-2xl object-cover shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/15 sm:h-56 sm:w-56"
							/>
							{#if playing}
								<span
									class="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-zinc-950/80 px-2 py-1 backdrop-blur"
									aria-hidden="true"
								>
									<span class="h-2.5 w-0.5 animate-pulse rounded-full bg-emerald-400"></span>
									<span class="h-3.5 w-0.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:120ms]"></span>
									<span class="h-2 w-0.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:240ms]"></span>
								</span>
							{/if}
						</div>

						<div class="min-w-0 flex-1 text-center sm:pb-2 sm:text-left">
							<p class="truncate text-2xl font-semibold tracking-tight sm:text-3xl">{track.title}</p>
							<p class="mt-1 truncate text-base text-white/65">
								{track.artist ?? 'Unknown artist'}
								{#if track.album}
									<span class="text-white/35"> · {track.album}</span>
								{/if}
							</p>
							<button
								type="button"
								class={[
									'mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
									liked
										? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
										: 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
								]}
								onclick={toggleLike}
								aria-pressed={liked}
							>
								<Heart
									class="h-3.5 w-3.5"
									strokeWidth={2}
									fill={liked ? 'currentColor' : 'none'}
								/>
								{liked ? 'Liked' : 'Like'}
							</button>
						</div>
					</div>

					<div class="space-y-3">
						<div class="group relative pt-1">
							<div class="h-1 overflow-hidden rounded-full bg-white/15">
								<div
									class={[
										'h-full rounded-full bg-white group-hover:bg-emerald-400',
										!seeking && 'transition-[width] duration-100'
									]}
									style:width="{progress * 100}%"
								></div>
							</div>
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
						<div class="flex justify-between font-mono text-[11px] tabular-nums text-white/45">
							<span>{format(displayTime)}</span>
							<span>{format(duration)}</span>
						</div>

						<div class="flex items-center justify-between gap-2">
							<button
								type="button"
								class={[
									'flex h-10 w-10 items-center justify-center rounded-full transition',
									shuffle
										? 'bg-emerald-400/15 text-emerald-300'
										: 'text-white/55 hover:bg-white/10 hover:text-white'
								]}
								onclick={() => (shuffle = !shuffle)}
								aria-pressed={shuffle}
								aria-label="Shuffle"
							>
								<Shuffle class="h-4 w-4" strokeWidth={2} />
							</button>

							<div class="flex items-center gap-3">
								<button
									type="button"
									class="flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 disabled:opacity-30"
									onclick={previous}
									disabled={!canPrevious}
									aria-label="Previous track"
								>
									<SkipBack class="h-5 w-5" strokeWidth={2} />
								</button>
								<button
									type="button"
									class="flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-950 shadow-xl transition hover:scale-[1.04] active:scale-95"
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
									class="flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 disabled:opacity-30"
									onclick={next}
									disabled={!canNext}
									aria-label="Next track"
								>
									<SkipForward class="h-5 w-5" strokeWidth={2} />
								</button>
							</div>

							<button
								type="button"
								class={[
									'flex h-10 w-10 items-center justify-center rounded-full transition',
									repeat
										? 'bg-emerald-400/15 text-emerald-300'
										: 'text-white/55 hover:bg-white/10 hover:text-white'
								]}
								onclick={() => (repeat = !repeat)}
								aria-pressed={repeat}
								aria-label="Repeat"
							>
								<Repeat class="h-4 w-4" strokeWidth={2} />
							</button>
						</div>

						<div class="flex justify-end">
							<VolumeControl
								variant="compact"
								bind:value={volume}
								bind:muted
								class="[&_button]:text-white/70 [&_button:hover]:bg-white/10 [&_button:hover]:text-white [&_input]:accent-white"
							/>
						</div>
					</div>
				{:else}
					<p class="py-16 text-center text-sm text-white/50">No track selected</p>
				{/if}
			</div>
		</section>

		{#if showQueue}
			<aside
				class={[
					'border-t border-border bg-surface-elevated lg:border-l lg:border-t-0',
					!queueOpen && 'hidden lg:block'
				]}
			>
				<div class="flex items-center justify-between border-b border-border px-4 py-3">
					<div>
						<p class="text-xs font-semibold uppercase tracking-wide text-muted">Queue</p>
						<p class="text-[11px] text-muted">{tracks.length} songs</p>
					</div>
				</div>
				<div class="max-h-[32rem] overflow-y-auto">
					<Playlist
						{tracks}
						activeId={track?.id ?? ''}
						{playing}
						density="compact"
						class="rounded-none border-0 shadow-none"
						onselect={(_, i) => select(i)}
					/>
				</div>
			</aside>
		{/if}
	</div>
</div>
