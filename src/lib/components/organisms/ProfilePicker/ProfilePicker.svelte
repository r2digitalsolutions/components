<script lang="ts">
	import type { Snippet } from 'svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Search from '@lucide/svelte/icons/search';
	import Input from '$lib/components/atoms/Input/Input.svelte';

	export interface ProfilePickerItem {
		id: string;
		name: string;
		/** Role, plan, category… */
		subtitle?: string;
		src?: string;
		initials?: string;
		/** Tile colour (any CSS colour). Defaults to the brand colour. */
		color?: string;
		/** Pending count on the corner. Hidden when 0. */
		badge?: string | number;
		href?: string;
		/** Extra words the search matches. */
		keywords?: string;
	}

	interface ProfilePickerProps {
		/** Big question at the top («¿Qué empresa quieres gestionar?»). */
		title?: string;
		profiles?: ProfilePickerItem[];
		/** The current one gets a ring. */
		value?: string;
		createLabel?: string;
		createSubtitle?: string;
		/** Small note under everything (e.g. linked account). */
		note?: string;
		/** `screen` fills the viewport with the brand background; `inline` is a plain block. */
		variant?: 'screen' | 'inline';
		/** Show a search box when there are more than this many profiles. 0 = always, `Infinity` = never. */
		searchThreshold?: number;
		searchPlaceholder?: string;
		/** Shown when the search finds nothing. */
		emptyLabel?: string;
		class?: string;
		/** Logo above the title. */
		brand?: Snippet;
		/** Extra buttons under the grid («Gestionar empresas»). */
		footer?: Snippet;
		onselect?: (profile: ProfilePickerItem) => void;
		oncreate?: () => void;
	}

	let {
		title = '¿Quién eres?',
		profiles = [],
		value = $bindable(''),
		createLabel = 'Añadir',
		createSubtitle,
		note,
		variant = 'screen',
		searchThreshold = 8,
		searchPlaceholder = 'Buscar…',
		emptyLabel = 'Sin resultados',
		class: className = '',
		brand,
		footer,
		onselect,
		oncreate
	}: ProfilePickerProps = $props();

	const screen = $derived(variant === 'screen');
	const initialsOf = (p: ProfilePickerItem) =>
		p.initials ??
		p.name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0]?.toUpperCase() ?? '')
			.join('');
	const hasBadge = (p: ProfilePickerItem) =>
		p.badge !== undefined && p.badge !== '' && p.badge !== 0;

	let query = $state('');
	const searchable = $derived(profiles.length > searchThreshold);
	const fold = (s: string) =>
		s
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.trim();
	const shown = $derived.by(() => {
		const words = fold(query).split(/\s+/).filter(Boolean);
		if (!words.length) return profiles;
		return profiles.filter((p) => {
			const hay = fold([p.name, p.subtitle, p.keywords].filter(Boolean).join(' '));
			return words.every((w) => hay.includes(w));
		});
	});

	function pick(p: ProfilePickerItem) {
		value = p.id;
		onselect?.(p);
	}
</script>

{#snippet searchIcon()}
	<Search class="h-5 w-5" strokeWidth={2} />
{/snippet}

{#snippet tile(p: ProfilePickerItem)}
	<span
		class={[
			'text-3xl font-bold text-white sm:text-4xl relative flex aspect-square w-full items-center justify-center rounded-[1.75rem] transition-transform duration-200 group-hover:scale-[1.04]',
			value === p.id &&
				(screen
					? 'ring-brand-200 ring-offset-brand-800 ring-[3px] ring-offset-4'
					: 'ring-brand-500 ring-offset-surface ring-[3px] ring-offset-4')
		]}
		style={`background:${p.color ?? 'var(--color-brand-600)'}`}
	>
		{#if p.src}<img
				src={p.src}
				alt=""
				class="h-full w-full rounded-[1.75rem] object-cover"
			/>{:else}{initialsOf(p)}{/if}
		{#if hasBadge(p)}
			<span
				class="-right-2 -top-2 bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-950 shadow absolute rounded-full"
				>{p.badge}</span
			>
		{/if}
	</span>
	<span
		class={[
			'mt-2.5 font-semibold block truncate text-center text-[15px]',
			screen ? 'text-white' : 'text-primary'
		]}>{p.name}</span
	>
	{#if p.subtitle}
		<span
			class={['text-xs block truncate text-center', screen ? 'text-brand-200/80' : 'text-muted']}
			>{p.subtitle}</span
		>
	{/if}
{/snippet}

<div
	class={[
		'px-6 py-10 flex flex-col items-center',
		screen && 'from-brand-800 to-brand-950 text-white min-h-dvh justify-center bg-gradient-to-b',
		className
	]}
>
	{#if brand}<div class="mb-8">{@render brand()}</div>{/if}
	<h1
		class={[
			'max-w-md text-2xl font-bold tracking-tight sm:text-3xl text-center',
			!screen && 'text-primary'
		]}
	>
		{title}
	</h1>
	{#if searchable}
		<div class={['mt-8 max-w-md rounded-xl w-full', screen && 'bg-surface-elevated shadow-lg']}>
			<Input
				type="search"
				size="lg"
				clearable
				autocomplete="off"
				placeholder={searchPlaceholder}
				bind:value={query}
				leadIcon={searchIcon}
			/>
		</div>
	{/if}
	<ul class="mt-10 max-w-2xl gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 grid w-full grid-cols-2">
		{#each shown as p (p.id)}
			<li class="min-w-0">
				{#if p.href}
					<a
						href={p.href}
						class="group rounded-3xl focus-visible:ring-brand-300 block focus-visible:ring-2 focus-visible:outline-none"
						onclick={() => pick(p)}>{@render tile(p)}</a
					>
				{:else}
					<button
						type="button"
						class="group rounded-3xl focus-visible:ring-brand-300 block w-full focus-visible:ring-2 focus-visible:outline-none"
						onclick={() => pick(p)}>{@render tile(p)}</button
					>
				{/if}
			</li>
		{/each}
		{#if searchable && query && !shown.length}
			<li
				class={[
					'py-6 text-sm col-span-full text-center',
					screen ? 'text-brand-200/80' : 'text-muted'
				]}
			>
				{emptyLabel}
			</li>
		{/if}
		{#if oncreate && !query}
			<li class="min-w-0">
				<button
					type="button"
					class="group rounded-3xl focus-visible:ring-brand-300 block w-full focus-visible:ring-2 focus-visible:outline-none"
					onclick={() => oncreate?.()}
				>
					<span
						class={[
							'flex aspect-square w-full items-center justify-center rounded-[1.75rem] border-2 border-dashed transition-colors',
							screen
								? 'border-brand-400/70 text-brand-200 group-hover:bg-white/5'
								: 'border-border-strong text-muted group-hover:bg-surface-overlay'
						]}
					>
						<Plus class="h-10 w-10" strokeWidth={1.75} />
					</span>
					<span
						class={[
							'mt-2.5 font-semibold block truncate text-center text-[15px]',
							screen ? 'text-white' : 'text-primary'
						]}>{createLabel}</span
					>
					{#if createSubtitle}
						<span
							class={[
								'text-xs block truncate text-center',
								screen ? 'text-brand-200/80' : 'text-muted'
							]}>{createSubtitle}</span
						>
					{/if}
				</button>
			</li>
		{/if}
	</ul>
	{#if footer}<div class="mt-10 gap-3 flex flex-wrap justify-center">{@render footer()}</div>{/if}
	{#if note}<p class={['mt-5 text-xs text-center', screen ? 'text-brand-200/70' : 'text-muted']}>
			{note}
		</p>{/if}
</div>
