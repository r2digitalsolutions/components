<script lang="ts">
	import EnvBadge from './EnvBadge.svelte';
</script>

<div class="flex flex-wrap items-center gap-2">
	<EnvBadge env="development" />
	<EnvBadge env="staging" />
	<EnvBadge env="preview" />
	<EnvBadge env="test" />
	<EnvBadge env="production" />
	<EnvBadge env="development" size="md" label="Local" />
</div>
