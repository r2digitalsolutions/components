<script lang="ts">
	import TrimHandle from './TrimHandle.svelte';
</script>

<div class="relative h-10 w-64 rounded-md bg-brand-500">
	<TrimHandle side="start" />
	<TrimHandle side="end" />
	<span class="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-white">
		Clip
	</span>
</div>
