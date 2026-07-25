<script lang="ts">
	import DropZone from './DropZone.svelte';

	let files = $state<File[]>([]);
</script>

<div class="max-w-xl space-y-6">
	<section class="space-y-2">
		<h3 class="text-sm font-semibold text-primary">Multiple + image preview</h3>
		<DropZone
			bind:files
			accept="image/*,.pdf"
			multiple
			maxFiles={8}
			label="Drop images or PDFs"
			hint="Click or drag — multiple files allowed"
		/>
	</section>

	<section class="space-y-2">
		<h3 class="text-sm font-semibold text-primary">Single file</h3>
		<DropZone
			multiple={false}
			accept="image/*"
			label="Drop a single image"
			hint="Replaces previous selection"
			maxSizeMb={5}
		/>
	</section>

	{#if files.length}
		<p class="text-xs text-muted">
			Bound files: {files.map((f) => f.name).join(', ')}
		</p>
	{/if}
</div>
