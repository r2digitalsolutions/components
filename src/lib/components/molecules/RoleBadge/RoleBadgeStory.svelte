<script lang="ts">
	import RoleBadge from './RoleBadge.svelte';
</script>

<div class="flex flex-wrap gap-2">
	<RoleBadge role="owner" />
	<RoleBadge role="admin" />
	<RoleBadge role="member" />
	<RoleBadge role="viewer" />
	<RoleBadge role="custom" label="Contractor" />
</div>
