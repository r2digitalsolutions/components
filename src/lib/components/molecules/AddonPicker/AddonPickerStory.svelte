<script lang="ts">
	import AddonPicker from './AddonPicker.svelte';

	let addons = $state([
		{
			id: 'sso',
			name: 'SSO / SAML',
			description: 'Enterprise single sign-on for your team.',
			price: 49,
			selected: true
		},
		{
			id: 'audit',
			name: 'Audit logs',
			description: 'Extended retention and export.',
			price: 29,
			selected: false
		},
		{
			id: 'priority',
			name: 'Priority support',
			description: '24/7 response with dedicated channel.',
			price: 99,
			selected: false
		}
	]);

	let last = $state('');

	function handleChange(id: string, selected: boolean) {
		addons = addons.map((a) => (a.id === id ? { ...a, selected } : a));
		last = `${id}: ${selected}`;
	}
</script>

<div class="mx-auto max-w-lg p-4">
	<AddonPicker {addons} onchange={handleChange} />
	{#if last}
		<p class="mt-4 text-center text-xs text-muted">Changed: {last}</p>
	{/if}
</div>
