<script lang="ts">
	import AuthCard from './AuthCard.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Link from '$lib/components/atoms/Link/Link.svelte';
</script>

<AuthCard title="Welcome back" description="Sign in to continue to your workspace.">
	<form class="space-y-3" onsubmit={(e) => e.preventDefault()}>
		<Input label="Email" type="email" placeholder="you@company.com" />
		<Input label="Password" type="password" placeholder="••••••••" />
		<Button fullWidth type="submit">Sign in</Button>
	</form>
	{#snippet footer()}
		Don&apos;t have an account? <Link href="#">Create one</Link>
	{/snippet}
</AuthCard>
