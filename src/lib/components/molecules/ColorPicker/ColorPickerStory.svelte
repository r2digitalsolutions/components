<script lang="ts">
	import ColorPicker from './ColorPicker.svelte';

	let value = $state('#6366f1');
</script>

<div class="w-72 max-w-full">
	<ColorPicker bind:value label="Brand color" />
</div>
