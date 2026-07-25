<script lang="ts">
	import NoteCard from './NoteCard.svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';
</script>

<Grid cols={1} gap="md" class="max-w-2xl sm:grid-cols-2">
	<NoteCard
		title="Launch checklist"
		body="Confirm analytics events before shipping Chart to production."
		author="Maya"
		avatar="https://i.pravatar.cc/40?img=20"
		date={Date.now() - 1000 * 60 * 35}
		tone="yellow"
	/>
	<NoteCard
		title="Support"
		body="Customer asked about SSO — point them to Business plan docs."
		author="Jordan"
		avatar="https://i.pravatar.cc/40?img=33"
		date={Date.now() - 1000 * 60 * 120}
		tone="sky"
	/>
</Grid>
