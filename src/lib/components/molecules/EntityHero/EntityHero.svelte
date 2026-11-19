<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface EntityHeroStat {
		label: string;
		value: string | number;
	}

	interface EntityHeroProps {
		/** Name of the business, project, profile… */
		title: string;
		/** One line under the title (category · address…). */
		subtitle?: string;
		/** Cover image URL. Without it a soft brand gradient is drawn. */
		cover?: string;
		/** Avatar/logo image URL. */
		avatar?: string;
		/** Fallback text inside the avatar tile (defaults to the title initials). */
		initials?: string;
		/** Key numbers on the right (desktop) / under the title (mobile). */
		stats?: EntityHeroStat[];
		/** Hide the cover band (compact header). */
		compact?: boolean;
		class?: string;
		/** Status badges next to the title. */
		badges?: Snippet;
		/** Extra content in the subtitle line (e.g. «Abierto ahora»). */
		meta?: Snippet;
		/** Buttons on the right (Share, QR, Edit…). */
		actions?: Snippet;
	}

	const {
		title,
		subtitle,
		cover,
		avatar,
		initials,
		stats = [],
		compact = false,
		class: className = '',
		badges,
		meta,
		actions
	}: EntityHeroProps = $props();

	const fallback = $derived(
		initials ??
			title
				.split(/\s+/)
				.filter(Boolean)
				.slice(0, 2)
				.map((w) => w[0]?.toUpperCase() ?? '')
				.join('')
	);
</script>

<section
	class={[
		'rounded-2xl border-border bg-surface-elevated shadow-sm overflow-hidden border',
		className
	]}
>
	{#if !compact}
		<div
			class="entity-hero-cover h-16 sm:h-20 bg-cover bg-center"
			style={cover ? `background-image:url(${JSON.stringify(cover)})` : undefined}
			aria-hidden="true"
		></div>
	{/if}
	<div
		class={['gap-4 px-4 pb-4 sm:px-5 lg:flex-row lg:items-end flex flex-col', compact && 'pt-4']}
	>
		<div class="min-w-0 gap-4 flex flex-1 items-start">
			<span
				class={[
					'rounded-2xl bg-brand-600 font-bold text-white flex shrink-0 items-center justify-center overflow-hidden',
					compact
						? 'h-12 w-12 text-base'
						: '-mt-8 border-surface-elevated text-xl shadow-md h-[4.25rem] w-[4.25rem] border-4'
				]}
			>
				{#if avatar}<img
						src={avatar}
						alt=""
						class="h-full w-full object-cover"
					/>{:else}{fallback}{/if}
			</span>
			<div class={['min-w-0', !compact && 'pt-2.5']}>
				<div class="gap-2 flex flex-wrap items-center">
					<h1 class="text-xl font-bold tracking-tight text-primary truncate">{title}</h1>
					{#if badges}{@render badges()}{/if}
				</div>
				{#if subtitle || meta}
					<p class="mt-0.5 text-sm text-muted truncate">
						{subtitle}{#if subtitle && meta}<span aria-hidden="true">
								·
							</span>{/if}{#if meta}{@render meta()}{/if}
					</p>
				{/if}
			</div>
		</div>
		{#if stats.length}
			<div class="lg:pb-1 flex shrink-0 overflow-x-auto">
				{#each stats as stat, i (stat.label)}
					<div
						class={[
							'px-4',
							i === 0 ? 'pl-0 lg:border-l lg:border-border lg:pl-4' : 'border-border border-l'
						]}
					>
						<p class="text-lg font-bold leading-tight tracking-tight text-primary">{stat.value}</p>
						<p class="text-xs text-muted whitespace-nowrap">{stat.label}</p>
					</div>
				{/each}
			</div>
		{/if}
		{#if actions}<div class="gap-2 lg:pb-1 flex shrink-0 flex-wrap">{@render actions()}</div>{/if}
	</div>
</section>

<style>
	.entity-hero-cover {
		background-color: var(--color-brand-200);
		background-image:
			radial-gradient(
				circle at 18% 30%,
				color-mix(in oklab, #f0c98f 70%, transparent) 0,
				transparent 42%
			),
			radial-gradient(
				circle at 72% 60%,
				color-mix(in oklab, var(--color-brand-300) 80%, transparent) 0,
				transparent 48%
			),
			linear-gradient(120deg, #c9a77c, var(--color-brand-400) 58%, var(--color-brand-600));
	}
</style>
