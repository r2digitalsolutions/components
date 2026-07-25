<script lang="ts">
	import SettingsForm from './SettingsForm.svelte';

	let name = $state('Rafael Gonzalez');
	let email = $state('rafael@r2digisolutions.com');
</script>

<SettingsForm bind:name bind:email />
