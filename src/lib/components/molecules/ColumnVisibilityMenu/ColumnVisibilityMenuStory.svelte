<script lang="ts">
	import ColumnVisibilityMenu from './ColumnVisibilityMenu.svelte';
	import type { ColumnVisibilityItem } from './ColumnVisibilityMenu.svelte';

	let columns = $state<ColumnVisibilityItem[]>([
		{ id: 'name', label: 'Name', locked: true },
		{ id: 'email', label: 'Email', visible: true },
		{ id: 'role', label: 'Role', visible: true },
		{ id: 'created', label: 'Created', visible: false }
	]);
</script>

<div class="p-6">
	<ColumnVisibilityMenu bind:columns />
</div>
