<script lang="ts">
	import HamburgerButton from './HamburgerButton.svelte';

	let open = $state(false);
</script>

<div class="flex items-center gap-3">
	<HamburgerButton bind:open />
	<span class="text-sm text-secondary">{open ? 'Open' : 'Closed'}</span>
</div>
