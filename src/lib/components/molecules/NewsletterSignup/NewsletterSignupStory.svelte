<script lang="ts">
	import NewsletterSignup from './NewsletterSignup.svelte';

	let email = $state('');
	let success = $state(false);
</script>

<div class="max-w-md">
	<NewsletterSignup
		bind:email
		{success}
		onsubmit={() => {
			success = true;
		}}
	/>
</div>
