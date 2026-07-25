<script lang="ts">
	import AuthTemplate from './AuthTemplate.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Link from '$lib/components/atoms/Link/Link.svelte';
</script>

<div class="overflow-hidden rounded-2xl border border-border">
	<AuthTemplate fullHeight={false} class="min-h-[32rem]">
		<form class="space-y-3" onsubmit={(e) => e.preventDefault()}>
			<Input label="Email" type="email" placeholder="you@company.com" />
			<Input label="Password" type="password" />
			<Button fullWidth type="submit">Continue</Button>
		</form>
		{#snippet footer()}
			Need an account? <Link href="#">Register</Link>
		{/snippet}
	</AuthTemplate>
</div>
