<script lang="ts">
	interface VideoPlayerProps {
		src?: string;
		poster?: string;
		title?: string;
		class?: string;
	}

	let {
		src = '',
		poster,
		title = 'Video',
		class: className = ''
	}: VideoPlayerProps = $props();

	let video = $state<HTMLVideoElement | null>(null);
	let playing = $state(false);
	let current = $state(0);
	let duration = $state(0);

	function toggle() {
		if (!video) return;
		if (playing) video.pause();
		else void video.play();
	}

	function seek(e: Event) {
		const el = e.currentTarget as HTMLInputElement;
		if (!video) return;
		video.currentTime = Number(el.value);
	}

	function format(t: number) {
		if (!Number.isFinite(t)) return '0:00';
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		return `${m}:${String(s).padStart(2, '0')}`;
	}
</script>

<div class={['overflow-hidden rounded-2xl border border-border bg-zinc-950', className]}>
	<div class="relative">
		<video
			bind:this={video}
			class="aspect-video w-full"
			{src}
			{poster}
			playsinline
			onplay={() => (playing = true)}
			onpause={() => (playing = false)}
			ontimeupdate={() => (current = video?.currentTime ?? 0)}
			onloadedmetadata={() => (duration = video?.duration ?? 0)}
			onclick={toggle}
		>
			<track kind="captions" />
		</video>
		{#if !playing}
			<button
				type="button"
				class="absolute inset-0 flex items-center justify-center bg-black/20"
				onclick={toggle}
				aria-label="Play {title}"
			>
				<span class="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-zinc-900">
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
				</span>
			</button>
		{/if}
	</div>
	<div class="flex items-center gap-3 bg-surface-elevated px-3 py-2">
		<button type="button" class="text-sm text-primary" onclick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
			{playing ? 'Pause' : 'Play'}
		</button>
		<input type="range" min="0" max={duration || 0} step="0.1" value={current} oninput={seek} class="flex-1 accent-brand-500" />
		<span class="text-xs text-muted">{format(current)} / {format(duration)}</span>
	</div>
</div>
