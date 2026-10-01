<script lang="ts">
	import MediaAnalysisPanel from './MediaAnalysisPanel.svelte';
	import type { AnalysisStatus } from '$lib/components/atoms/AnalysisBadge/AnalysisBadge.svelte';

	type Classification = { id: string; label: string; confidence: number };
	type Tag = { id: string; label: string; confidence: number };

	let { status = 'complete' }: { status?: AnalysisStatus } = $props();

	const classifications: Classification[] = [
		{ id: 'concert', label: 'Live concert', confidence: 0.94 },
		{ id: 'crowd', label: 'Crowd scene', confidence: 0.71 },
		{ id: 'nightlife', label: 'Nightlife', confidence: 0.43 }
	];
	const tags: Tag[] = [
		{ id: 'stage', label: 'stage', confidence: 0.96 },
		{ id: 'music', label: 'music', confidence: 0.91 },
		{ id: 'crowd', label: 'crowd', confidence: 0.82 },
		{ id: 'lights', label: 'lights', confidence: 0.67 }
	];

	let selectedClassificationKey = $state('concert');
	let selectedTagKeys = $state(['stage', 'music']);

	function toggleTag(tag: Tag, selected: boolean) {
		selectedTagKeys = selected
			? [...selectedTagKeys, tag.id]
			: selectedTagKeys.filter((key) => key !== tag.id);
	}
</script>

<div class="max-w-4xl p-4 mx-auto">
	<MediaAnalysisPanel
		{status}
		title="Media analysis"
		description="Review model output before applying it to this asset."
		classifications={{
			items: classifications,
			getKey: (item) => item.id,
			getLabel: (item) => item.label,
			getConfidence: (item) => item.confidence,
			selectedKey: selectedClassificationKey,
			onselect: (item) => (selectedClassificationKey = item.id)
		}}
		tags={{
			items: tags,
			getKey: (item) => item.id,
			getLabel: (item) => item.label,
			getConfidence: (item) => item.confidence,
			selectedKeys: selectedTagKeys,
			onselectionchange: toggleTag
		}}
	/>
</div>
