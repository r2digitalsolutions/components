<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ConfirmDelete from './ConfirmDelete.svelte';

	let open = $state(false);
</script>

<div class="space-y-3">
	<Button variant="destructive" size="sm" onclick={() => (open = true)}>Delete project</Button>
	<ConfirmDelete
		bind:open
		entity="project"
		itemName="Acme"
		requireTyping
		onconfirm={() => {
			open = false;
			alert('deleted');
		}}
	/>
</div>
