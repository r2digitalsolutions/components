<script lang="ts">
	import Marquee from './Marquee.svelte';
	import type { MarqueeSeparator } from './Marquee.svelte';

	let {
		example = 'ticker',
		speed = 28,
		separator = 'dot'
	}: {
		example?: 'ticker' | 'logos' | 'reverse' | 'announcement' | 'dash';
		speed?: number;
		separator?: MarqueeSeparator;
	} = $props();

	const logos = [
		{ name: 'Acme', hue: 'from-zinc-700 to-zinc-900' },
		{ name: 'Nova', hue: 'from-brand-500 to-brand-700' },
		{ name: 'Pulse', hue: 'from-emerald-500 to-teal-700' },
		{ name: 'Orbit', hue: 'from-sky-500 to-indigo-600' },
		{ name: 'Ledger', hue: 'from-amber-500 to-orange-600' },
		{ name: 'Kinetic', hue: 'from-rose-500 to-fuchsia-600' }
	];

	const chips = [
		'Atomic Design',
		'Svelte 5',
		'Tailwind 4',
		'Accessible',
		'Themeable',
		'Storybook'
	];
</script>

{#if example === 'logos'}
	<div class="w-full max-w-2xl space-y-3">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Logo strip</p>
			<p class="text-xs text-secondary">Sin separador automático (contenido custom).</p>
		</div>
		<div class="rounded-2xl border border-border bg-surface-elevated py-5 shadow-sm">
			<Marquee {speed} gap="lg" separator="none">
				{#each logos as logo (logo.name)}
					<span class="inline-flex items-center gap-2.5">
						<span
							class={[
								'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-sm',
								logo.hue
							]}
						>
							{logo.name.slice(0, 1)}
						</span>
						<span class="text-sm font-semibold tracking-tight text-secondary">
							{logo.name}
						</span>
					</span>
				{/each}
			</Marquee>
		</div>
	</div>
{:else if example === 'reverse'}
	<div class="w-full max-w-2xl space-y-3">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Reverse + pipe</p>
			<p class="text-xs text-secondary">
				<code class="rounded bg-surface-overlay px-1 text-[10px]">separator="pipe"</code>
			</p>
		</div>
		<div class="rounded-2xl border border-border bg-surface-elevated py-4 shadow-sm">
			<Marquee {speed} direction="right" items={chips} separator="pipe" />
		</div>
	</div>
{:else if example === 'dash'}
	<div class="w-full max-w-2xl space-y-3">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Dash separator</p>
			<p class="text-xs text-secondary">
				<code class="rounded bg-surface-overlay px-1 text-[10px]">separator="dash"</code>
			</p>
		</div>
		<div class="rounded-2xl border border-border bg-surface-elevated py-4 shadow-sm">
			<Marquee {speed} items={chips} separator="dash" />
		</div>
	</div>
{:else if example === 'announcement'}
	<div class="w-full max-w-2xl space-y-3">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Announcement bar</p>
			<p class="text-xs text-secondary">Bullet separator entre frases.</p>
		</div>
		<div
			class="overflow-hidden rounded-xl border border-brand-200/70 bg-brand-50 py-2.5 dark:border-brand-900/50 dark:bg-brand-950/40"
		>
			<Marquee
				speed={speed * 0.85}
				gap="md"
				separator="bullet"
				items={[
					'v2 components are live',
					'Audio, Video & MusicPlayer',
					'Docs updated in Storybook',
					'Read the changelog'
				]}
				class="[&_span]:text-brand-950 dark:[&_span]:text-brand-50 [&_.text-muted]:text-brand-400"
			/>
		</div>
	</div>
{:else}
	<div class="w-full max-w-2xl space-y-3">
		<div class="space-y-1">
			<p class="text-sm font-semibold text-primary">Marquee</p>
			<p class="text-xs text-secondary">
				Usa <code class="rounded bg-surface-overlay px-1 text-[10px]">items</code> +
				<code class="rounded bg-surface-overlay px-1 text-[10px]">separator</code>
				(dot, bullet, dash, pipe, none).
			</p>
		</div>
		<div class="rounded-2xl border border-border bg-surface-elevated py-4 shadow-sm">
			<Marquee {speed} items={chips} {separator} />
		</div>
	</div>
{/if}
