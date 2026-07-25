<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Snackbar from './Snackbar.svelte';

	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Show snackbar</Button>
<Snackbar bind:open message="Message archived" actionLabel="Undo" />
