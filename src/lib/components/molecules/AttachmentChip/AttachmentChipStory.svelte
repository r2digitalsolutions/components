<script lang="ts">
	import AttachmentChip from './AttachmentChip.svelte';
</script>

<div class="max-w-md space-y-3">
	<p class="text-sm font-semibold text-primary">Attachment chips</p>
	<div class="flex flex-wrap gap-2">
		<AttachmentChip name="brief.pdf" size="1.2 MB" type="PDF" removable onremove={() => {}} />
		<AttachmentChip name="mockup.png" size="840 KB" type="PNG" onclick={() => {}} />
	</div>
</div>
