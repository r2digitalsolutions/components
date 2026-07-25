<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ButtonGroup from '$lib/components/molecules/ButtonGroup/ButtonGroup.svelte';
	import CountBadge from '$lib/components/atoms/CountBadge/CountBadge.svelte';
	import CloseButton from '$lib/components/atoms/CloseButton/CloseButton.svelte';

	export interface BulkAction {
		id: string;
		label: string;
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	}

	interface BulkActionBarProps {
		count?: number;
		actions?: BulkAction[];
		label?: string;
		sticky?: boolean;
		class?: string;
		extra?: Snippet;
		onaction?: (id: string) => void;
		onclear?: () => void;
	}

	const {
		count = 0,
		actions = [
			{ id: 'archive', label: 'Archive', variant: 'secondary' },
			{ id: 'delete', label: 'Delete', variant: 'destructive' }
		],
		label = 'selected',
		sticky = true,
		class: className = '',
		extra,
		onaction,
		onclear
	}: BulkActionBarProps = $props();
</script>

{#if count > 0}
	<div
		class={[
			'flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50/80 px-3 py-2 shadow-sm backdrop-blur dark:border-brand-900/50 dark:bg-brand-950/40',
			sticky && 'sticky bottom-3 z-20',
			className
		]}
		role="status"
	>
		<div class="flex items-center gap-2 text-sm text-primary">
			<CountBadge {count} hideZero={false} variant="primary" />
			<span class="font-medium">{count} {label}</span>
			{#if extra}
				{@render extra()}
			{/if}
		</div>

		<div class="flex items-center gap-2">
			<ButtonGroup attached={false} aria-label="Bulk actions">
				{#each actions as action (action.id)}
					<Button
						size="sm"
						variant={action.variant ?? 'secondary'}
						onclick={() => onaction?.(action.id)}
					>
						{action.label}
					</Button>
				{/each}
			</ButtonGroup>
			{#if onclear}
				<CloseButton label="Clear selection" size="sm" onclick={() => onclear()} />
			{/if}
		</div>
	</div>
{/if}
