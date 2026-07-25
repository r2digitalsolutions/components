<script lang="ts">
	interface AudioPlayerProps {
		src?: string;
		title?: string;
		class?: string;
	}

	let { src = '', title = 'Audio', class: className = '' }: AudioPlayerProps = $props();

	let audio = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);
	let current = $state(0);
	let duration = $state(0);
	let muted = $state(false);

	function toggle() {
		if (!audio) return;
		if (playing) audio.pause();
		else void audio.play();
	}

	function format(t: number) {
		if (!Number.isFinite(t)) return '0:00';
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	function seek(e: Event) {
		const el = e.currentTarget as HTMLInputElement;
		if (!audio) return;
		audio.currentTime = Number(el.value);
		current = audio.currentTime;
	}
</script>

<div
	class={['flex w-full max-w-md items-center gap-3 rounded-2xl border border-border bg-surface-elevated px-3 py-2.5', className]}
>
	<audio
		bind:this={audio}
		{src}
		preload="metadata"
		onplay={() => (playing = true)}
		onpause={() => (playing = false)}
		ontimeupdate={() => (current = audio?.currentTime ?? 0)}
		onloadedmetadata={() => (duration = audio?.duration ?? 0)}
	></audio>

	<button
		type="button"
		class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white"
		onclick={toggle}
		aria-label={playing ? 'Pause' : 'Play'}
	>
		{#if playing}
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
		{:else}
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
		{/if}
	</button>

	<div class="min-w-0 flex-1 space-y-1">
		<p class="truncate text-sm font-medium text-primary">{title}</p>
		<input
			type="range"
			min="0"
			max={duration || 0}
			step="0.1"
			value={current}
			oninput={seek}
			class="w-full accent-brand-500"
			aria-label="Seek"
		/>
		<div class="flex justify-between text-[10px] text-muted">
			<span>{format(current)}</span>
			<span>{format(duration)}</span>
		</div>
	</div>

	<button
		type="button"
		class="rounded-lg p-2 text-secondary hover:bg-surface-overlay"
		onclick={() => {
			muted = !muted;
			if (audio) audio.muted = muted;
		}}
		aria-label={muted ? 'Unmute' : 'Mute'}
	>
		{#if muted}🔇{:else}🔊{/if}
	</button>
</div>
