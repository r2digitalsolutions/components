<script lang="ts">
	import InfoTile from './InfoTile.svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';
</script>

<Grid cols={1} gap="md" class="max-w-2xl sm:grid-cols-2">
	<InfoTile title="Docs" description="Guides, API references, and examples." tone="info" />
	<InfoTile title="Support" description="Talk to a human when you get stuck." tone="brand" />
	<InfoTile title="Status" description="All systems operational." tone="success" />
	<InfoTile title="Security" description="SSO, audit logs, and 2FA." tone="warning" />
</Grid>
