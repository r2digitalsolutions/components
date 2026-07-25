<script lang="ts">
	import AvatarLabel from './AvatarLabel.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
</script>

<Stack gap="md">
	<AvatarLabel
		name="Ada Lovelace"
		description="Staff Engineer"
		avatar="https://i.pravatar.cc/80?img=5"
		status="online"
	/>
	<AvatarLabel name="Alan Turing" description="Research" avatar="https://i.pravatar.cc/80?img=12" />
</Stack>
