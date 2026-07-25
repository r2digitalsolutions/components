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
		align?: 'start' | 'end';
		class?: string;
		onchange?: (code: string, locale: LocaleOption) => void;
	}

	const defaultLocales: LocaleOption[] = [
		{ code: 'en', label: 'English', englishLabel: 'English', flag: '🇬🇧', region: 'United Kingdom' },
		{ code: 'en-US', label: 'English', englishLabel: 'English (US)', flag: '🇺🇸', region: 'United States' },
		{ code: 'es', label: 'Español', englishLabel: 'Spanish', flag: '🇪🇸', region: 'Spain' },
		{ code: 'es-MX', label: 'Español', englishLabel: 'Spanish (MX)', flag: '🇲🇽', region: 'Mexico' },
		{ code: 'fr', label: 'Français', englishLabel: 'French', flag: '🇫🇷', region: 'France' },
		{ code: 'de', label: 'Deutsch', englishLabel: 'German', flag: '🇩🇪', region: 'Germany' },
		{ code: 'pt', label: 'Português', englishLabel: 'Portuguese', flag: '🇵🇹', region: 'Portugal' },
		{ code: 'pt-BR', label: 'Português', englishLabel: 'Portuguese (BR)', flag: '🇧🇷', region: 'Brazil' },
		{ code: 'it', label: 'Italiano', englishLabel: 'Italian', flag: '🇮🇹', region: 'Italy' },
		{ code: 'ja', label: '日本語', englishLabel: 'Japanese', flag: '🇯🇵', region: 'Japan' },
		{ code: 'ar', label: 'العربية', englishLabel: 'Arabic', flag: '🇸🇦', region: 'Saudi Arabia', dir: 'rtl' }
	];

	let {
		value = $bindable('es'),
		locales = defaultLocales,
		variant = 'menu',
		size = 'md',
		label = 'Language',
		showLabel = false,
		showFlags = true,
		align = 'end',
		class: className = '',
		onchange
	}: LocaleSwitcherProps = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);

	const current = $derived(locales.find((l) => l.code === value) ?? locales[0]);
	const shortCode = $derived((current?.code ?? value).split('-')[0]?.toUpperCase() ?? '—');

	const triggerSize = $derived(
		size === 'sm' ? 'h-8 gap-1.5 px-2.5 text-xs' : size === 'lg' ? 'h-11 gap-2.5 px-3.5 text-sm' : 'h-9 gap-2 px-3 text-sm'
	);

	const segmentSize = $derived(
		size === 'sm' ? 'h-7 px-2.5 text-xs' : size === 'lg' ? 'h-10 px-3.5 text-sm' : 'h-9 px-3 text-sm'
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
	<div class={['inline-flex flex-col gap-1.5', className]} role="group" aria-label={label}>
		{#if showLabel}
			<span class="text-xs font-medium text-secondary">{label}</span>
		{/if}
		<div class="inline-flex rounded-xl border border-border bg-surface-overlay p-1">
			{#each locales as locale (locale.code)}
				<button
					type="button"
					role="radio"
					aria-checked={value === locale.code}
					onclick={() => select(locale)}
					class={[
						'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
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
			'w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated',
			className
		]}
		role="listbox"
		aria-label={label}
	>
		<div class="flex items-center gap-2 border-b border-border px-4 py-3">
			<Languages class="h-4 w-4 text-muted" />
			<div class="min-w-0">
				<p class="text-sm font-medium text-primary">{label}</p>
				<p class="text-xs text-muted">Choose how the product is displayed</p>
			</div>
		</div>
		<ul class="divide-y divide-border">
			{#each locales as locale (locale.code)}
				<li>
					<button
						type="button"
						role="option"
						aria-selected={value === locale.code}
						onclick={() => select(locale)}
						class={[
							'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/30',
							value === locale.code ? 'bg-brand-500/5' : 'hover:bg-surface-overlay'
						]}
					>
						{#if showFlags}
							<span
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-xl"
								aria-hidden="true"
							>
								{locale.flag ?? '🌐'}
							</span>
						{/if}
						<span class="min-w-0 flex-1" dir={locale.dir ?? 'ltr'}>
							<span class="block text-sm font-medium text-primary">{locale.label}</span>
							<span class="block truncate text-xs text-muted">
								{locale.englishLabel ?? locale.code}
								{#if locale.region}· {locale.region}{/if}
							</span>
						</span>
						{#if value === locale.code}
							<span
								class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white"
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
	<div bind:this={rootEl} class={['relative inline-flex flex-col gap-1.5', className]}>
		{#if showLabel}
			<span class="text-xs font-medium text-secondary">{label}</span>
		{/if}
		<button
			type="button"
			class={[
				'inline-flex items-center rounded-xl border border-border bg-surface-elevated font-medium text-primary shadow-sm transition hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
				triggerSize
			]}
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-label={label}
			onclick={() => (open = !open)}
		>
			{#if showFlags && current?.flag}
				<span class="text-base leading-none" aria-hidden="true">{current.flag}</span>
			{:else}
				<Globe class="h-4 w-4 text-muted" />
			{/if}
			<span class="max-w-36 truncate" dir={current?.dir ?? 'ltr'}>{current?.label ?? value}</span>
			<span class="rounded-md bg-surface-overlay px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted">
				{shortCode}
			</span>
			<ChevronDown class={['h-3.5 w-3.5 text-muted transition', open && 'rotate-180']} />
		</button>

		{#if open}
			<div
				class={[
					'absolute top-[calc(100%+0.35rem)] z-50 w-72 overflow-hidden rounded-2xl border border-border bg-surface-elevated py-1 shadow-xl',
					align === 'end' ? 'end-0' : 'start-0'
				]}
				role="listbox"
				aria-label={label}
			>
				<div class="border-b border-border px-3 py-2">
					<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
				</div>
				<ul class="max-h-72 overflow-auto py-1">
					{#each locales as locale (locale.code)}
						<li>
							<button
								type="button"
								role="option"
								aria-selected={value === locale.code}
								onclick={() => select(locale)}
								class={[
									'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:bg-surface-overlay',
									value === locale.code ? 'bg-brand-500/5' : 'hover:bg-surface-overlay'
								]}
							>
								{#if showFlags}
									<span class="w-6 text-center text-base leading-none" aria-hidden="true">
										{locale.flag ?? '🌐'}
									</span>
								{/if}
								<span class="min-w-0 flex-1" dir={locale.dir ?? 'ltr'}>
									<span class="block text-sm font-medium text-primary">{locale.label}</span>
									<span class="block truncate text-[11px] text-muted">
										{locale.englishLabel ?? locale.code}
										{#if locale.region}· {locale.region}{/if}
									</span>
								</span>
								{#if value === locale.code}
									<Check class="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
{/if}
