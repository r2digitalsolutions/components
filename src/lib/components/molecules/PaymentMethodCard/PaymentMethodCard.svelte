<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import CreditCard from '@lucide/svelte/icons/credit-card';

	export type PaymentCardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

	interface PaymentMethodCardProps {
		brand?: PaymentCardBrand | string;
		last4: string;
		expMonth?: number | string;
		expYear?: number | string;
		isDefault?: boolean;
		class?: string;
		onselect?: () => void;
		onremove?: () => void;
		onmakeDefault?: () => void;
	}

	let {
		brand = 'unknown',
		last4,
		expMonth,
		expYear,
		isDefault = false,
		class: className = '',
		onselect,
		onremove,
		onmakeDefault
	}: PaymentMethodCardProps = $props();

	const KNOWN_BRANDS = ['visa', 'mastercard', 'amex', 'discover'] as const;

	const normalizedBrand = $derived.by((): PaymentCardBrand => {
		const b = brand.toLowerCase();
		return (KNOWN_BRANDS as readonly string[]).includes(b) ? (b as PaymentCardBrand) : 'unknown';
	});

	const expiry = $derived.by(() => {
		if (expMonth == null || expYear == null) return null;
		const mm = String(expMonth).padStart(2, '0');
		const yy = String(expYear).slice(-2);
		return `${mm}/${yy}`;
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	role={onselect ? 'button' : undefined}
	tabindex={onselect ? 0 : undefined}
	onclick={() => onselect?.()}
	onkeydown={(e) => {
		if (!onselect) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onselect();
		}
	}}
	class={[
		'flex flex-col gap-3 rounded-xl border bg-surface-elevated p-4 sm:flex-row sm:items-center sm:gap-4',
		isDefault ? 'border-brand-500/40 ring-1 ring-brand-500/15' : 'border-border',
		onselect && 'cursor-pointer transition-colors hover:border-border-strong',
		className
	]}
>
	<span
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-secondary"
	>
		{#if normalizedBrand === 'visa'}
			<span
				class="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white"
				style="background:#1A1F71"
			>
				VISA
			</span>
		{:else if normalizedBrand === 'mastercard'}
			<span class="relative flex h-5 w-8 items-center" aria-hidden="true">
				<span class="absolute left-0 h-5 w-5 rounded-full" style="background:#EB001B"></span>
				<span class="absolute right-0 h-5 w-5 rounded-full opacity-90" style="background:#F79E1B"
				></span>
			</span>
		{:else if normalizedBrand === 'amex'}
			<span
				class="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white"
				style="background:#2E77BC"
			>
				AMEX
			</span>
		{:else if normalizedBrand === 'discover'}
			<span
				class="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white"
				style="background:#FF6000"
			>
				DISC
			</span>
		{:else}
			<CreditCard class="h-5 w-5" strokeWidth={2} />
		{/if}
	</span>

	<div class="min-w-0 flex-1 space-y-1">
		<div class="flex flex-wrap items-center gap-2">
			<p class="text-sm font-semibold text-primary">
				<span class="font-mono">•••• {last4}</span>
			</p>
			{#if isDefault}
				<Badge size="sm" variant="primary" dot>Default</Badge>
			{/if}
		</div>
		{#if expiry}
			<p class="text-xs text-muted">Expires {expiry}</p>
		{/if}
	</div>

	{#if onremove || onmakeDefault}
		<div class="flex shrink-0 flex-wrap gap-2 self-start sm:self-center">
			{#if onmakeDefault && !isDefault}
				<Button size="xs" variant="ghost" onclick={(e) => { e.stopPropagation(); onmakeDefault?.(); }}>
					Make default
				</Button>
			{/if}
			{#if onremove}
				<Button
					size="xs"
					variant="ghost"
					class="text-red-600 hover:text-red-700 dark:text-red-400"
					onclick={(e) => { e.stopPropagation(); onremove?.(); }}
				>
					Remove
				</Button>
			{/if}
		</div>
	{/if}
</div>
