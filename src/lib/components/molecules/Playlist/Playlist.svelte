<script lang="ts">
	import type { Snippet } from 'svelte';
	import Heart from '@lucide/svelte/icons/heart';
	import ListMusic from '@lucide/svelte/icons/list-music';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';

	export interface PlaylistTrack {
		id: string;
		title: string;
		artist?: string;
		album?: string;
		src: string;
		artwork?: string;
		durationLabel?: string;
		explicit?: boolean;
		liked?: boolean;
	}

	interface PlaylistProps {
		tracks?: PlaylistTrack[];
		activeId?: string;
		playing?: boolean;
		/** Playlist title in the header */
		title?: string;
		subtitle?: string;
		/**
		 * comfortable — artwork + generous padding
		 * compact — denser rows
		 * minimal — no artwork column
		 */
		density?: 'comfortable' | 'compact' | 'minimal';
		/** Show # / play column */
		numbered?: boolean;
		showArtwork?: boolean;
		showAlbum?: boolean;
		showHeader?: boolean;
		/** Max height; enables internal scroll */
		maxHeight?: string;
		emptyLabel?: string;
		class?: string;
		headerActions?: Snippet;
		/** Extra controls per row (e.g. more menu) */
		rowActions?: Snippet<[PlaylistTrack, number]>;
		onselect?: (track: PlaylistTrack, index: number) => void;
		onlike?: (track: PlaylistTrack, index: number) => void;
	}

	let {
		tracks = [],
		activeId = '',
		playing = false,
		title = '',
		subtitle = '',
		density = 'comfortable',
		numbered = true,
		showArtwork = true,
		showAlbum = false,
		showHeader = false,
		maxHeight = '',
		emptyLabel = 'No tracks yet',
		class: className = '',
		headerActions,
		rowActions,
		onselect,
		onlike
	}: PlaylistProps = $props();

	const resolvedShowHeader = $derived(showHeader || Boolean(title) || Boolean(headerActions));
	const padY = $derived(density === 'compact' ? 'py-1.5' : 'py-2.5');
	const artSize = $derived(density === 'compact' ? 'h-8 w-8' : 'h-10 w-10');
</script>

<div
	class={[
		'flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
	role="listbox"
	aria-label={title || 'Playlist'}
>
	{#if resolvedShowHeader}
		<div class="flex shrink-0 items-center gap-3 border-b border-border px-3.5 py-3">
			<span
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-500/10 dark:bg-brand-950/50 dark:text-brand-300"
				aria-hidden="true"
			>
				<ListMusic class="h-4 w-4" strokeWidth={2} />
			</span>
			<div class="min-w-0 flex-1">
				{#if title}
					<p class="truncate text-sm font-semibold text-primary">{title}</p>
				{/if}
				<p class="truncate text-[11px] text-muted">
					{subtitle || `${tracks.length} track${tracks.length === 1 ? '' : 's'}`}
				</p>
			</div>
			{#if headerActions}
				<div class="flex shrink-0 items-center gap-1">
					{@render headerActions()}
				</div>
			{/if}
		</div>
	{/if}

	{#if tracks.length === 0}
		<div class="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
			<ListMusic class="h-8 w-8 text-muted opacity-40" strokeWidth={1.5} />
			<p class="text-sm text-muted">{emptyLabel}</p>
		</div>
	{:else}
		<ul
			class="min-h-0 flex-1 divide-y divide-border overflow-y-auto"
			style:max-height={maxHeight || undefined}
		>
			{#each tracks as track, i (track.id)}
				{@const active = track.id === activeId}
				<li>
					<div
						class={[
							'group flex w-full items-center gap-2.5 px-2.5 text-left transition sm:gap-3 sm:px-3',
							padY,
							active
								? 'bg-brand-50/90 dark:bg-brand-950/35'
								: 'hover:bg-surface-overlay'
						]}
					>
						{#if numbered}
							<button
								type="button"
								role="option"
								aria-selected={active}
								aria-label={active && playing ? `Pause ${track.title}` : `Play ${track.title}`}
								class={[
									'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium tabular-nums transition',
									active
										? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
										: 'bg-surface-overlay text-muted group-hover:bg-surface-elevated group-hover:text-primary'
								]}
								onclick={() => onselect?.(track, i)}
							>
								{#if active && playing}
									<span class="playlist-eq flex h-3.5 items-end gap-0.5" aria-hidden="true">
										<span class="w-0.5 rounded-full bg-current"></span>
										<span class="w-0.5 rounded-full bg-current"></span>
										<span class="w-0.5 rounded-full bg-current"></span>
									</span>
								{:else if active}
									<Play class="h-3.5 w-3.5 translate-x-px" fill="currentColor" strokeWidth={0} />
								{:else}
									<span class="group-hover:hidden">{i + 1}</span>
									<Play
										class="hidden h-3.5 w-3.5 translate-x-px group-hover:block"
										fill="currentColor"
										strokeWidth={0}
									/>
								{/if}
							</button>
						{/if}

						{#if showArtwork && density !== 'minimal'}
							<button
								type="button"
								class="relative shrink-0 overflow-hidden rounded-lg ring-1 ring-border"
								onclick={() => onselect?.(track, i)}
								aria-label={`Play ${track.title}`}
							>
								{#if track.artwork}
									<img
										src={track.artwork}
										alt=""
										class={['object-cover', artSize]}
									/>
								{:else}
									<span
										class={[
											'flex items-center justify-center bg-surface-overlay text-muted',
											artSize
										]}
									>
										<ListMusic class="h-4 w-4" strokeWidth={1.75} />
									</span>
								{/if}
								{#if active && playing}
									<span
										class="absolute inset-0 flex items-center justify-center bg-black/35"
										aria-hidden="true"
									>
										<Pause class="h-3.5 w-3.5 text-white" fill="currentColor" strokeWidth={0} />
									</span>
								{/if}
							</button>
						{/if}

						<button
							type="button"
							role="option"
							aria-selected={active}
							class="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
							onclick={() => onselect?.(track, i)}
						>
							<span class="flex min-w-0 items-center gap-1.5">
								<span
									class={[
										'truncate text-sm font-medium',
										active ? 'text-brand-700 dark:text-brand-300' : 'text-primary'
									]}
								>
									{track.title}
								</span>
								{#if track.explicit}
									<span
										class="shrink-0 rounded px-1 py-px text-[9px] font-bold uppercase tracking-wide text-muted ring-1 ring-border"
										title="Explicit"
									>
										E
									</span>
								{/if}
							</span>
							{#if track.artist}
								<span class="mt-0.5 block truncate text-xs text-muted">
									{track.artist}{#if showAlbum && track.album && density !== 'comfortable'}
										{' · '}{track.album}{/if}
								</span>
							{:else if showAlbum && track.album && density !== 'comfortable'}
								<span class="mt-0.5 block truncate text-xs text-muted">{track.album}</span>
							{/if}
						</button>

						{#if showAlbum && density === 'comfortable' && track.album}
							<span class="hidden min-w-0 max-w-[8rem] flex-1 truncate text-xs text-muted lg:block">
								{track.album}
							</span>
						{/if}

						{#if onlike}
							<button
								type="button"
								class={[
									'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition',
									track.liked
										? 'text-brand-500'
										: 'text-muted opacity-0 hover:bg-surface-overlay hover:text-primary group-hover:opacity-100 focus-visible:opacity-100',
									track.liked && 'opacity-100'
								]}
								aria-label={track.liked ? 'Unlike' : 'Like'}
								aria-pressed={Boolean(track.liked)}
								onclick={() => onlike(track, i)}
							>
								<Heart
									class="h-3.5 w-3.5"
									fill={track.liked ? 'currentColor' : 'none'}
									strokeWidth={2}
								/>
							</button>
						{/if}

						{#if track.durationLabel}
							<span class="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted">
								{track.durationLabel}
							</span>
						{/if}

						{#if rowActions}
							<div class="flex shrink-0 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
								{@render rowActions(track, i)}
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.playlist-eq span:nth-child(1) {
		height: 40%;
		animation: playlist-eq 0.9s ease-in-out infinite;
	}
	.playlist-eq span:nth-child(2) {
		height: 100%;
		animation: playlist-eq 0.9s ease-in-out infinite 0.15s;
	}
	.playlist-eq span:nth-child(3) {
		height: 65%;
		animation: playlist-eq 0.9s ease-in-out infinite 0.3s;
	}

	@keyframes playlist-eq {
		0%,
		100% {
			transform: scaleY(0.45);
		}
		50% {
			transform: scaleY(1);
		}
	}
</style>
