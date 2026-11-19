<script lang="ts">
	import type { Snippet } from 'svelte';
	import Plus from '@lucide/svelte/icons/plus';

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

	function pick(p: ProfilePickerItem) {
		value = p.id;
		onselect?.(p);
	}
</script>

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
	<ul class="mt-10 max-w-2xl gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 grid w-full grid-cols-2">
		{#each profiles as p (p.id)}
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
		{#if oncreate}
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
