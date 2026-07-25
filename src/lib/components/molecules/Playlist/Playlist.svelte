<script lang="ts">
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';

	export interface PlaylistTrack {
		id: string;
		title: string;
		artist?: string;
		src: string;
		artwork?: string;
		durationLabel?: string;
	}

	interface PlaylistProps {
		tracks?: PlaylistTrack[];
		activeId?: string;
		playing?: boolean;
		class?: string;
		onselect?: (track: PlaylistTrack, index: number) => void;
	}

	let {
		tracks = [],
		activeId = '',
		playing = false,
		class: className = '',
		onselect
	}: PlaylistProps = $props();
</script>

<div
	class={[
		'overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
	role="listbox"
	aria-label="Playlist"
>
	<ul class="divide-y divide-border">
		{#each tracks as track, i (track.id)}
			{@const active = track.id === activeId}
			<li>
				<button
					type="button"
					role="option"
					aria-selected={active}
					class={[
						'flex w-full items-center gap-3 px-3 py-2.5 text-left transition',
						active ? 'bg-brand-50 dark:bg-brand-950/30' : 'hover:bg-surface-overlay'
					]}
					onclick={() => onselect?.(track, i)}
				>
					<span
						class={[
							'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium tabular-nums',
							active
								? 'bg-brand-500 text-white'
								: 'bg-surface-overlay text-muted'
						]}
					>
						{#if active && playing}
							<Pause class="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
						{:else if active}
							<Play class="h-3.5 w-3.5 translate-x-px" fill="currentColor" strokeWidth={0} />
						{:else}
							{i + 1}
						{/if}
					</span>

					{#if track.artwork}
						<img
							src={track.artwork}
							alt=""
							class="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
						/>
					{/if}

					<span class="min-w-0 flex-1">
						<span
							class={[
								'block truncate text-sm font-medium',
								active ? 'text-brand-700 dark:text-brand-300' : 'text-primary'
							]}
						>
							{track.title}
						</span>
						{#if track.artist}
							<span class="block truncate text-xs text-muted">{track.artist}</span>
						{/if}
					</span>

					{#if track.durationLabel}
						<span class="shrink-0 font-mono text-[11px] tabular-nums text-muted"
							>{track.durationLabel}</span
						>
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</div>
