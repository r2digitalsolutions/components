<script module lang="ts">
	export type ModerationDecision = 'approve' | 'reject' | 'escalate';
</script>

<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';

	interface ModerationReviewPanelProps {
		item: T;
		title: string;
		description?: string;
		position?: number;
		total?: number;
		media: Snippet<[T]>;
		summary?: Snippet<[T]>;
		analysis?: Snippet<[T]>;
		ondecision?: (item: T, decision: ModerationDecision) => void;
		onnext?: (item: T) => void;
		loadingDecision?: ModerationDecision;
		disabled?: boolean;
		approveLabel?: string;
		rejectLabel?: string;
		escalateLabel?: string;
		nextLabel?: string;
		class?: string;
	}

	const {
		item,
		title,
		description,
		position,
		total,
		media,
		summary,
		analysis,
		ondecision,
		onnext,
		loadingDecision,
		disabled = false,
		approveLabel = 'Approve',
		rejectLabel = 'Reject',
		escalateLabel = 'Escalate',
		nextLabel = 'Next',
		class: className = ''
	}: ModerationReviewPanelProps = $props();

	const uid = $props.id();
	const titleId = `${uid}-title`;
	const busy = $derived(loadingDecision !== undefined);
</script>

<section class={className} aria-labelledby={titleId} aria-busy={busy}>
	<Card padding="none">
		<header
			class="gap-3 border-border px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:py-4 flex flex-col border-b"
		>
			<div class="min-w-0">
				<h2 id={titleId} class="text-base font-semibold text-primary">{title}</h2>
				{#if description}<p class="mt-1 text-sm text-muted">{description}</p>{/if}
			</div>
			{#if position !== undefined && total !== undefined}
				<Badge variant="secondary" rounded>{position} of {total}</Badge>
			{/if}
		</header>

		<div class="min-w-0 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] grid">
			<div
				class="min-w-0 border-border bg-surface-overlay/40 p-3 sm:p-4 lg:border-r lg:border-b-0 border-b"
			>
				{@render media(item)}
			</div>
			<aside class="min-w-0 space-y-4 p-4 sm:p-5" aria-label="Review details">
				{#if summary}{@render summary(item)}{/if}
				{#if analysis}{@render analysis(item)}{/if}
			</aside>
		</div>

		{#if ondecision || onnext}
			<footer
				class="gap-2 border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 flex flex-col-reverse border-t"
			>
				<div class="gap-2 sm:flex-row flex flex-col">
					{#if ondecision}
						<Button
							variant="destructive"
							size="sm"
							disabled={disabled || busy}
							loading={loadingDecision === 'reject'}
							onclick={() => ondecision?.(item, 'reject')}>{rejectLabel}</Button
						>
						<Button
							variant="outline"
							size="sm"
							disabled={disabled || busy}
							loading={loadingDecision === 'escalate'}
							onclick={() => ondecision?.(item, 'escalate')}>{escalateLabel}</Button
						>
					{/if}
				</div>
				<div class="gap-2 sm:flex-row flex flex-col">
					{#if onnext}
						<Button
							variant="ghost"
							size="sm"
							disabled={disabled || busy}
							onclick={() => onnext?.(item)}>{nextLabel}</Button
						>
					{/if}
					{#if ondecision}
						<Button
							size="sm"
							disabled={disabled || busy}
							loading={loadingDecision === 'approve'}
							onclick={() => ondecision?.(item, 'approve')}>{approveLabel}</Button
						>
					{/if}
				</div>
			</footer>
		{/if}
	</Card>
</section>
