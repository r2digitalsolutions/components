<script lang="ts">
	import ReadMore from './ReadMore.svelte';

	let props = $props<{
		maxLength?: number;
	}>();
</script>

<div class="max-w-md rounded-2xl border border-border bg-surface-elevated p-4">
	<ReadMore
		maxLength={props.maxLength ?? 120}
		text="Atomic design helps teams scale UI systems by composing atoms into molecules and organisms. This library follows that approach with Svelte 5 runes, Tailwind 4 tokens, and first-class light/dark support so product teams can ship consistent interfaces faster."
	/>
</div>
