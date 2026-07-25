<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Accordion from '$lib/components/molecules/Accordion/Accordion.svelte';
	import type { AccordionItem } from '$lib/components/molecules/Accordion/Accordion.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';

	export interface FaqItem {
		id: string;
		question: string;
		answer: string;
		category?: string;
	}

	interface FAQProps {
		title?: string;
		description?: string;
		items?: FaqItem[];
		query?: string;
		class?: string;
	}

	let {
		title = 'FAQ',
		description = 'Answers to common questions.',
		items = [],
		query = $bindable(''),
		class: className = ''
	}: FAQProps = $props();

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter(
			(i) =>
				i.question.toLowerCase().includes(q) ||
				i.answer.toLowerCase().includes(q) ||
				(i.category ?? '').toLowerCase().includes(q)
		);
	});

	const accordionItems = $derived(
		filtered.map(
			(i): AccordionItem => ({
				id: i.id,
				title: i.question,
				content: i.answer
			})
		)
	);
</script>

<div class={['mx-auto w-full max-w-2xl space-y-5', className]}>
	<PageHeader {title} {description} />
	<SearchInput bind:value={query} placeholder="Search questions…" size="sm" />

	{#if accordionItems.length === 0}
		<EmptyState title="No matches" description="Try a different search term." />
	{:else}
		<Accordion items={accordionItems} />
	{/if}
</div>
