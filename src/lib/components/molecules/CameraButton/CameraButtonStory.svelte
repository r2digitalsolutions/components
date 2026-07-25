<script lang="ts">
	import CameraButton from './CameraButton.svelte';

	let name = $state('');
</script>

<div class="flex items-center gap-3">
	<CameraButton oncapture={(f) => (name = f.name)} />
	<span class="text-sm text-secondary">{name || 'No photo yet'}</span>
</div>
