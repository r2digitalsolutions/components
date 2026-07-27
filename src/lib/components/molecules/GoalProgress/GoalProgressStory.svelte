<script lang="ts">
	import GoalProgress from './GoalProgress.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
</script>

<div class="mx-auto max-w-lg p-4">
	<Stack gap="sm">
		<GoalProgress label="Monthly revenue" current={7200} target={10000} unit=" USD" tone="brand" />
		<GoalProgress label="New signups" current={142} target={150} tone="success" />
		<GoalProgress label="Support tickets resolved" current={38} target={100} tone="warning" />
	</Stack>
</div>
