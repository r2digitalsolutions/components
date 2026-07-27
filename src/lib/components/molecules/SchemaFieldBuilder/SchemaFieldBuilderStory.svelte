<script lang="ts">
	import SchemaFieldBuilder from './SchemaFieldBuilder.svelte';
	import type { ResourceField } from '$lib/components/organisms/ResourceStudio/types.js';

	let fields = $state<ResourceField[]>([
		{ id: 'name', label: 'Name', type: 'string', required: true },
		{ id: 'status', label: 'Status', type: 'enum', options: [
			{ value: 'active', label: 'Active' },
			{ value: 'draft', label: 'Draft' }
		]}
	]);
</script>

<div class="mx-auto max-w-xl p-4">
	<SchemaFieldBuilder bind:fields />
</div>
