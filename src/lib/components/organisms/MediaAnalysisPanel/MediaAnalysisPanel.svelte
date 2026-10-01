<script module lang="ts">
	export interface ClassificationSuggestionSource<T> {
		items: readonly T[];
		getKey: (item: T) => string;
		getLabel: (item: T) => string;
		getConfidence: (item: T) => number;
		selectedKey?: string;
		onselect?: (item: T) => void;
	}

	export interface SuggestedTagSource<T> {
		items: readonly T[];
		getKey: (item: T) => string;
		getLabel: (item: T) => string;
		getConfidence?: (item: T) => number | undefined;
		selectedKeys?: readonly string[];
		onselectionchange?: (item: T, selected: boolean) => void;
	}
</script>

<script lang="ts" generics="TClassification = never, TTag = never">
	import type { Snippet } from 'svelte';
	import AnalysisBadge from '$lib/components/atoms/AnalysisBadge/AnalysisBadge.svelte';
	import type { AnalysisStatus } from '$lib/components/atoms/AnalysisBadge/AnalysisBadge.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import ClassificationSuggestion from '$lib/components/molecules/ClassificationSuggestion/ClassificationSuggestion.svelte';
	import SuggestedTags from '$lib/components/molecules/SuggestedTags/SuggestedTags.svelte';

	interface MediaAnalysisPanelProps {
		status: AnalysisStatus;
		title?: string;
		description?: string;
		statusLabels?: Partial<Record<AnalysisStatus, string>>;
		classifications?: ClassificationSuggestionSource<TClassification>;
		tags?: SuggestedTagSource<TTag>;
		classificationsTitle?: string;
		tagsTitle?: string;
		disabled?: boolean;
		details?: Snippet;
		class?: string;
	}

	const {
		status,
		title = 'Media analysis',
		description,
		statusLabels = {},
		classifications,
		tags,
		classificationsTitle = 'Classification',
		tagsTitle = 'Suggested tags',
		disabled = false,
		details,
		class: className = ''
	}: MediaAnalysisPanelProps = $props();

	const uid = $props.id();
	const titleId = `${uid}-title`;
</script>

<section class={className} aria-labelledby={titleId}>
	<Card padding="none">
		<div
			class="gap-3 border-border px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:py-4 flex flex-col border-b"
		>
			<div class="min-w-0">
				<h2 id={titleId} class="text-base font-semibold text-primary">{title}</h2>
				{#if description}<p class="mt-1 text-sm text-muted">{description}</p>{/if}
			</div>
			<AnalysisBadge {status} labels={statusLabels} />
		</div>

		{#if classifications || tags}
			<div class={['gap-5 px-4 py-4 sm:px-5 grid', classifications && tags && 'lg:grid-cols-2']}>
				{#if classifications}
					<section aria-labelledby={`${titleId}-classifications`}>
						<h3 id={`${titleId}-classifications`} class="mb-2.5 text-sm font-semibold text-primary">
							{classificationsTitle}
						</h3>
						<ClassificationSuggestion
							items={classifications.items}
							getKey={classifications.getKey}
							getLabel={classifications.getLabel}
							getConfidence={classifications.getConfidence}
							selectedKey={classifications.selectedKey}
							{disabled}
							onselect={classifications.onselect}
						/>
					</section>
				{/if}

				{#if tags}
					<section aria-labelledby={`${titleId}-tags`}>
						<h3 id={`${titleId}-tags`} class="mb-2.5 text-sm font-semibold text-primary">
							{tagsTitle}
						</h3>
						<SuggestedTags
							items={tags.items}
							getKey={tags.getKey}
							getLabel={tags.getLabel}
							getConfidence={tags.getConfidence}
							selectedKeys={tags.selectedKeys}
							{disabled}
							onselectionchange={tags.onselectionchange}
						/>
					</section>
				{/if}
			</div>
		{/if}

		{#if details}
			<div class="border-border px-4 py-4 sm:px-5 border-t">{@render details()}</div>
		{/if}
	</Card>
</section>
