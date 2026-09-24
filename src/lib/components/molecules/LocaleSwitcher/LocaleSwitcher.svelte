<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Globe from '@lucide/svelte/icons/globe';
	import Languages from '@lucide/svelte/icons/languages';

	export interface LocaleOption {
		code: string;
		/** Display name in that language (e.g. Español) */
		label: string;
		/** Optional English / meta label */
		englishLabel?: string;
		/** Flag emoji or short regional mark */
		flag?: string;
		/** Region hint shown in list, e.g. Spain */
		region?: string;
		dir?: 'ltr' | 'rtl';
	}

	type LocaleVariant = 'menu' | 'segmented' | 'list';
	type LocaleSize = 'sm' | 'md' | 'lg';

	interface LocaleSwitcherProps {
		value?: string;
		locales?: LocaleOption[];
		variant?: LocaleVariant;
		size?: LocaleSize;
		label?: string;
		showLabel?: boolean;
		showFlags?: boolean;
		/**
		 * Compact header style: language name on top, code underneath (no code badge on the right).
		 */
		stacked?: boolean;
		align?: 'start' | 'end';
		class?: string;
		onchange?: (code: string, locale: LocaleOption) => void;
	}

	const defaultLocales: LocaleOption[] = [
		{ code: 'en', label: 'English', englishLabel: 'English', flag: '🇬🇧', region: 'United Kingdom' },
		{
			code: 'en-US',
			label: 'English',
			englishLabel: 'English (US)',
			flag: '🇺🇸',
			region: 'United States'
		},
		{ code: 'es', label: 'Español', englishLabel: 'Spanish', flag: '🇪🇸', region: 'Spain' },
		{ code: 'es-MX', label: 'Español', englishLabel: 'Spanish (MX)', flag: '🇲🇽', region: 'Mexico' },
		{ code: 'fr', label: 'Français', englishLabel: 'French', flag: '🇫🇷', region: 'France' },
		{ code: 'de', label: 'Deutsch', englishLabel: 'German', flag: '🇩🇪', region: 'Germany' },
		{ code: 'pt', label: 'Português', englishLabel: 'Portuguese', flag: '🇵🇹', region: 'Portugal' },
		{
			code: 'pt-BR',
			label: 'Português',
			englishLabel: 'Portuguese (BR)',
			flag: '🇧🇷',
			region: 'Brazil'
		},
		{ code: 'it', label: 'Italiano', englishLabel: 'Italian', flag: '🇮🇹', region: 'Italy' },
		{ code: 'ja', label: '日本語', englishLabel: 'Japanese', flag: '🇯🇵', region: 'Japan' },
		{
			code: 'ar',
			label: 'العربية',
			englishLabel: 'Arabic',
			flag: '🇸🇦',
			region: 'Saudi Arabia',
			dir: 'rtl'
		}
	];

	let {
		value = $bindable('es'),
		locales = defaultLocales,
		variant = 'menu',
		size = 'md',
		label = 'Language',
		showLabel = false,
		showFlags = true,
		stacked = false,
		align = 'end',
		class: className = '',
		onchange
	}: LocaleSwitcherProps = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);

	const current = $derived(locales.find((l) => l.code === value) ?? locales[0]);
	const shortCode = $derived((current?.code ?? value).split('-')[0]?.toUpperCase() ?? '—');

	const triggerSize = $derived(
		stacked
			? size === 'sm'
				? 'h-9 gap-2 px-3'
				: size === 'lg'
					? 'h-12 gap-2.5 px-3.5'
					: 'h-10 gap-2 px-3'
			: size === 'sm'
				? 'h-8 gap-1.5 px-2.5 text-xs'
				: size === 'lg'
					? 'h-11 gap-2.5 px-3.5 text-sm'
					: 'h-9 gap-2 px-3 text-sm'
	);

	const segmentSize = $derived(
		size === 'sm'
			? 'h-7 px-2.5 text-xs'
			: size === 'lg'
				? 'h-10 px-3.5 text-sm'
				: 'h-9 px-3 text-sm'
	);

	function select(locale: LocaleOption) {
		value = locale.code;
		open = false;
		onchange?.(locale.code, locale);
	}

	function onDocClick(e: MouseEvent) {
		if (!rootEl) return;
		if (!rootEl.contains(e.target as Node)) open = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onclick={onDocClick} onkeydown={onKeydown} />

{#if variant === 'segmented'}
	<div class={['gap-1.5 inline-flex flex-col', className]} role="group" aria-label={label}>
		{#if showLabel}
			<span class="text-xs font-medium text-secondary">{label}</span>
		{/if}
		<div class="rounded-xl border-border bg-surface-overlay p-1 inline-flex border">
			{#each locales as locale (locale.code)}
				<button
					type="button"
					role="radio"
					aria-checked={value === locale.code}
					onclick={() => select(locale)}
					class={[
						'gap-1.5 rounded-lg font-medium focus-visible:ring-brand-500/30 inline-flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none',
						segmentSize,
						value === locale.code
							? 'bg-surface-elevated text-primary shadow-sm'
							: 'text-secondary hover:text-primary'
					]}
					title={locale.englishLabel ?? locale.label}
				>
					{#if showFlags && locale.flag}
						<span class="text-sm leading-none" aria-hidden="true">{locale.flag}</span>
					{/if}
					<span>{locale.code.split('-')[0].toUpperCase()}</span>
				</button>
			{/each}
		</div>
	</div>
{:else if variant === 'list'}
	<div
		class={[
			'rounded-2xl border-border bg-surface-elevated w-full overflow-hidden border',
			className
		]}
		role="listbox"
		aria-label={label}
	>
		<div class="gap-2 border-border px-4 py-3 flex items-center border-b">
			<Languages class="h-4 w-4 text-muted" />
			<div class="min-w-0">
				<p class="text-sm font-medium text-primary">{label}</p>
				<p class="text-xs text-muted">Choose how the product is displayed</p>
			</div>
		</div>
		<ul class="divide-border divide-y">
			{#each locales as locale (locale.code)}
				<li>
					<button
						type="button"
						role="option"
						aria-selected={value === locale.code}
						onclick={() => select(locale)}
						class={[
							'gap-3 px-4 py-3 focus-visible:ring-brand-500/30 flex w-full items-center text-left transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
							value === locale.code ? 'bg-brand-500/5' : 'hover:bg-surface-overlay'
						]}
					>
						{#if showFlags}
							<span
								class="h-10 w-10 rounded-xl bg-surface-overlay text-xl flex shrink-0 items-center justify-center"
								aria-hidden="true"
							>
								{locale.flag ?? '🌐'}
							</span>
						{/if}
						<span class="min-w-0 flex-1" dir={locale.dir ?? 'ltr'}>
							<span class="text-sm font-medium text-primary block">{locale.label}</span>
							<span class="text-xs text-muted block truncate">
								{locale.englishLabel ?? locale.code}
								{#if locale.region}· {locale.region}{/if}
							</span>
						</span>
						{#if value === locale.code}
							<span
								class="h-6 w-6 bg-brand-500 text-white flex items-center justify-center rounded-full"
							>
								<Check class="h-3.5 w-3.5" />
							</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<div bind:this={rootEl} class={['gap-1.5 relative inline-flex flex-col', className]}>
		{#if showLabel}
			<span class="text-xs font-medium text-secondary">{label}</span>
		{/if}
		<button
			type="button"
			class={[
				'rounded-xl border-border bg-surface-elevated font-medium text-primary shadow-sm hover:bg-surface-overlay focus-visible:ring-brand-500/30 inline-flex items-center border transition focus-visible:ring-2 focus-visible:outline-none',
				triggerSize
			]}
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-label={`${label}: ${current?.label ?? value} ${shortCode}`}
			onclick={() => (open = !open)}
		>
			{#if showFlags && current?.flag}
				<span class={['leading-none', stacked ? 'text-sm' : 'text-base']} aria-hidden="true"
					>{current.flag}</span
				>
			{:else}
				<Globe class="h-4 w-4 text-muted shrink-0" />
			{/if}
			{#if stacked}
				<span class="min-w-0 max-w-36 leading-tight flex-1 text-left" dir={current?.dir ?? 'ltr'}>
					<span class="text-primary text-xs font-medium block truncate"
						>{current?.label ?? value}</span
					>
					<span class="text-muted font-medium tracking-wide block truncate text-[11px]"
						>{shortCode}</span
					>
				</span>
			{:else}
				<span class="max-w-36 text-xs truncate" dir={current?.dir ?? 'ltr'}
					>{current?.label ?? value}</span
				>
				<span
					class="rounded-md bg-surface-overlay px-1.5 py-0.5 font-semibold tracking-wide text-muted text-[10px]"
				>
					{shortCode}
				</span>
			{/if}
			<ChevronDown class={['h-3.5 w-3.5 text-muted shrink-0 transition', open && 'rotate-180']} />
		</button>

		{#if open}
			<div
				class={[
					'w-72 rounded-2xl border-border bg-surface-elevated py-1 shadow-xl absolute top-[calc(100%+0.35rem)] z-50 overflow-hidden border',
					align === 'end' ? 'end-0' : 'start-0'
				]}
				role="listbox"
				aria-label={label}
			>
				<div class="border-border px-3 py-2 border-b">
					<p class="font-semibold tracking-wide text-muted text-[11px] uppercase">{label}</p>
				</div>
				<ul class="max-h-72 py-1 overflow-auto">
					{#each locales as locale (locale.code)}
						<li>
							<button
								type="button"
								role="option"
								aria-selected={value === locale.code}
								onclick={() => select(locale)}
								class={[
									'gap-2.5 px-3 py-2 focus-visible:bg-surface-overlay flex w-full items-center text-left transition-colors focus-visible:outline-none',
									value === locale.code ? 'bg-brand-500/5' : 'hover:bg-surface-overlay'
								]}
							>
								{#if showFlags}
									<span class="w-6 text-base text-center leading-none" aria-hidden="true">
										{locale.flag ?? '🌐'}
									</span>
								{/if}
								<span class="min-w-0 flex-1" dir={locale.dir ?? 'ltr'}>
									<span class="text-sm font-medium text-primary block">{locale.label}</span>
									<span class="text-muted block truncate text-[11px]">
										{locale.englishLabel ?? locale.code}
										{#if locale.region}· {locale.region}{/if}
									</span>
								</span>
								{#if value === locale.code}
									<Check class="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
{/if}
