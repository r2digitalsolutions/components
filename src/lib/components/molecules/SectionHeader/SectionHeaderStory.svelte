<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
</script>

<div class="max-w-xl space-y-4">
	<SectionHeader title="Team members" description="Manage access and roles for your workspace.">
		{#snippet actions()}
			<Button size="sm">Invite</Button>
		{/snippet}
	</SectionHeader>
	<p class="text-sm text-secondary">Section content goes below the header.</p>
</div>
