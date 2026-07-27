<script lang="ts">
	import EntityPreview from './EntityPreview.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
</script>

<div class="max-w-md space-y-3">
	<p class="text-sm font-semibold text-primary">Entity preview</p>
	<Stack gap="sm">
		<EntityPreview
			title="Design system"
			subtitle="Updated 2 hours ago"
			meta="12 files"
			kind="Project"
			image="https://picsum.photos/seed/ds/80"
			onclick={() => {}}
		/>
		<EntityPreview
			title="Maya Chen"
			subtitle="Product Designer"
			kind="User"
			meta="Online"
			href="#"
		/>
	</Stack>
</div>
