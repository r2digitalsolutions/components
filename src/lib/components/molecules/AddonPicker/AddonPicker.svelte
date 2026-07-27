<script lang="ts">
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Plus from '@lucide/svelte/icons/plus';

	export interface BillingAddon {
		id: string;
		name: string;
		description?: string;
		price: string | number;
		currency?: string;
		selected?: boolean;
	}

	interface AddonPickerProps {
		addons: BillingAddon[];
		class?: string;
		onchange?: (id: string, selected: boolean) => void;
	}

	let { addons, class: className = '', onchange }: AddonPickerProps = $props();

	function formatPrice(price: string | number, currency = 'USD') {
		if (typeof price === 'string') return price;
		return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
			price
		);
	}

	function toggle(id: string, selected: boolean) {
		onchange?.(id, selected);
	}
</script>

<ul class={['w-full space-y-2', className]} role="list">
	{#each addons as addon (addon.id)}
		<li>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				role="checkbox"
				aria-checked={addon.selected ?? false}
				tabindex="0"
				onclick={() => toggle(addon.id, !(addon.selected ?? false))}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						toggle(addon.id, !(addon.selected ?? false));
					}
				}}
				class={[
					'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
					addon.selected
						? 'border-brand-500/50 bg-brand-50/50 ring-1 ring-brand-500/15 dark:bg-brand-950/20'
						: 'border-border bg-surface-elevated hover:border-border-strong'
				]}
			>
				<span
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"
				>
					<Plus class="h-4 w-4" strokeWidth={2} />
				</span>

				<div class="min-w-0 flex-1 space-y-1">
					<div class="flex flex-wrap items-center gap-2">
						<p class="text-sm font-semibold text-primary">{addon.name}</p>
						<Badge size="sm" variant="secondary">
							{formatPrice(addon.price, addon.currency)}
							/mo
						</Badge>
					</div>
					{#if addon.description}
						<p class="text-xs leading-relaxed text-muted">{addon.description}</p>
					{/if}
				</div>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="shrink-0 pt-0.5" onclick={(e) => e.stopPropagation()}>
					<Checkbox
						checked={addon.selected ?? false}
						onchange={(checked) => toggle(addon.id, checked)}
					/>
				</div>
			</div>
		</li>
	{/each}
</ul>
