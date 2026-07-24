<script lang="ts">
	import Pagination from './Pagination.svelte';

	let props = $props<{
		totalPages?: number;
		siblingCount?: number;
		disabled?: boolean;
	}>();

	let page = $state(1);
</script>

<div class="space-y-3">
	<Pagination
		bind:page
		totalPages={props.totalPages ?? 12}
		siblingCount={props.siblingCount ?? 1}
		disabled={props.disabled ?? false}
	/>
	<p class="text-xs text-secondary">Page {page} of {props.totalPages ?? 12}</p>
</div>
