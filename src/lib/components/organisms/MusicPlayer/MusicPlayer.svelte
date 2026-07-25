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

	interface MusicPlayerProps {
		tracks?: PlaylistTrack[];
		title?: string;
		subtitle?: string;
		/** Start index */
		index?: number;
		autoplay?: boolean;
		class?: string;
		onchange?: (track: PlaylistTrack, index: number) => void;
	}

	let {
		tracks = [],
		title = 'Liked Songs',
		subtitle = 'Playlist',
		index = $bindable(0),
		autoplay = false,
		class: className = '',
		onchange
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
	let showList = $state(true);

	const track = $derived(tracks[index] ?? null);
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
		onchange?.(tracks[i], i);
		if (play) {
			requestAnimationFrame(() => void audio?.play());
		}
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

	$effect(() => {
		if (!audio) return;
		audio.volume = muted ? 0 : volume;
		audio.muted = muted;
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
		'overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	<div class="grid lg:grid-cols-[1fr_20rem]">
		<!-- Now playing -->
		<div
			class="relative flex flex-col justify-end gap-5 bg-gradient-to-br from-brand-600 via-brand-700 to-zinc-900 p-5 text-white sm:p-6"
		>
			<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_55%)]"></div>

			<div class="relative flex items-start justify-between gap-3">
				<div>
					<p class="text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
						{subtitle}
					</p>
					<h2 class="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
					<p class="mt-1 text-sm text-white/65">{tracks.length} songs</p>
				</div>
				<button
					type="button"
					class={[
						'flex h-9 w-9 items-center justify-center rounded-lg transition lg:hidden',
						showList ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
					]}
					onclick={() => (showList = !showList)}
					aria-label="Toggle playlist"
				>
					<ListMusic class="h-4 w-4" strokeWidth={2} />
				</button>
			</div>

			{#if track}
				<div class="relative flex flex-col items-center gap-4 sm:flex-row sm:items-end">
					<img
						src={track.artwork ||
							'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop'}
						alt=""
						class="h-40 w-40 rounded-xl object-cover shadow-2xl ring-1 ring-white/20 sm:h-44 sm:w-44"
					/>
					<div class="min-w-0 flex-1 text-center sm:pb-1 sm:text-left">
						<p class="truncate text-lg font-semibold sm:text-xl">{track.title}</p>
						<p class="truncate text-sm text-white/70">{track.artist ?? 'Unknown artist'}</p>
					</div>
				</div>

				<div class="relative space-y-2">
					<div class="relative">
						<div class="h-1.5 overflow-hidden rounded-full bg-white/20">
							<div
								class={['h-full rounded-full bg-white', !seeking && 'transition-[width] duration-100']}
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
							class="absolute inset-0 h-1.5 w-full cursor-pointer opacity-0"
							aria-label="Seek"
						/>
					</div>
					<div class="flex justify-between font-mono text-[11px] tabular-nums text-white/60">
						<span>{format(displayTime)}</span>
						<span>{format(duration)}</span>
					</div>

					<div class="flex items-center justify-between gap-2 pt-1">
						<button
							type="button"
							class={[
								'flex h-9 w-9 items-center justify-center rounded-lg transition',
								shuffle ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
							]}
							onclick={() => (shuffle = !shuffle)}
							aria-pressed={shuffle}
							aria-label="Shuffle"
						>
							<Shuffle class="h-4 w-4" strokeWidth={2} />
						</button>

						<div class="flex items-center gap-2">
							<button
								type="button"
								class="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 disabled:opacity-30"
								onclick={previous}
								disabled={!canPrevious}
								aria-label="Previous track"
							>
								<SkipBack class="h-5 w-5" strokeWidth={2} />
							</button>
							<button
								type="button"
								class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-900 shadow-lg transition hover:scale-105"
								onclick={toggle}
								aria-label={playing ? 'Pause' : 'Play'}
							>
								{#if playing && !seeking}
									<Pause class="h-5 w-5" fill="currentColor" strokeWidth={0} />
								{:else}
									<Play class="h-5 w-5 translate-x-px" fill="currentColor" strokeWidth={0} />
								{/if}
							</button>
							<button
								type="button"
								class="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 disabled:opacity-30"
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
								'flex h-9 w-9 items-center justify-center rounded-lg transition',
								repeat ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
							]}
							onclick={() => (repeat = !repeat)}
							aria-pressed={repeat}
							aria-label="Repeat"
						>
							<Repeat class="h-4 w-4" strokeWidth={2} />
						</button>
					</div>

					<div class="flex justify-end pt-1">
						<VolumeControl
							variant="compact"
							bind:value={volume}
							bind:muted
							class="[&_button]:text-white/80 [&_button:hover]:bg-white/10 [&_button:hover]:text-white [&_input]:accent-white"
						/>
					</div>
				</div>
			{/if}
		</div>

		<!-- Queue -->
		<div class={['border-t border-border lg:border-l lg:border-t-0', !showList && 'hidden lg:block']}>
			<div class="border-b border-border px-4 py-3">
				<p class="text-xs font-semibold uppercase tracking-wide text-muted">Queue</p>
			</div>
			<div class="max-h-[28rem] overflow-y-auto">
				<Playlist
					{tracks}
					activeId={track?.id ?? ''}
					{playing}
					class="rounded-none border-0 shadow-none"
					onselect={(_, i) => select(i)}
				/>
			</div>
		</div>
	</div>
</div>
