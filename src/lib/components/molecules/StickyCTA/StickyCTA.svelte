<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import SafeArea from '$lib/components/atoms/SafeArea/SafeArea.svelte';

	export type StickyCTALayout = 'row' | 'stack';
	export type StickyCTAPlacement = 'fixed' | 'absolute';

	interface StickyCTAProps {
		label?: string;
		secondaryLabel?: string;
		hint?: string;
		/** Optional total / meta line */
		meta?: string;
		disabled?: boolean;
		loading?: boolean;
		blur?: boolean;
		fade?: boolean;
		elevated?: boolean;
		/**
		 * Float the bar with margin so corners aren’t clipped by rounded parents.
		 * Set false for full-bleed edge-to-edge.
		 */
		inset?: boolean;
		layout?: StickyCTALayout;
		placement?: StickyCTAPlacement;
		primaryVariant?: 'primary' | 'secondary' | 'outline';
		secondaryVariant?: 'secondary' | 'ghost' | 'outline';
		class?: string;
		leading?: Snippet;
		onprimary?: () => void;
		onsecondary?: () => void;
	}

	let {
		label = 'Continue',
		secondaryLabel,
		hint,
		meta,
		disabled = false,
		loading = false,
		blur = true,
		fade = true,
		elevated = true,
		inset = true,
		layout = 'row',
		placement = 'fixed',
		primaryVariant = 'primary',
		secondaryVariant = 'secondary',
		class: className = '',
		leading,
		onprimary,
		onsecondary
	}: StickyCTAProps = $props();

	const showAside = $derived(Boolean(leading) || Boolean(meta) || Boolean(hint));
</script>

<div
	class={[
		'z-40',
		placement,
		inset ? 'right-3 bottom-3 left-3' : 'inset-x-0 bottom-0',
		className
	]}
>
	{#if fade}
		<div
			class={[
				'pointer-events-none absolute -top-8 right-0 left-0 h-8 bg-gradient-to-t from-surface-elevated to-transparent',
				inset && 'rounded-t-2xl'
			]}
			aria-hidden="true"
		></div>
	{/if}

	<div
		class={[
			blur ? 'bg-surface-elevated/95 backdrop-blur-xl' : 'bg-surface-elevated',
			inset
				? 'rounded-2xl border border-border'
				: 'rounded-none border-t border-border',
			elevated &&
				(inset
					? 'shadow-lg shadow-black/10 dark:shadow-black/40'
					: 'shadow-[0_-10px_28px_-14px_oklch(0%_0_0_/_0.2)] dark:shadow-[0_-10px_28px_-14px_oklch(0%_0_0_/_0.5)]')
		]}
	>
		<SafeArea
			top={false}
			bottom={!inset}
			class={inset ? 'px-4 pt-3.5 pb-3.5' : 'px-4 pt-3.5 pb-3'}
		>
			{#if layout === 'stack'}
				<div class="flex flex-col gap-3">
					{#if showAside}
						<div class="min-w-0 px-0.5">
							{#if leading}
								{@render leading()}
							{:else if meta}
								<p class="text-[11px] font-medium text-muted">Total</p>
								<p class="text-base font-semibold tracking-tight text-primary">{meta}</p>
							{/if}
							{#if hint}
								<p class="mt-1 text-[11px] leading-4 text-muted">{hint}</p>
							{/if}
						</div>
					{:else if hint}
						<p class="text-center text-[11px] text-muted">{hint}</p>
					{/if}

					<div class="flex flex-col gap-2">
						<Button
							variant={primaryVariant}
							fullWidth
							size="lg"
							{disabled}
							{loading}
							onclick={() => onprimary?.()}
						>
							{label}
						</Button>
						{#if secondaryLabel}
							<Button
								variant={secondaryVariant}
								fullWidth
								{disabled}
								onclick={() => onsecondary?.()}
							>
								{secondaryLabel}
							</Button>
						{/if}
					</div>
				</div>
			{:else}
				<div class="flex items-center gap-3">
					{#if showAside}
						<div class="min-w-[5.5rem] max-w-[42%] shrink-0 px-0.5">
							{#if leading}
								{@render leading()}
							{:else if meta}
								<p class="text-[11px] font-medium text-muted">Total</p>
								<p class="text-base font-semibold tracking-tight text-primary">{meta}</p>
							{/if}
							{#if hint}
								<p class="mt-0.5 text-[10px] leading-3.5 text-muted">{hint}</p>
							{/if}
						</div>
					{/if}

					<div class="flex min-w-0 flex-1 items-center gap-2">
						{#if secondaryLabel}
							<Button
								variant={secondaryVariant}
								class="min-w-0 flex-1"
								{disabled}
								onclick={() => onsecondary?.()}
							>
								{secondaryLabel}
							</Button>
						{/if}
						<Button
							variant={primaryVariant}
							class="min-w-0 flex-[1.35]"
							size="md"
							{disabled}
							{loading}
							onclick={() => onprimary?.()}
						>
							{label}
						</Button>
					</div>
				</div>
			{/if}
		</SafeArea>
	</div>
</div>
