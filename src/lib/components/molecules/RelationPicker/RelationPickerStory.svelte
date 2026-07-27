<script lang="ts">
	import RelationPicker from './RelationPicker.svelte';
	import type { RelationOption } from './RelationPicker.svelte';

	const options: RelationOption[] = [
		{ id: '1', title: 'Acme Corp', subtitle: 'Customer', kind: 'org' },
		{ id: '2', title: 'Jane Doe', subtitle: 'jane@acme.com', kind: 'user' },
		{ id: '3', title: 'Project Atlas', subtitle: 'Active', kind: 'project' }
	];

	let value = $state<string | string[]>('1');
</script>

<div class="mx-auto max-w-md p-6">
	<RelationPicker bind:value {options} multiple={false} />
</div>
