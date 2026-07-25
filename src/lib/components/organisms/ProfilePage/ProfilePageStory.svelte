<script lang="ts">
	import ProfilePage from './ProfilePage.svelte';

	let props = $props<{ name?: string; email?: string }>();
	let tab = $state('overview');
</script>

<div class="mx-auto max-w-3xl p-4">
	<ProfilePage
		name={props.name ?? 'Ada Lovelace'}
		email={props.email ?? 'ada@example.com'}
		bind:tab
	/>
</div>
