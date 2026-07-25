<script lang="ts">
	import MentionInput from './MentionInput.svelte';

	let value = $state('Hey @');
	const suggestions = [
		{ id: '1', label: 'alex', description: 'Alex Rivera' },
		{ id: '2', label: 'sam', description: 'Sam Chen' },
		{ id: '3', label: 'jordan', description: 'Jordan Lee' }
	];
</script>

<MentionInput bind:value {suggestions} class="w-full max-w-md" />
