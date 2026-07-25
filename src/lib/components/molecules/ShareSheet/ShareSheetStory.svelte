<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ShareSheet from './ShareSheet.svelte';

	let open = $state(false);
</script>

<Button variant="secondary" onclick={() => (open = true)}>Share</Button>
<ShareSheet bind:open title="Check this out" url="https://r2digisolutions.com" text="Nice component library" />
