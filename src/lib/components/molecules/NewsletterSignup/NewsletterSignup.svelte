<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface NewsletterSignupProps {
		title?: string;
		description?: string;
		placeholder?: string;
		buttonLabel?: string;
		email?: string;
		loading?: boolean;
		success?: boolean;
		class?: string;
		onsubmit?: (email: string) => void;
	}

	let {
		title = 'Stay in the loop',
		description = 'Product updates, no spam.',
		placeholder = 'you@company.com',
		buttonLabel = 'Subscribe',
		email = $bindable(''),
		loading = false,
		success = false,
		class: className = '',
		onsubmit
	}: NewsletterSignupProps = $props();

	function submit(e: Event) {
		e.preventDefault();
		if (!email.trim() || loading) return;
		onsubmit?.(email.trim());
	}
</script>

<div
	class={[
		'rounded-xl border border-border bg-surface-elevated p-5',
		className
	]}
>
	{#if success}
		<p class="text-sm font-semibold text-primary">You're subscribed</p>
		<Text size="xs" tone="muted" class="mt-1">Check your inbox to confirm.</Text>
	{:else}
		<p class="text-sm font-semibold text-primary">{title}</p>
		{#if description}
			<Text size="xs" tone="muted" class="mt-1">{description}</Text>
		{/if}
		<form class="mt-3 flex flex-col gap-2 sm:flex-row" onsubmit={submit}>
			<Input
				type="email"
				size="sm"
				bind:value={email}
				{placeholder}
				required
				class="flex-1"
			/>
			<Button type="submit" size="sm" disabled={loading || !email.trim()}>
				{loading ? '…' : buttonLabel}
			</Button>
		</form>
	{/if}
</div>
