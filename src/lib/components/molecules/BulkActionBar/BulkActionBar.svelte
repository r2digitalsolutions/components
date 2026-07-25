<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import CloseButton from '$lib/components/atoms/CloseButton/CloseButton.svelte';
	import DropdownMenu from '$lib/components/molecules/DropdownMenu/DropdownMenu.svelte';
	import type { DropdownItem } from '$lib/components/molecules/DropdownMenu/DropdownMenu.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';

	export type BulkActionVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	export type BulkActionBarSize = 'xs' | 'sm';
	export type BulkActionBarPlacement = 'dock' | 'inline';
	export type BulkActionBarTone = 'brand' | 'neutral';

	export interface BulkAction {
		id: string;
		label: string;
		variant?: BulkActionVariant;
		disabled?: boolean;
		loading?: boolean;
		/** Prefer Lucide: `import { Archive } from '@lucide/svelte'` */
		icon?: Component<{ class?: string; size?: number | string; strokeWidth?: number | string }>;
		/** Icon only (label stays for a11y via aria-label) */
		iconOnly?: boolean;
		/** Force into “More” menu */
		overflow?: boolean;
		/** Ask before firing (useful for delete) */
		confirm?: boolean;
		confirmLabel?: string;
		tooltip?: string;
	}

	interface BulkActionBarProps {
		count?: number;
		/** Total items in the list (shows “2 of 12”) */
		total?: number;
		actions?: BulkAction[];
		/** Override selection copy entirely */
		label?: string;
		description?: string;
		itemLabel?: string;
		itemLabelPlural?: string;
		placement?: BulkActionBarPlacement;
		size?: BulkActionBarSize;
		tone?: BulkActionBarTone;
		sticky?: boolean;
		/** Cap visible primary actions; rest go to More */
		maxPrimary?: number;
		showSelectAll?: boolean;
		showClear?: boolean;
		showHint?: boolean;
		hint?: string;
		clearOnEscape?: boolean;
		disabled?: boolean;
		class?: string;
		leading?: Snippet;
		extra?: Snippet;
		trailing?: Snippet;
		onaction?: (id: string) => void;
		onclear?: () => void;
		onselectall?: () => void;
		onselectnone?: () => void;
	}

	const {
		count = 0,
		total,
		actions = [
			{ id: 'archive', label: 'Archive', variant: 'secondary' },
			{ id: 'delete', label: 'Delete', variant: 'destructive', confirm: true }
		],
		label,
		description,
		itemLabel = 'item',
		itemLabelPlural = 'items',
		placement = 'dock',
		size = 'sm',
		tone = 'brand',
		sticky = true,
		maxPrimary = 3,
		showSelectAll = true,
		showClear = true,
		showHint = true,
		hint,
		clearOnEscape = true,
		disabled = false,
		class: className = '',
		leading,
		extra,
		trailing,
		onaction,
		onclear,
		onselectall,
		onselectnone
	}: BulkActionBarProps = $props();

	let pendingConfirm = $state<string | null>(null);

	const btnSize = $derived(size);
	const closeSize = $derived(size === 'xs' ? 'sm' : 'sm');
	const iconPx = $derived(size === 'xs' ? 'h-3.5 w-3.5' : 'h-3.5 w-3.5');

	/** Split by overflow flag, then by maxPrimary */
	const split = $derived.by(() => {
		const forced = actions.filter((a) => a.overflow);
		const rest = actions.filter((a) => !a.overflow);
		const primary = rest.slice(0, Math.max(0, maxPrimary));
		const overflowed = [...rest.slice(Math.max(0, maxPrimary)), ...forced];
		return { primary, overflowed };
	});

	const overflowItems = $derived(
		split.overflowed.map(
			(a): DropdownItem => ({
				id: a.id,
				label: a.label,
				icon: a.icon,
				disabled: a.disabled || disabled,
				destructive: a.variant === 'destructive'
			})
		)
	);

	const noun = $derived(count === 1 ? itemLabel : itemLabelPlural);

	const selectionText = $derived.by(() => {
		if (label) return label;
		if (total != null && total > 0) return `${count} of ${total} ${noun}`;
		return `${count} ${noun} selected`;
	});

	const allSelected = $derived(total != null && total > 0 && count >= total);
	const canSelectAll = $derived(showSelectAll && !!onselectall && total != null && count > 0 && !allSelected);
	const canSelectNone = $derived(!!onselectnone && allSelected);

	const resolvedHint = $derived.by(() => {
		if (!showHint) return '';
		if (pendingConfirm) {
			return `Confirm ${actions.find((a) => a.id === pendingConfirm)?.label ?? 'action'}?`;
		}
		if (hint) return hint;
		if (canSelectAll) return '';
		return 'Esc to clear';
	});

	const countBadgeClass = $derived(
		tone === 'brand'
			? 'bg-brand-500 text-white'
			: 'bg-surface-overlay text-primary ring-1 ring-border'
	);

	function run(id: string) {
		const action = actions.find((a) => a.id === id);
		if (!action || action.disabled || disabled) return;
		if (action.confirm && pendingConfirm !== id) {
			pendingConfirm = id;
			return;
		}
		pendingConfirm = null;
		onaction?.(id);
	}

	function onKeydown(e: KeyboardEvent) {
		if (!clearOnEscape || count <= 0) return;
		if (e.key === 'Escape') {
			if (pendingConfirm) {
				pendingConfirm = null;
				return;
			}
			onclear?.();
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if count > 0}
	<div
		class={[
			placement === 'dock' && 'pointer-events-none z-30 flex justify-center',
			placement === 'dock' && sticky && 'sticky bottom-3 px-3',
			placement === 'inline' && sticky && 'sticky bottom-0 z-20',
			className
		]}
		role="toolbar"
		aria-label="Bulk actions"
	>
		<div
			class={[
				'pointer-events-auto flex w-full flex-col gap-2 border shadow-lg backdrop-blur-md',
				'ring-1 ring-black/5 dark:ring-white/10',
				placement === 'dock' &&
					'max-w-2xl rounded-xl border-border bg-surface-elevated/95 px-3 py-2 sm:flex-row sm:items-center sm:gap-3 sm:px-3.5',
				placement === 'inline' &&
					'rounded-none border-x-0 border-b-0 border-border bg-surface-elevated/95 px-3 py-2 sm:flex-row sm:items-center'
			]}
		>
			<div class="flex min-w-0 flex-1 items-center gap-2.5">
				{#if leading}
					{@render leading()}
				{:else}
					<span
						class={[
							'inline-flex shrink-0 items-center justify-center rounded-lg font-bold tabular-nums shadow-sm',
							size === 'xs' ? 'h-7 min-w-7 px-1.5 text-xs' : 'h-8 min-w-8 px-2 text-xs',
							countBadgeClass
						]}
						aria-hidden="true"
					>
						{count}
					</span>
				{/if}

				<div class="min-w-0 flex-1">
					<p class="truncate text-xs font-semibold text-primary sm:text-sm">{selectionText}</p>
					{#if description}
						<p class="truncate text-[11px] text-muted">{description}</p>
					{:else if canSelectAll}
						<button
							type="button"
							class="mt-0.5 text-[11px] font-medium text-brand-600 hover:underline dark:text-brand-400"
							onclick={() => onselectall?.()}
						>
							Select all {total}
						</button>
					{:else if canSelectNone}
						<button
							type="button"
							class="mt-0.5 text-[11px] font-medium text-secondary hover:underline"
							onclick={() => onselectnone?.()}
						>
							Clear selection
						</button>
					{:else if resolvedHint}
						<p
							class={[
								'mt-0.5 text-[11px]',
								pendingConfirm ? 'text-amber-700 dark:text-amber-300' : 'text-muted'
							]}
						>
							{resolvedHint}
						</p>
					{/if}
				</div>

				{#if extra}
					<div class="hidden items-center gap-1.5 sm:flex">
						{@render extra()}
					</div>
				{/if}
			</div>

			<div class="flex flex-wrap items-center gap-1.5 sm:justify-end">
				{#if pendingConfirm}
					<Button size={btnSize} variant="ghost" {disabled} onclick={() => (pendingConfirm = null)}>
						Cancel
					</Button>
					<Button
						size={btnSize}
						variant="destructive"
						{disabled}
						onclick={() => run(pendingConfirm!)}
					>
						{actions.find((a) => a.id === pendingConfirm)?.confirmLabel ?? 'Confirm'}
					</Button>
				{:else}
					{#each split.primary as action (action.id)}
						{@const Icon = action.icon}
						<Button
							size={btnSize}
							variant={action.variant ?? 'secondary'}
							disabled={disabled || action.disabled}
							loading={action.loading}
							aria-label={action.iconOnly ? action.label : undefined}
							title={action.tooltip ?? (action.iconOnly ? action.label : undefined)}
							onclick={() => run(action.id)}
						>
							{#if Icon}
								<Icon class={iconPx} strokeWidth={2} />
							{/if}
							{#if !action.iconOnly}
								{action.label}
							{/if}
						</Button>
					{/each}

					{#if overflowItems.length > 0}
						<DropdownMenu
							label="More actions"
							items={overflowItems}
							align="end"
							side="top"
							size="sm"
							disabled={disabled}
							onselect={(id) => run(id)}
						>
							{#snippet trigger()}
								<span
									class={[
										'inline-flex items-center justify-center rounded-lg text-secondary hover:bg-surface-overlay hover:text-primary',
										size === 'xs' ? 'h-7 w-7' : 'h-8 w-8'
									]}
									aria-hidden="true"
								>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
										<circle cx="5" cy="12" r="1.75" />
										<circle cx="12" cy="12" r="1.75" />
										<circle cx="19" cy="12" r="1.75" />
									</svg>
								</span>
							{/snippet}
						</DropdownMenu>
					{/if}
				{/if}

				{#if trailing}
					{@render trailing()}
				{/if}

				{#if showClear && onclear}
					<Divider orientation="vertical" class="mx-0.5 hidden h-6 sm:block" />
					<CloseButton
						label="Clear selection"
						size={closeSize}
						onclick={() => {
							pendingConfirm = null;
							onclear();
						}}
					/>
				{/if}
			</div>
		</div>
	</div>
{/if}
