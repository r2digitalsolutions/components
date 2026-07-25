<script lang="ts">
	import AddressFields from './AddressFields.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';

	let line1 = $state('Calle Mayor 12');
	let line2 = $state('');
	let city = $state('Madrid');
	let region = $state('Madrid');
	let postal = $state('28013');
	let country = $state('ES');
</script>

<Card class="max-w-lg" padding="lg" chrome={false}>
	<AddressFields
		bind:line1
		bind:line2
		bind:city
		bind:state={region}
		bind:postal
		bind:country
	/>
</Card>
