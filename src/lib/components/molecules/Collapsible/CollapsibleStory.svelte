<script lang="ts">
	import Collapsible from './Collapsible.svelte';

	let props = $props<{
		open?: boolean;
		title?: string;
		disabled?: boolean;
	}>();

	let open = $state(false);

	$effect(() => {
		open = props.open ?? false;
	});
</script>

<div class="w-full max-w-md">
	<Collapsible bind:open title={props.title ?? 'Shipping details'} disabled={props.disabled ?? false}>
		<p>
			Orders usually ship within 2 business days. You will receive a tracking number by email once the
			package leaves our warehouse.
		</p>
	</Collapsible>
</div>
