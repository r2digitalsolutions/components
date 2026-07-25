<script lang="ts">
	import RichTextEditor from './RichTextEditor.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let {
		variant = 'default',
		showFooter = true
	}: {
		variant?: 'default' | 'minimal';
		showFooter?: boolean;
	} = $props();

	let value = $state(`<h2>Release notes</h2>
<p>Ship the new <strong>dock panels</strong> and polish the editor experience.</p>
<ul>
<li>Area charts from Atom</li>
<li>Bulk action bar redesign</li>
<li>Credit card brand detection</li>
</ul>
<blockquote>Keep the toolbar dense — not a Word clone.</blockquote>
<p>Docs: <a href="https://r2digisolutions.com">r2digisolutions.com</a></p>`);
</script>

<div class="mx-auto max-w-2xl space-y-3">
	<RichTextEditor
		bind:value
		{variant}
		{showFooter}
		maxLength={4000}
		minHeight="14rem"
		maxHeight="22rem"
		placeholder="Write release notes, comments, or docs…"
	/>
	<Text size="xs" tone="muted">
		Try headings, lists, quote, link (⌘K), undo/redo. Active formats highlight in the toolbar.
	</Text>
</div>
