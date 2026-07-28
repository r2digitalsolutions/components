<script lang="ts">
	import MediaKindIcon from './MediaKindIcon.svelte';
</script>

<div class="flex items-center gap-4 text-secondary">
	{#each ['image', 'video', 'audio', 'text'] as kind (kind)}
		<span class="inline-flex items-center gap-1.5 text-sm">
			<MediaKindIcon kind={kind as 'image' | 'video' | 'audio' | 'text'} />
			{kind}
		</span>
	{/each}
</div>
