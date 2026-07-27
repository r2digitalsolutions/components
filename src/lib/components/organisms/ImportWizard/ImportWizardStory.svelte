<script lang="ts">
	import ImportWizard from './ImportWizard.svelte';

	const columns = [
		{ id: 'name', label: 'Name' },
		{ id: 'email', label: 'Email' },
		{ id: 'role', label: 'Role' }
	];
</script>

<div class="p-6">
	<ImportWizard
		{columns}
		onimport={(r) => console.log('import', r)}
	/>
</div>
