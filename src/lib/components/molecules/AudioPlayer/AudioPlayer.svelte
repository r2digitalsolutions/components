<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import VolumeControl from '$lib/components/molecules/VolumeControl/VolumeControl.svelte';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import SkipBack from '@lucide/svelte/icons/skip-back';
	import SkipForward from '@lucide/svelte/icons/skip-forward';

	interface AudioPlayerProps {
		src?: string;
		title?: string;
		artist?: string;
		artwork?: string;
		/** compact = single row; full = card with artwork */
		variant?: 'compact' | 'full';
		autoplay?: boolean;
		loop?: boolean;
		/** Show previous / next track buttons */
		showTrackControls?: boolean;
		canPrevious?: boolean;
		canNext?: boolean;
		class?: string;
		onplay?: () => void;
		onpause?: () => void;
		onended?: () => void;
		/** Go to previous track in a playlist */
		onprevious?: () => void;
		/** Go to next track in a playlist */
		onnext?: () => void;
	}

	let {
		src = '',
		title = 'Audio',
		artist = '',
		artwork = '',
		variant = 'full',
		autoplay = false,
		loop = false,
		showTrackControls = true,
		canPrevious = true,
		canNext = true,
		class: className = '',
		onplay,
		onpause,
		onended,
		onprevious,
		onnext
	}: AudioPlayerProps = $props();

	let audio = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);
	let current = $state(0);
	let duration = $state(0);
	let volume = $state(1);
	let muted = $state(false);
	let seeking = $state(false);
	let wasPlayingBeforeSeek = $state(false);
	let seekValue = $state(0);

	const displayTime = $derived(seeking ? seekValue : current);

	function format(t: number) {
		if (!Number.isFinite(t) || t < 0) return '0:00';
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	function toggle() {
		if (!audio) return;
		if (audio.paused) void audio.play();
		else audio.pause();
	}

	function previous() {
		// If >3s into track, restart; else previous track (Spotify-like)
		if (audio && audio.currentTime > 3) {
			audio.currentTime = 0;
			current = 0;
			return;
		}
		onprevious?.();
	}

	function next() {
		onnext?.();
	}

	function onSeekPointerDown() {
		if (!audio) return;
		seeking = true;
		wasPlayingBeforeSeek = !audio.paused;
		seekValue = audio.currentTime;
		if (wasPlayingBeforeSeek) audio.pause();
	}

	/** Only update UI while dragging — never touch audio.currentTime (avoids lag). */
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

	$effect(() => {
		if (!audio) return;
		audio.volume = muted ? 0 : volume;
		audio.muted = muted;
	});

	// Reset clock when src changes
	$effect(() => {
		src;
		current = 0;
		duration = 0;
		seekValue = 0;
		seeking = false;
	});
</script>

<audio
	bind:this={audio}
	{src}
	{loop}
	{autoplay}
	preload="metadata"
	onplay={() => {
		playing = true;
		onplay?.();
	}}
	onpause={() => {
		playing = false;
		onpause?.();
	}}
	onended={() => {
		playing = false;
		onended?.();
	}}
	ontimeupdate={() => {
		if (!seeking) current = audio?.currentTime ?? 0;
	}}
	onloadedmetadata={() => (duration = audio?.duration ?? 0)}
></audio>

{#if variant === 'compact'}
	<div
		class={[
			'flex w-full items-center gap-2.5 rounded-2xl border border-border bg-surface-elevated px-2.5 py-2 shadow-sm',
			className
		]}
	>
		<button
			type="button"
			class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm transition hover:bg-brand-600"
			onclick={toggle}
			aria-label={playing ? 'Pause' : 'Play'}
		>
			{#if playing && !seeking}
				<Pause class="h-4 w-4" fill="currentColor" strokeWidth={0} />
			{:else}
				<Play class="h-4 w-4 translate-x-px" fill="currentColor" strokeWidth={0} />
			{/if}
		</button>

		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-medium text-primary">{title}</p>
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
				class="mt-1 h-1.5 w-full cursor-pointer accent-brand-500"
				aria-label="Seek"
			/>
		</div>

		<span class="shrink-0 font-mono text-[10px] tabular-nums text-muted">{format(displayTime)}</span>
		<VolumeControl variant="compact" bind:value={volume} bind:muted class="hidden sm:flex" />
	</div>
{:else}
	<Card class={className || undefined} padding="none" chrome>
		{#snippet header()}
			<div class="flex items-center gap-3 px-4 py-3 sm:px-5">
				{#if artwork}
					<img
						src={artwork}
						alt=""
						class="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-border"
					/>
				{:else}
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"
					>
						<Play class="h-5 w-5" strokeWidth={2} />
					</div>
				{/if}
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-semibold text-primary">{title}</p>
					{#if artist}
						<p class="truncate text-xs text-muted">{artist}</p>
					{/if}
				</div>
				<span
					class={[
						'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
						seeking
							? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
							: playing
								? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
								: 'bg-surface-overlay text-muted'
					]}
				>
					{seeking ? 'Seeking' : playing ? 'Playing' : 'Paused'}
				</span>
			</div>
		{/snippet}

		<div class="space-y-3 px-4 py-3 sm:px-5">
			<div>
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
					class="h-1.5 w-full cursor-pointer accent-brand-500"
					aria-label="Seek"
				/>
				<div class="mt-1 flex justify-between font-mono text-[11px] tabular-nums text-muted">
					<span>{format(displayTime)}</span>
					<span>{format(duration)}</span>
				</div>
			</div>

			<div class="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
				<div aria-hidden="true"></div>

				<div class="flex items-center justify-center gap-1">
					{#if showTrackControls}
						<button
							type="button"
							class="flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-surface-overlay hover:text-primary disabled:opacity-30"
							onclick={previous}
							disabled={!canPrevious && displayTime <= 3}
							aria-label="Previous track"
						>
							<SkipBack class="h-4 w-4" strokeWidth={2} />
						</button>
					{/if}

					<button
						type="button"
						class="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm transition hover:bg-brand-600"
						onclick={toggle}
						aria-label={playing ? 'Pause' : 'Play'}
					>
						{#if playing && !seeking}
							<Pause class="h-5 w-5" fill="currentColor" strokeWidth={0} />
						{:else}
							<Play class="h-5 w-5 translate-x-px" fill="currentColor" strokeWidth={0} />
						{/if}
					</button>

					{#if showTrackControls}
						<button
							type="button"
							class="flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-surface-overlay hover:text-primary disabled:opacity-30"
							onclick={next}
							disabled={!canNext}
							aria-label="Next track"
						>
							<SkipForward class="h-4 w-4" strokeWidth={2} />
						</button>
					{/if}
				</div>

				<VolumeControl variant="compact" bind:value={volume} bind:muted />
			</div>
		</div>
	</Card>
{/if}
