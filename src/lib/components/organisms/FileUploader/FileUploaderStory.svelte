<script lang="ts">
	import FileUploader from './FileUploader.svelte';

	let props = $props<{
		label?: string;
		helperText?: string;
		accept?: string;
		variant?: 'multiple' | 'single' | 'avatar';
		view?: 'list' | 'grid';
		layout?: 'horizontal' | 'vertical' | 'compact';
		showViewToggle?: boolean;
		maxSizeMb?: number;
		disabled?: boolean;
		src?: string;
		srcName?: string;
	}>();
</script>

<div class={['max-w-full', props.layout === 'vertical' ? 'w-64' : 'w-96']}>
	<FileUploader
		label={props.label ?? 'Project Attachments'}
		helperText={props.helperText ?? 'PNG, JPG, PDF or DOCX (max 10MB)'}
		accept={props.accept ?? '*'}
		variant={props.variant ?? 'multiple'}
		view={props.view ?? 'list'}
		layout={props.layout ?? 'horizontal'}
		showViewToggle={props.showViewToggle ?? true}
		maxSizeMb={props.maxSizeMb ?? 10}
		disabled={props.disabled ?? false}
		src={props.src ?? ''}
		srcName={props.srcName ?? ''}
	/>
</div>
