<script lang="ts">
	interface ReadMoreProps {
		text: string;
		maxLength?: number;
		moreLabel?: string;
		lessLabel?: string;
		class?: string;
	}

	let {
		text,
		maxLength = 160,
		moreLabel = 'Read more',
		lessLabel = 'Show less',
		class: className = ''
	}: ReadMoreProps = $props();

	let expanded = $state(false);

	const needsClamp = $derived(text.length > maxLength);
	const display = $derived(
		!needsClamp || expanded ? text : `${text.slice(0, maxLength).trimEnd()}…`
	);
</script>

<div class={['text-sm text-secondary leading-relaxed', className]}>
	<p>{display}</p>
	{#if needsClamp}
		<button
			type="button"
			class="mt-1 font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-sm"
			onclick={() => (expanded = !expanded)}
			aria-expanded={expanded}
		>
			{expanded ? lessLabel : moreLabel}
		</button>
	{/if}
</div>
