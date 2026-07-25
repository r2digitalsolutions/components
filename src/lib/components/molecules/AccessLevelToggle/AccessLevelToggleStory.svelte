<script lang="ts">
	import AccessLevelToggle from './AccessLevelToggle.svelte';
	import type { AccessLevel } from './AccessLevelToggle.svelte';

	let value = $state<AccessLevel[]>(['read', 'write']);
</script>

<div class="flex flex-wrap items-center gap-4 p-4">
	<AccessLevelToggle bind:value />
	<AccessLevelToggle bind:value compact={false} size="md" />
	<AccessLevelToggle value={['read', 'write', 'admin']} disabled />
	<p class="w-full text-xs text-muted">Selected: {value.join(', ') || 'none'}</p>
</div>
