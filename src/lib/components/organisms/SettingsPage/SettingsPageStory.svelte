<script lang="ts">
	import SettingsPage from './SettingsPage.svelte';

	let value = $state('notifications');
	let dirty = $state(false);
</script>

<div class="mx-auto max-w-3xl p-4">
	<SettingsPage bind:value bind:dirty />
</div>
