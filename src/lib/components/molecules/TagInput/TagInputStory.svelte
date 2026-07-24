<script lang="ts">
	import TagInput from './TagInput.svelte';

	let props = $props<{ disabled?: boolean; max?: number }>();
	let value = $state(['svelte', 'design-system']);
</script>

<div class="w-96 max-w-full">
	<TagInput
		bind:value
		label="Tags"
		disabled={props.disabled ?? false}
		max={props.max}
		placeholder="Add technology…"
	/>
</div>
