<script lang="ts">
	import FileUploader from './FileUploader.svelte';

	let props = $props<{
		label?: string;
		helperText?: string;
		accept?: string;
		multiple?: boolean;
		maxSizeMb?: number;
		disabled?: boolean;
	}>();
</script>

<div class="w-80 max-w-full">
	<FileUploader
		label={props.label ?? 'Project Attachments'}
		helperText={props.helperText ?? 'PNG, JPG, PDF or DOCX (max 10MB)'}
		accept={props.accept ?? '*'}
		multiple={props.multiple ?? true}
		maxSizeMb={props.maxSizeMb ?? 10}
		disabled={props.disabled ?? false}
	/>
</div>
