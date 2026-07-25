<script lang="ts">
	import RichTextEditor from './RichTextEditor.svelte';

	let value = $state('<p>Hello <strong>team</strong> — draft the release notes here.</p>');
</script>

<div class="max-w-xl">
	<RichTextEditor bind:value />
</div>
