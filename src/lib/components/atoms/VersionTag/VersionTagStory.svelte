<script lang="ts">
	import VersionTag from './VersionTag.svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
	<VersionTag version="1.2.3" />
	<VersionTag version="2.0.0-beta.1" tone="brand" size="md" />
	<VersionTag version="3.4.0" tone="success" />
	<VersionTag version="2024.07" prefix="" />
</div>
