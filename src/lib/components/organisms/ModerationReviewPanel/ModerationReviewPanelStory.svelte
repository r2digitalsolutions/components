<script lang="ts">
	import ModerationReviewPanel from './ModerationReviewPanel.svelte';
	import type { ModerationDecision } from './ModerationReviewPanel.svelte';
	import AnalysisBadge from '$lib/components/atoms/AnalysisBadge/AnalysisBadge.svelte';
	import SuggestedTags from '$lib/components/molecules/SuggestedTags/SuggestedTags.svelte';

	type ReviewItem = {
		id: string;
		name: string;
		source: string;
		uploadedAt: string;
	};
	type Tag = { id: string; label: string; confidence: number };

	const item: ReviewItem = {
		id: 'asset-1842',
		name: 'Summer stage teaser',
		source: 'Organizer upload',
		uploadedAt: '27 Sep 2026, 14:32'
	};
	const tags: Tag[] = [
		{ id: 'concert', label: 'concert', confidence: 0.94 },
		{ id: 'crowd', label: 'crowd', confidence: 0.81 },
		{ id: 'night', label: 'night', confidence: 0.68 }
	];

	let lastAction = $state('No decision made');

	function decide(reviewItem: ReviewItem, decision: ModerationDecision) {
		lastAction = `${decision}: ${reviewItem.name}`;
	}
</script>

{#snippet media(reviewItem: ReviewItem)}
	<figure class="rounded-xl border-border bg-neutral-950 overflow-hidden border">
		<div
			class="aspect-video from-neutral-800 via-neutral-950 to-neutral-800 p-8 flex items-center justify-center bg-gradient-to-br text-center"
		>
			<div>
				<div class="mb-3 h-14 w-14 border-white/20 bg-white/10 mx-auto rounded-full border"></div>
				<p class="text-sm font-medium text-white">{reviewItem.name}</p>
				<p class="mt-1 text-xs text-neutral-400">Video preview placeholder</p>
			</div>
		</div>
		<figcaption class="bg-neutral-950 px-3 py-2 text-xs text-neutral-400">00:00 / 00:24</figcaption>
	</figure>
{/snippet}

{#snippet summary(reviewItem: ReviewItem)}
	<div>
		<div class="mb-3 gap-3 flex items-center justify-between">
			<h3 class="text-sm font-semibold text-primary">Review summary</h3>
			<AnalysisBadge status="complete" />
		</div>
		<dl class="gap-x-3 gap-y-2 text-sm grid grid-cols-[auto_1fr]">
			<dt class="text-muted">Source</dt>
			<dd class="text-primary text-right">{reviewItem.source}</dd>
			<dt class="text-muted">Uploaded</dt>
			<dd class="text-primary text-right">{reviewItem.uploadedAt}</dd>
		</dl>
	</div>
{/snippet}

{#snippet analysis()}
	<div class="border-border pt-4 border-t">
		<h3 class="mb-2.5 text-sm font-semibold text-primary">Suggested tags</h3>
		<SuggestedTags
			items={tags}
			getKey={(tag) => tag.id}
			getLabel={(tag) => tag.label}
			getConfidence={(tag) => tag.confidence}
		/>
	</div>
{/snippet}

<div class="max-w-6xl p-4 mx-auto">
	<ModerationReviewPanel
		{item}
		title="Moderation review"
		description="Inspect the asset and choose the appropriate outcome."
		position={3}
		total={18}
		{media}
		{summary}
		{analysis}
		ondecision={decide}
		onnext={(reviewItem) => (lastAction = `skipped: ${reviewItem.name}`)}
	/>
	<p class="mt-3 text-xs text-muted text-center" aria-live="polite">{lastAction}</p>
</div>
