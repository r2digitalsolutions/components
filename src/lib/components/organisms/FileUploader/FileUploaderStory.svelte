<script lang="ts">
	import FileUploader from './FileUploader.svelte';

	let props = $props<{
		label?: string;
		helperText?: string;
		accept?: string;
		variant?: 'multiple' | 'single' | 'avatar';
		view?: 'list' | 'grid';
		showViewToggle?: boolean;
		maxSizeMb?: number;
		disabled?: boolean;
	}>();
</script>

<div class="w-96 max-w-full">
	<FileUploader
		label={props.label ?? 'Project Attachments'}
		helperText={props.helperText ?? 'PNG, JPG, PDF or DOCX (max 10MB)'}
		accept={props.accept ?? '*'}
		variant={props.variant ?? 'multiple'}
		view={props.view ?? 'list'}
		showViewToggle={props.showViewToggle ?? true}
		maxSizeMb={props.maxSizeMb ?? 10}
		disabled={props.disabled ?? false}
	/>
</div>
