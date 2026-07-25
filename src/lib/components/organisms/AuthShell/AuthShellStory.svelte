<script lang="ts">
	import AuthShell from './AuthShell.svelte';
	import LoginForm from '$lib/components/organisms/LoginForm/LoginForm.svelte';

	let props = $props<{ brand?: string; tagline?: string }>();
</script>

<AuthShell brand={props.brand ?? 'R2DigiSolutions'} tagline={props.tagline}>
	<LoginForm />
</AuthShell>
