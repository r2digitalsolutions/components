<script lang="ts">
	import Checklist from './Checklist.svelte';
</script>

<div class="max-w-sm rounded-2xl border border-border bg-surface-elevated p-4">
	<Checklist
		items={[
			{ id: '1', label: 'Create workspace', done: true },
			{ id: '2', label: 'Invite teammates', done: true },
			{ id: '3', label: 'Connect billing', done: false },
			{ id: '4', label: 'Ship first release', done: false }
		]}
	/>
</div>
