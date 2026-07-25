<script lang="ts">
	import SlugInput from './SlugInput.svelte';

	let value = $state('hello-world');
</script>

<div class="max-w-md">
	<SlugInput
		bind:value
		prefix="example.com/"
		helperText="Only lowercase letters, numbers, and hyphens."
	/>
</div>
