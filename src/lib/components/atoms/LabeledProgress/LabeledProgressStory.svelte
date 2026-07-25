<script lang="ts">
	import LabeledProgress from './LabeledProgress.svelte';

	let props = $props<{ label?: string; value?: number; helper?: string }>();
</script>

<div class="max-w-sm space-y-4">
	<LabeledProgress
		label={props.label ?? 'Storage used'}
		value={props.value ?? 72}
		helper={props.helper ?? '7.2 GB of 10 GB'}
	/>
	<LabeledProgress label="Upload" value={34} helper="Uploading assets…" />
</div>
