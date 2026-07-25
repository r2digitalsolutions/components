<script lang="ts">
	import LocaleSwitcher from './LocaleSwitcher.svelte';
	import type { LocaleOption } from './LocaleSwitcher.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface Props {
		variant?: 'menu' | 'segmented' | 'list' | 'settings';
	}

	let { variant = 'settings' }: Props = $props();

	let value = $state('es');
	let compactValue = $state('en');
	let segmentValue = $state('es');

	const compactLocales: LocaleOption[] = [
		{ code: 'en', label: 'English', flag: '🇬🇧' },
		{ code: 'es', label: 'Español', flag: '🇪🇸' },
		{ code: 'fr', label: 'Français', flag: '🇫🇷' },
		{ code: 'de', label: 'Deutsch', flag: '🇩🇪' },
		{ code: 'ja', label: '日本語', flag: '🇯🇵' }
	];

	const names: Record<string, string> = {
		en: 'Welcome back',
		'en-US': 'Welcome back',
		es: 'Bienvenido de nuevo',
		'es-MX': 'Bienvenido de nuevo',
		fr: 'Bon retour',
		de: 'Willkommen zurück',
		pt: 'Bem-vindo de volta',
		'pt-BR': 'Bem-vindo de volta',
		it: 'Bentornato',
		ja: 'おかえりなさい',
		ar: 'مرحبًا بعودتك'
	};
</script>

{#if variant === 'menu'}
	<div class="w-full space-y-6">
		<header
			class="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-surface-elevated px-5 py-4"
		>
			<div>
				<p class="text-sm font-semibold text-primary">Acme Cloud</p>
				<p class="text-xs text-muted">Product navigation</p>
			</div>
			<LocaleSwitcher bind:value={compactValue} locales={compactLocales} size="sm" />
		</header>
		<div class="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
			<p class="text-2xl font-semibold tracking-tight text-primary">
				{names[compactValue] ?? 'Welcome'}
			</p>
			<Text size="sm" tone="muted" class="mt-2">Locale: {compactValue}</Text>
		</div>
	</div>
{:else if variant === 'segmented'}
	<div class="w-full space-y-4 rounded-2xl border border-border bg-surface-elevated p-6">
		<div>
			<p class="text-sm font-semibold text-primary">Quick language</p>
			<p class="text-xs text-muted">Segmented control for a short list of locales.</p>
		</div>
		<LocaleSwitcher
			bind:value={segmentValue}
			variant="segmented"
			locales={compactLocales}
			showLabel
			label="Interface language"
		/>
		<p class="text-sm text-secondary">
			{names[segmentValue]} · <span class="font-mono text-xs">{segmentValue}</span>
		</p>
	</div>
{:else if variant === 'list'}
	<div class="mx-auto w-full max-w-xl">
		<LocaleSwitcher bind:value variant="list" />
	</div>
{:else}
	<div class="w-full space-y-6">
		<header
			class="flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface-elevated px-5 py-4"
		>
			<div class="min-w-0">
				<p class="text-sm font-semibold text-primary">Settings · Preferences</p>
				<p class="text-xs text-muted">Language, region, and formatting</p>
			</div>
			<LocaleSwitcher bind:value size="sm" align="end" />
		</header>

		<div class="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
			<section class="rounded-2xl border border-border bg-surface-elevated p-6">
				<p class="text-xs font-semibold uppercase tracking-wide text-muted">Preview</p>
				<h2 class="mt-2 text-3xl font-semibold tracking-tight text-primary" dir="auto">
					{names[value] ?? 'Welcome'}
				</h2>
				<p class="mt-3 max-w-prose text-sm leading-relaxed text-secondary">
					Your UI copy, dates, and number formats follow the selected locale. Switch languages from
					the header menu or the full list on the right.
				</p>
				<div class="mt-6 grid gap-3 sm:grid-cols-3">
					{#each [['Date', '25 Jul 2026'], ['Number', '1.234,56'], ['Currency', '€42.00']] as [k, v]}
						<div class="rounded-xl border border-border bg-surface px-4 py-3">
							<p class="text-[11px] font-medium uppercase tracking-wide text-muted">{k}</p>
							<p class="mt-1 text-sm font-semibold text-primary">{v}</p>
						</div>
					{/each}
				</div>
			</section>

			<LocaleSwitcher bind:value variant="list" class="w-full" />
		</div>
	</div>
{/if}
